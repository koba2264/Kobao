import { api } from './api';
import { saveTokens, clearTokens, getTokens } from './token';

// --- ログイン ---
// サーバーから {access, refresh} を受けて SecureStore に保存
export async function login(id: string, password: string) {
  const r = await api.post("/auth/login", { id, password });
  await saveTokens(r.data);
}

// --- ログアウト ---
// /auth/logout は「refreshトークンで」呼ぶ必要がある点がポイント！
// api のデフォルト Authorization は access を付けるため、明示的に refresh を付け直す。
export async function logout() {
  const t = await getTokens();
  if (t?.refresh) {
    await fetch(`${api.defaults.baseURL}/auth/logout`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${t.refresh}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
  }
  await clearTokens();
}

export async function getStatus() {
  const t = await getTokens();
  if (!t?.access) return;

  const res = await fetch(`${api.defaults.baseURL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${t.access}`,
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  // console.log(data);
  return data;
}