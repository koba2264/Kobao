import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Stack
    requestAnimationFrame(() => {
<<<<<<< HEAD
      const role = 'test';
=======
      const role = 'login'; // 仮のロール。実際は AsyncStorage などから取得

>>>>>>> 6f1a9e4d1fee508896b6e963d8b1d7e50801721e

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
