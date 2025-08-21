import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
 
export default function TeacherRegisterScreen() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
 
  const handleRegister = async () => {
    if (!studentId || !name || !password) {
      Alert.alert("エラー", "全ての項目を入力してください");
      return;
    }
    console.log("学生登録:", { studentId, name, password });
    Alert.alert("登録完了", `学生 ${name} を登録しました`);
    try {
      const response = await fetch('http://127.0.0.1:5000/teacher/insert_student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          student_id: studentId,
          student_name:name,
          password:password
        }),
      });
    
      const data = await response.json();
      console.log(data);
      setStudentId("");
      setName("");
      setPassword("");
    } catch (error) {
      Alert.alert("エラー", "学生登録中に問題が発生しました");
    }
  } 
  
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>学生登録</Text>
      <TextInput
        style={styles.input}
        placeholder="学生ID"
        value={studentId}
        onChangeText={setStudentId}
      />
      <TextInput
        style={styles.input}
        placeholder="名前"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="登録" onPress={handleRegister} />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
});