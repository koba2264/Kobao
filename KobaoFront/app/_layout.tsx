import { Stack, Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // 描画が完了してから router.replace() を実行する
    requestAnimationFrame(() => {
      const role = 'login'; // 仮のロール。実際は AsyncStorage などから取得

      if (role === 'test') {
        router.replace('/(test)');
      } else if (role === 'student') {
        router.replace('/(student)');
      } else if (role === 'teacher') {
        router.replace('/(teacher)');
      } else {
        router.replace('/(auth)/login');
      }
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
