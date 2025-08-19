// ログイン画面
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function IndexScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const loginFlask = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, password: password }),
        });

        const data = await response.json();
        console.log(data);
        if (data.result === 'success') {
            if (data.role === 'student') {
              router.replace('/(student)');
            } else if (data.role === 'teacher') {
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
