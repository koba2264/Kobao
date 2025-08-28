import { api } from "@/src/api";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";



export default function TeacherRegisterScreen() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!studentId || !name) {
      Alert.alert("エラー", "全ての項目を入力してください");
      return;
    }
    console.log("学生登録:", { studentId, name });
    Alert.alert("登録完了", `学生 ${name} を登録しました`);
    try {
      const response = await fetch(`${api.defaults.baseURL}/teacher/insert_student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          student_name: name,
        }),
      });

      const data = await response.json();
      console.log(data);
      setMessage(data.message);
      if (data.result === 'false') {
        return;
      } else if (data.result === 'success') {
        setStudentId("");
        setName("");
      }
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
      <View>
        <TouchableOpacity style={styles.Button} onPress={handleRegister}>
          <Text style={styles.buttonText} >登録</Text>
        </TouchableOpacity>
      </View>
      {message ? <Text style={styles.error}>{message}</Text> : null}
      {/* message があれば赤文字で表示 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, width: "90%", alignSelf: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  error: {
    color: 'red', // 赤文字
    marginTop: 12,
  },
  Button: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#FF8C00",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
  },
});