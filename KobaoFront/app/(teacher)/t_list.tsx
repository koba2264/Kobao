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
import { api } from "@/src/api";
 
type Teacher = {
  id: string;
  name: string;
  change_pass: boolean;
};
 
export default function TeacherListScreen() {
  const [teachers, setTeachers] = useState<Teacher[]>([
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const select_all_teacher = async () =>{
      try {
        const response = await fetch(`${api.defaults.baseURL}/teacher/select_all_teacher`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json();
        // データの受け取り(map)。(tag[値]:any[型])
        const formattedTeachers = data.teacher.map
        ((teacher:any) => ({
          id: teacher.id.trim(),
          name: teacher.name.trim(),
          change_pass: teacher.change_pass
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
            const response = await fetch(`${api.defaults.baseURL}/teacher/delete_teacher`, {
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
        const response = await fetch(`${api.defaults.baseURL}/teacher/edit_teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          teacher_id: selectedTeacher.id,
          teacher_name: selectedTeacher.name,
        }),
        });
      } catch (error) {
        Alert.alert("エラー", "教員編集中にエラー");
      }
      setTeachers((prev) =>
        prev.map((t) => (t.id === selectedTeacher.id ? selectedTeacher : t))
      );
      setModalVisible(false);
      setSelectedTeacher(null);
    }
  };

  const change_pass = async () => {
    if (selectedTeacher) {
      try {
        const response = await fetch(`${api.defaults.baseURL}/teacher/change_pass`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            teacher_id: selectedTeacher.id,
          }),
        });

      // 成功したら state を更新してボタンを無効化
      setSelectedTeacher(prev => prev ? { ...prev, change_pass: true } : prev);

      // リスト全体の teachers も更新しておくと FlatList にも反映される
      setTeachers(prev =>
        prev.map(t => t.id === selectedTeacher.id ? { ...t, change_pass: true } : t)
      );
      } catch (error) {
        Alert.alert("エラー", "教員編集中にエラー");
      }
    }
  }
 
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
          <Text style={styles.modalTitle}>教員編集</Text>
          <TextInput
            style={styles.input}
            placeholder="名前"
            value={selectedTeacher?.name}
            onChangeText={(text) =>
              setSelectedTeacher((prev) => prev && { ...prev, name: text })
            }
          />

          {/* パスワード変更ボタン */}
          <TouchableOpacity
            onPress={change_pass}
            disabled={selectedTeacher?.change_pass} // change_passがtrueなら無効化
            style={[
              styles.passButton,
              selectedTeacher?.change_pass && styles.passButtonDisabled, // 無効時のスタイルを追加
            ]}
          >
            <Text style={styles.passButtonText}>
              {selectedTeacher?.change_pass ? "変更要求済み" : "パスワードの変更を要求"}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
              <Text style={styles.saveText}>保存</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => selectedTeacher && handleDelete(selectedTeacher)}>
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

  // モーダル全体
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  // 入力欄
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },

  // パスワード変更ボタン
  passwordButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  passwordButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  passButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  passButtonDisabled: {
    backgroundColor: "#ccc", // 無効時はグレー
  },
  passButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // 下の操作ボタン
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: { flex: 1, alignItems: "center" },
  saveButton: { flex: 1, alignItems: "center" },
  deleteButton: { flex: 1, alignItems: "center" },
  cancelText: { color: "red", fontSize: 16 },
  saveText: { color: "green", fontSize: 16 },
  deleteText: { color: "orange", fontSize: 16 },
});
