// ログイン画面
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { api } from '@/src/api';
import { saveTokens } from '@/src/token';

export default function IndexScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const loginFlask = async () => {
    try {
        const res = await api.post("/auth/login", { id, password });

        console.log(res.data);
        if (res.data.result === 'success') {
            // トークンを保存
            await saveTokens(res.data);
            if (res.data.role === 'student') {
              router.replace('/(student)');
            } else if (res.data.role === 'teacher') {
              router.replace('/(teacher)');
            }
        } else {
            setId('');
            setPassword('');
            alert('ID またはパスワードが間違っています。');
        }
    } catch { 
    }
  };

  return (
    <View>
      <TextInput
        placeholder="ID"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        placeholder="パスワード"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title="送信" onPress={loginFlask} />
    </View>
  );
}

const styles = StyleSheet.create({
});
