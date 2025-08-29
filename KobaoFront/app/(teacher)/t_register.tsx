import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@/src/api";


export default function TeacherRegisterScreen() {
  const [teacher_id, setTeacher_id] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState('');
  useFocusEffect(
    useCallback(() => {
      setMessage('');
    }, [])
  );


  const handleRegister = async () => {
    if (!teacher_id || !name) {
      Alert.alert("エラー", "全ての項目を入力してください");
      return;
    }
    console.log("教員登録:", { teacher_id, name});
    Alert.alert("登録完了", `教員 ${name} を登録しました`);
    try {
      const response = await fetch(`${api.defaults.baseURL}/teacher/insert_teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacher_id,
          name: name,
        }),
      });

      const data = await response.json();
      console.log(data);
      setMessage(data.message);
      if (data.result === 'false') {
        return;
      } else if (data.result === 'success') {
        setTeacher_id("");
        setName("");
      }
    } catch (error) {
      Alert.alert("エラー", "教員登録中に問題が発生しました");
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>教師登録</Text>
      <TextInput
        style={styles.input}
        placeholder="教員ID"
        value={teacher_id}
        onChangeText={setTeacher_id}
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