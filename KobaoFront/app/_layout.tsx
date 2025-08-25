import { Stack, Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getTokens, saveTokens, clearTokens } from '@/src/token';
import { api } from '@/src/api';
import { logout, getStatus } from '@/src/auth';

export async function bootstrapSession() {

  const t = await getTokens();
  if (!t?.refresh) return; // そもそも未ログイン

  try {
    const res = await fetch(`${api.defaults.baseURL}/auth/refresh`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${t.refresh}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
    if (!res.ok) {
      await clearTokens();
      return;
    }
    const data = await res.json();
    console.log(data);
    await saveTokens(data);
    const status = await getStatus();
    if(status.role === 'student') {
      useRouter().replace('/(student)');
    } else if (status.role === 'teacher') {
      useRouter().replace('/(teacher)');
    }
  } catch (error) {
    // ネットワーク不通などは、とりあえず現状トークン維持でスキップも可
    console.error("Failed to bootstrap session:", error);
  }
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // 描画が完了してから router.replace() を実行する
    requestAnimationFrame(() => {
      bootstrapSession();
      // ログイン画面へ遷移
      router.replace('/(auth)/login');
    });
  }, []);

  return (
    <Stack>
      {/* Slot によって子画面の表示を管理 */}
      <Stack.Screen name="(test)" options={{ headerShown: false }} />
      <Stack.Screen name="(student)" options={{ headerShown: false }} />
      <Stack.Screen name="(teacher)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
    </Stack>
  );
}