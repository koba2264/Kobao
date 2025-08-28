import axios from "axios";
import { getTokens, saveTokens, clearTokens } from "./token";

// flaskのアクセス先
export const api = axios.create({
  baseURL: "https://d050afcb465b.ngrok-free.app",
  // baseURL: "http://127.0.0.1:5000",
});

// --- 同時 401 対策のキュー ---
// あるリクエストが 401 → refresh 中に、他リクエストも 401 になると、
// refresh が二重に走って race condition になる。これを queue で防ぐ。
let isRefreshing = false;
let waitQueue: Array<(t: string | null) => void> = [];

function queueWaiter(resolve: (t: string | null) => void) {
  waitQueue.push(resolve);
}

function flushQueue(newAccess: string | null) {
  waitQueue.forEach((r) => r(newAccess));
  waitQueue = [];
}

// --- リクエスト前インターセプタ ---
// 送信ごとに最新の access を Authorization に付与
api.interceptors.request.use(async (config) => {
  const t = await getTokens();
  if (t?.access) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${t.access}`;
  }
  return config;
});

// --- レスポンスインターセプタ ---
// 401 Unauthorized が来たら refresh を1回だけ実行して、元のリクエストを再送
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 401 以外 or すでに再試行済みならそのままエラー
    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(error);
    }
    // 無限ループ回避フラグ
    original._retried = true;

    // すでに refresh 中なら、refresh 完了を待ってから再送
    if (isRefreshing) {
      const newAccess = await new Promise<string | null>(queueWaiter);
      if (newAccess) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }
      // refresh に失敗した場合はエラーで落とす（＝ログイン画面へ誘導）
      return Promise.reject(error);
    }

    // ここから refresh の実行は「この1人だけ」
    isRefreshing = true;
    try {
      const t = await getTokens();
      if (!t?.refresh) throw new Error("no refresh token");

      // /auth/refresh は "refreshトークン" を Authorization に付けて呼ぶ
      const r = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${t.refresh}` } }
      );
      const { access, refresh } = r.data;

      // 新しいトークンを保存（refresh ローテーションのため）
      await saveTokens({ access, refresh });

      // キュー待ちのリクエストに新しい access を配布
      flushQueue(access);

      // 元リクエストを新 access で再送
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${access}`;
      return api(original);
    } catch (e) {
      // refresh 失敗 → 全待機者に「ダメだった」と通知
      flushQueue(null);
      await clearTokens(); // ローカルのトークンも消す
      // ここでナビゲーション的にログインへ戻すなどの対応を行う
      throw e;
    } finally {
      isRefreshing = false;
    }
  }
);
