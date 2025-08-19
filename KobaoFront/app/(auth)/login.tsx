import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

export default function IndexScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const loginFlask = async () => {
    try {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KOBAO</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="ID"
          value={id}
          onChangeText={setId}
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="パスワード"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={loginFlask}>
          <Text style={styles.buttonText}>ログイン</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FF8C00',
  },
  headerTitle: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    flex: 0.8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#FF8C00',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: '#fff8f0',
  },
  button: {
    width: "100%",
    backgroundColor: "#ff981aff",
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
