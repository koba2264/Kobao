import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// トークンの型
export type Tokens = { access: string; refresh: string };

// ---- 内部：環境別ストレージ実装 ----
const WEB_PREFIX = "app:sec:";

async function nativeSet(key: string, val: string) {
  // SecureStore が使えない端末対策
  const ok = await SecureStore.isAvailableAsync();
  if (!ok) throw new Error("SecureStore is not available on this device.");
  await SecureStore.setItemAsync(key, val);
}

async function nativeGet(key: string) {
  const ok = await SecureStore.isAvailableAsync();
  if (!ok) return null;
  return await SecureStore.getItemAsync(key);
}

async function nativeDel(key: string) {
  const ok = await SecureStore.isAvailableAsync();
  if (!ok) return;
  await SecureStore.deleteItemAsync(key);
}

function webSet(key: string, val: string) {
  // localStorage が使えない（プライベートモード等）対策
  try {
    localStorage.setItem(WEB_PREFIX + key, val);
  } catch {}
}

function webGet(key: string) {
  try {
    return localStorage.getItem(WEB_PREFIX + key);
  } catch {
    return null;
  }
}

function webDel(key: string) {
  try {
    localStorage.removeItem(WEB_PREFIX + key);
  } catch {}
}

// 環境スイッチ
const isWeb = Platform.OS === "web";
const setItem = (key: string, val: string) =>
  isWeb ? Promise.resolve(webSet(key, val)) : nativeSet(key, val);
const getItem = (key: string) =>
  isWeb ? Promise.resolve(webGet(key)) : nativeGet(key);
const delItem = (key: string) =>
  isWeb ? Promise.resolve(webDel(key)) : nativeDel(key);

// ---- 公開API：呼び出しはそのまま ----
export async function saveTokens(t: Tokens) {
  await setItem("access", t.access);
  await setItem("refresh", t.refresh);
}

export async function getTokens(): Promise<Tokens | null> {
  const access = await getItem("access");
  const refresh = await getItem("refresh");
  return access && refresh ? { access, refresh } : null;
}

export async function clearTokens() {
  await delItem("access");
  await delItem("refresh");
}

