import * as SecureStore from "expo-secure-store";

// トークンの型
export type Tokens = { access: string; refresh: string };

// トークンを保存する
export async function saveTokens(t: Tokens) {
  // setItemAsync は上書き保存。失敗時は例外。
  await SecureStore.setItemAsync("access", t.access);
  await SecureStore.setItemAsync("refresh", t.refresh);
}

// どちらも揃っているときだけ {access, refresh} を返す
export async function getTokens(): Promise<Tokens | null> {
  const access = await SecureStore.getItemAsync("access");
  const refresh = await SecureStore.getItemAsync("refresh");
  return access && refresh ? { access, refresh } : null;
}

// ログアウト時などに使用。Keychain/Keystore から消える。
export async function clearTokens() {
  await SecureStore.deleteItemAsync("access");
  await SecureStore.deleteItemAsync("refresh");
}
