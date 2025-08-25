import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, ActivityIndicator } from 'react-native';
import { getTokens, saveTokens, clearTokens } from '@/src/token';
import { api } from '@/src/api';
import { logout, getStatus } from '@/src/auth';

export async function bootstrapSession() {
  // await logout();
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
    // Stack
    requestAnimationFrame(() => {

      bootstrapSession();
      // ログイン画面へ遷移
      router.replace('/(auth)/login');
    });
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['top','bottom']}>
        <Stack screenOptions= {{ headerShown: false }}>
          <Stack.Screen name="(test)" />
          <Stack.Screen name="(student)" />
          <Stack.Screen name="(teacher)" />
          <Stack.Screen name="(auth)/login" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
