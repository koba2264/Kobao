import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
 
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
        const response = await fetch('http://127.0.0.1:5000/teacher/insert_tag', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tag_name: newTag }),
        });

        const data = await response.json();
        console.log(data);
      } catch (error) {
      Alert.alert("エラー", "タグ追加中に問題が発生しました");
    }
      router.back();
    } 
 
  return (
    <View style={styles.container}>
      <Text style={styles.label}>新しいタグ名を入力してください:</Text>
      <TextInput
        style={styles.input}
        value={newTag}
        maxLength={10}
        onChangeText={setNewTag}
        placeholder="例: JavaScript"
        placeholderTextColor="#888"
      />
      <Button title="追加" onPress={handleAddTag} />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#000",
  },
});