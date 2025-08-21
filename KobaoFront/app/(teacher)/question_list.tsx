import React, { useEffect, useState } from "react";
import { View,Text,Button,FlatList,StyleSheet,TextInput,Alert,TouchableOpacity,Modal,} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";
import { nanoid } from "nanoid";

 
type Question = {
  id: number;
  title: string;
};

type TagItem = {
  id: string;
  label: string;
  value: string;
}
 
export default function QuestionListScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
 
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const [tagsItems, setTagsItems] = useState<TagItem[]>([]);
  
  const select_all_tag = async () =>{
    try {
      const response = await fetch('http://127.0.0.1:5000/teacher/select_tag', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
      })
      const data = await response.json();
      // データの受け取り(map)。(tag[値]:any[型])
      const formattedTags: TagItem[] = data.tag.map
      ((tag:any) => ({
        id: tag.id.toString(),
        label: tag.tag_name.trim(),
        value: tag.tag_name.trim()
      }));
      setTagsItems(formattedTags)
    } catch (error) {
        Alert.alert("エラー", "タグ追加中に問題が発生しました");
    }
  } 
  useEffect(() => {
    if(tagsOpen){
      select_all_tag();
    }
  },[tagsOpen])

 
  const router = useRouter();
  (globalThis as any).__tagAddCallbacks ??= {};

  const select_all_question = async () =>{
    try {
      const response = await fetch('http://127.0.0.1:5000/teacher/select_question', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
      })
      const data = await response.json();
      // console.log(data)
      // データの受け取り(map)。(tag[値]:any[型])
      const Qestions = data.question.map
      ((question:any) => ({
        id: question.id,
        title: question.content,
      }));
      setQuestions(Qestions);
    } catch (error) {
        Alert.alert("エラー", "タグ追加中に問題が発生しました");
    }
  } 
  useEffect(() => {
    select_all_question();
  }, []);
 
  const handleAnswerSubmit = async () => {
    if (!answerText || !selectedQuestionId) {
      Alert.alert("入力エラー", "回答内容を入力してください");
      return;
    }
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
    // console.log(tagsValue)
    console.log(tagsItems)
    try {
      const response = await fetch('http://127.0.0.1:5000/teacher/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question_id: selectedQuestionId,
          answerText: answerText,
          tagsItems: tagsItems
        }),
      });
    } catch (error) {
      Alert.alert("エラー", "教師編集中にエラー");
    }
 
 
    Alert.alert(
      "送信完了",
      `質問ID: ${selectedQuestionId}\n質問: ${selectedQuestion?.title}\n回答: ${answerText}\nタグ: ${tagsValue.join(", ")}`
    );
 
    setAnswerText("");
    setTagsValue([]);
    setSelectedQuestionId(null);
  };
 
  const handleAddTag = () => {
    const callbackId = nanoid();
    (globalThis as any).__tagAddCallbacks[callbackId] = (newTag: string) => {
      if (!tagsItems.some(tag => tag.value === newTag)) {
        setTagsItems(prev => [...prev, { label: newTag, value: newTag }]);
      }
      select_all_tag();
    };
 
    setSelectedQuestionId(null); // モーダルを閉じる
    router.push(`/tag_add?callbackId=${callbackId}`);
  };
 
  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Q. {item.title}</Text>
            <Button title="この質問に回答する" onPress={() => setSelectedQuestionId(item.id)} />
          </View>
        )}
      />
 
      <Modal
        visible={selectedQuestionId !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedQuestionId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.formHeader}>
              <Text style={styles.modalTitle}>回答フォーム</Text>
              <TouchableOpacity onPress={() => setSelectedQuestionId(null)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
 
            <Text style={styles.label}>回答内容:</Text>
            <TextInput
              style={styles.input}
              value={answerText}
              onChangeText={setAnswerText}
              placeholder="回答を入力"
              multiline
              placeholderTextColor="#888"
            />
 
            <Text style={styles.label}>タグ（複数選択可能）:</Text>
            <DropDownPicker
              multiple={true}
              min={0}
              max={5}
              open={tagsOpen}
              value={tagsValue}
              items={tagsItems}
              setOpen={setTagsOpen}
              setValue={setTagsValue}
              setItems={setTagsItems}
              placeholder="タグを選択してください"
              listMode="MODAL"
              modalProps={{ animationType: "slide" }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
            />
 
            {tagsValue.length > 0 && (
              <>
                <Text style={styles.selectedTags}>
                  選択中のタグ: {tagsValue.join(", ")}
                </Text>
                <TouchableOpacity onPress={() => setTagsValue([])} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>× タグをすべてクリア</Text>
                </TouchableOpacity>
              </>
            )}
 
            <View style={styles.buttonSpacing}>
              <Button title="新しいタグを追加" onPress={handleAddTag} />
            </View>
 
            <View style={styles.buttonSpacing}>
              <Button title="送信" onPress={handleAnswerSubmit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF8C00",
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  closeButton: {
    fontSize: 24,
    color: "#888",
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    color: "#000",
  },
  dropdown: {
    marginBottom: 8,
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  selectedTags: {
    color: "#000",
    marginBottom: 4,
  },
  clearButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  clearButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  buttonSpacing: {
    marginVertical: 8,
  },
});