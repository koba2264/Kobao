import React, { useState,useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
 
type Student = {
  id: string;
  name: string;
  password: string;
};
 
export default function StudentListScreen() {
  const [students, setStudents] = useState<Student[]>([
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const select_all_student = async () =>{
      try {
        const response = await fetch('http://127.0.0.1:5000/teacher/select_all_student', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json();
        // データの受け取り(map)。(tag[値]:any[型])
        const formattedStudents = data.student.map
        ((student:any) => ({
          id: student.id.trim(),
          name: student.name.trim(),
          password: student.hash_pass.trim()
        }));
        setStudents(formattedStudents)
      } catch (error) {
          Alert.alert("エラー", "タグ追加中に問題が発生しました");
      }
    } 
    useFocusEffect(
      useCallback(() => {
        select_all_student();
      }, [])
    );
 
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };
 
  const handleDelete = (student: Student) => {
    Alert.alert("確認", `${student.name} を削除しますか？`, [
      { text: "キャンセル" },
      {
        text: "削除",
        onPress: async () => {
          try {
            const response = await fetch('http://127.0.0.1:5000/teacher/delete_student', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ student_id: student.id }),
            });
            console.log("成功");
          } catch (error) {
            Alert.alert("エラー", "削除中にエラー");
          }finally {
            setModalVisible(false); // ← ここで閉じる
          }
          setStudents(students.filter((s) => s.id !== student.id));
        },
        style: "destructive",
      },
    ]);
  };
 
  const saveEdit =  async () => {
    if (selectedStudent) {
      try {
        const response = await fetch('http://127.0.0.1:5000/teacher/edit_student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          student_id: selectedStudent.id,
          student_name: selectedStudent.name,
          password: selectedStudent.password
        }),
        });
      } catch (error) {
        Alert.alert("エラー", "教師編集中にエラー");
      }
      setStudents((prev) =>
        prev.map((s) => (s.id === selectedStudent.id ? selectedStudent : s))
      );
      setModalVisible(false);
      setSelectedStudent(null);
    }
  };
 
  const renderItem = ({ item }: { item: Student }) => (
    <View style={styles.box}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{item.name} ({item.id})</Text>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text style={styles.menu}>…</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
 
  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
 
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text>学生編集</Text>
            <TextInput
              style={styles.input}
              placeholder="名前"
              value={selectedStudent?.name}
              onChangeText={(text) =>
                setSelectedStudent((prev) => prev && { ...prev, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="パスワード"
              value={selectedStudent?.password}
              onChangeText={(text) =>
                setSelectedStudent((prev) => prev && { ...prev, password: text })
              }
            />
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: "red" }}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={{ color: "green" }}>保存</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (selectedStudent) handleDelete(selectedStudent);
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: "orange" }}>削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  box: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  menu: { fontSize: 20, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 5, borderRadius: 5 },
});