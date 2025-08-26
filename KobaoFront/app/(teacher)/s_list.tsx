import React, { useState, useCallback } from "react";
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
  change_pass: boolean;
};

export default function StudentListScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // 生徒一覧取得
  const select_all_student = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/teacher/select_all_student",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();
      const formattedStudents = data.student.map((student: any) => ({
        id: student.id.trim(),
        name: student.name.trim(),
        password: student.hash_pass.trim(),
        change_pass: student.change_pass || false,
      }));
      setStudents(formattedStudents);
    } catch (error) {
      Alert.alert("エラー", "生徒取得中に問題が発生しました");
    }
  };

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
            await fetch("http://127.0.0.1:5000/teacher/delete_student", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ student_id: student.id }),
            });
          } catch (error) {
            Alert.alert("エラー", "削除中にエラー");
          } finally {
            setModalVisible(false);
          }
          setStudents(students.filter((s) => s.id !== student.id));
        },
        style: "destructive",
      },
    ]);
  };

  const saveEdit = async () => {
    if (!selectedStudent) return;

    try {
      await fetch("http://127.0.0.1:5000/teacher/edit_student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          student_name: selectedStudent.name,
          password: selectedStudent.password,
        }),
      });
    } catch (error) {
      Alert.alert("エラー", "生徒編集中にエラー");
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudent.id ? selectedStudent : s))
    );
    setModalVisible(false);
    setSelectedStudent(null);
  };

  // パスワード変更要求ボタン
  const change_pass = async () => {
    if (!selectedStudent) return;

    try {
      await fetch("http://127.0.0.1:5000/teacher/change_pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacher_id: selectedStudent.id }),
      });

      // 成功したら state を更新
      setSelectedStudent((prev) =>
        prev ? { ...prev, change_pass: true } : prev
      );
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id ? { ...s, change_pass: true } : s
        )
      );
    } catch (error) {
      Alert.alert("エラー", "パスワード変更要求中にエラー");
    }
  };

  const renderItem = ({ item }: { item: Student }) => (
    <View style={styles.box}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>
          {item.name} ({item.id})
        </Text>
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
            <Text style={styles.modalTitle}>生徒編集</Text>

            <TextInput
              style={styles.input}
              placeholder="名前"
              value={selectedStudent?.name}
              onChangeText={(text) =>
                setSelectedStudent((prev) =>
                  prev ? { ...prev, name: text } : prev
                )
              }
            />
            {/* パスワード変更要求ボタン */}
            <TouchableOpacity
              onPress={change_pass}
              disabled={selectedStudent?.change_pass}
              style={[
                styles.passButton,
                selectedStudent?.change_pass && styles.passButtonDisabled,
              ]}
            >
              <Text style={styles.passButtonText}>
                {selectedStudent?.change_pass
                  ? "変更要求済み"
                  : "パスワードの変更を要求"}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Text style={styles.saveText}>保存</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => selectedStudent && handleDelete(selectedStudent)}
              >
                <Text style={styles.deleteText}>削除</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 5, borderRadius: 5 },
  passButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  passButtonDisabled: { backgroundColor: "#ccc" },
  passButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  actionButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: { flex: 1, alignItems: "center" },
  saveButton: { flex: 1, alignItems: "center" },
  deleteButton: { flex: 1, alignItems: "center" },
  cancelText: { color: "red", fontSize: 16 },
  saveText: { color: "green", fontSize: 16 },
  deleteText: { color: "orange", fontSize: 16 },
});
