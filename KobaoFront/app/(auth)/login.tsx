
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { api } from '@/src/api';
import { saveTokens } from '@/src/token';

export default function IndexScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.result === 'success') {
        if (data.role === 'student') router.replace('/(student)');
        else if (data.role === 'teacher') router.replace('/(teacher)');
      } else {
        setId('');
        setPassword('');
        Alert.alert('ログイン失敗', 'ID またはパスワードが間違っています。');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('通信エラー', 'サーバーに接続できませんでした。');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000ff' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#FF8C00' : '#FF8C00' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffffff' : '#fff' }]}>KOBAO</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#222' : '#fff8f0',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#888' : '#FF8C00',
            },
          ]}
          placeholder="ID"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          value={id}
          onChangeText={setId}
          keyboardType="default"
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#222' : '#fff8f0',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#888' : '#FF8C00',
            },
          ]}
          placeholder="パスワード"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={[styles.button, { backgroundColor: isDark ? '#ff981a' : '#ff981aff' }]} onPress={loginFlask}>
          <Text style={styles.buttonText}>ログイン</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  form: {
    flex: 0.8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 18,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

