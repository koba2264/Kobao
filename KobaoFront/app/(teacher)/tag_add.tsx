import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "@/src/api";

export default function TagAddScreen() {
  const [newTag, setNewTag] = useState("");
  const router = useRouter();
  const { callbackId } = useLocalSearchParams();

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      Alert.alert("入力エラー", "タグ名を入力してください");
      return;
    }

    try {
      const response = await fetch(`${api.defaults.baseURL}/teacher/insert_tag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag_name: newTag }),
      });

      const data = await response.json();
      console.log(data);

      // 前の画面に戻る
      router.back();
    } catch (error) {
      Alert.alert("エラー", "タグ追加中に問題が発生しました");
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.all}>
        <Text style={styles.label}>新しいタグ名を入力してください:</Text>
        <TextInput
          style={styles.input}
          value={newTag}
          maxLength={10}
          onChangeText={setNewTag}
          placeholder="例: JavaScript"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.Button} onPress={handleAddTag}>
          <Text style={styles.buttonText}>追加</Text>
        </TouchableOpacity>
     </View>
   </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    padding: 24,
  },
  all : { alignItems: "center", 
    width: "100%"
  },

  label: {
    fontSize: 16,
    width: "90%",
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#000",
  },
  Button: {
    width: "90%",
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