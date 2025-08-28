import React, { useState,useCallback } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { getStatus } from "@/src/auth";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function TeacherChangePassScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  useFocusEffect(
    useCallback(() => {
      setMessage('');
    }, [])
  );

  const handlePassword = async () => {
    
    if (!password || !confirmPassword) {
      setMessage("パスワードを入力してください");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("パスワードが一致しません");
      return;
    }

    const status = await getStatus();
    console.log(status);
    if (status.role === "student") {
      try {
      const response = await fetch('http://127.0.0.1:5000/auth/change_pass_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: status.user_id,
          password: password
        }),
      });
      router.replace('/(auth)/login');
    } catch (err) {
      console.error(err);
      Alert.alert("エラー", "サーバー接続に失敗しました");
    }
  }else if (status.role === "teacher") {
     try {
      const response = await fetch('http://127.0.0.1:5000/auth/change_pass_teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: status.user_id,
          password: password
        }),
      });
      router.replace('/(auth)/login');
    } catch (err) {
      console.error(err);
      Alert.alert("エラー", "サーバー接続に失敗しました");
    }
  }
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>新しいパスワードを入力してください</Text>
      {message ? <Text style={styles.error}>{message}</Text> : null} 
      <TextInput
        style={styles.input}
        placeholder="新しいパスワード"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="確認用パスワード"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="登録" onPress={handlePassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  error: {
    color: 'red', // 赤文字
    marginTop: 12,
  },
});
