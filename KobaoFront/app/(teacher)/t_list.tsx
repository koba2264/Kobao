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
 
type Teacher = {
  id: string;
  name: string;
  password: string;
};
 
export default function TeacherListScreen() {
  const [teachers, setTeachers] = useState<Teacher[]>([
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const select_all_teacher = async () =>{
      try {
        const response = await fetch('http://127.0.0.1:5000/teacher/select_all_teacher', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json();
        // データの受け取り(map)。(tag[値]:any[型])
        const formattedTeachers = data.teacher.map
        ((teacher:any) => ({
          id: teacher.id.trim(),
          name: teacher.name.trim(),
          password: teacher.hash_pass.trim()
        }));
        setTeachers(formattedTeachers)
      } catch (error) {
          Alert.alert("エラー", "タグ追加中に問題が発生しました");
      }
    } 

    useFocusEffect(
      useCallback(() => {
        select_all_teacher();
      }, [])
    );

    // useEffect(() => {
    //   select_all_teacher();
    // },[])
 
  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setModalVisible(true);
  };
 
  const handleDelete = (teacher: Teacher) => {
    console.log("呼ばれた",teacher)
    Alert.alert("確認", `${teacher.name} を削除しますか？`, [
      { text: "キャンセル" },
      {
        text: "削除",
        onPress: async () => {
          try {
            const response = await fetch('http://127.0.0.1:5000/teacher/delete_teacher', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ teacher_id: teacher.id }),
            });
            console.log("成功");
          } catch (error) {
            Alert.alert("エラー", "タグ追加中に問題が発生しました");
          }finally {
            setModalVisible(false); // ← ここで閉じる
          }
          setTeachers(teachers.filter((t) => t.id !== teacher.id));
        },
        style: "destructive",
      },
    ]);
  };
 
  const saveEdit = async () => {
    if (selectedTeacher) {
      try {
        const response = await fetch('http://127.0.0.1:5000/teacher/edit_teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          teacher_id: selectedTeacher.id,
          teacher_name: selectedTeacher.name,
          password: selectedTeacher.password
        }),
        });
      } catch (error) {
        Alert.alert("エラー", "教師編集中にエラー");
      }
      setTeachers((prev) =>
        prev.map((t) => (t.id === selectedTeacher.id ? selectedTeacher : t))
      );
      setModalVisible(false);
      setSelectedTeacher(null);
    }
  };
 
  const renderItem = ({ item }: { item: Teacher }) => (
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
        data={teachers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
 
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text>教師編集</Text>
            <TextInput
              style={styles.input}
              placeholder="名前"
              value={selectedTeacher?.name}
              onChangeText={(text) =>
                setSelectedTeacher((prev) => prev && { ...prev, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="パスワード"
              value={selectedTeacher?.password}
              onChangeText={(text) =>
                setSelectedTeacher((prev) => prev && { ...prev, password: text })
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
                  console.log(selectedTeacher)
                  if (selectedTeacher)
                    handleDelete(selectedTeacher);
                  // setModalVisible(false);
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