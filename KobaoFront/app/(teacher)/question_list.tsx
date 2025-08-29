import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert, TouchableOpacity, Modal, ScrollView, } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";
import { nanoid } from "nanoid";
import { useFocusEffect } from "@react-navigation/native";
import { getStatus } from '@/src/auth';
import { api } from "@/src/api";


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

  const [tagOpen, setTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagItems, setTagItems] = useState([{ label: "", value: "" }]);


  const select_all_tag = async () => {
    try {
      const response = await fetch(`${api.defaults.baseURL}/teacher/select_tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json();
      // データの受け取り(map)。(tag[値]:any[型])
      const formattedTags: TagItem[] = data.tag.map
        ((tag: any) => ({
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
    if (tagsOpen) {
      select_all_tag();
    }
  }, [tagsOpen])


  const router = useRouter();
  (globalThis as any).__tagAddCallbacks ??= {};

  const select_all_question = async () => {
    try {
      const response = await fetch(`${api.defaults.baseURL}/teacher/select_question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json();
      console.log(data)
      // データの受け取り(map)。(tag[値]:any[型])
      const Qestions = data.question.map
        ((question: any) => ({
          id: question.id,
          title: question.content,
        }));
      setQuestions(Qestions);

    } catch (error) {
      Alert.alert("エラー", "タグ追加中に問題が発生しました");
    }
  }
  useFocusEffect(
    useCallback(() => {
      select_all_question();
    }, [])
  );

  const handleAnswerSubmit = async () => {
    if (!answerText || !selectedQuestionId) {
      Alert.alert("入力エラー", "回答内容を入力してください");
      return;
    }
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
    const status = await getStatus();
    try {
      const response = await fetch(`${api.defaults.baseURL}/teacher/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: selectedQuestionId,
          answerText: answerText,
          tagsItems: tagsItems,
          teacher_id: status.user_id
        }),
      });
      setQuestions(prev => prev.filter(q => q.id !== selectedQuestionId));
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
    (globalThis as any).__tagAddCallbacks[callbackId] = () => {
      select_all_tag();
    };

    setSelectedQuestionId(null); // モーダルを閉じる
    router.push(`/tag_add?callbackId=${callbackId}`);
  };

  return (
    <View style={styles.container}>
      {questions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>まだ質問はありません</Text>
        </View>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>Q. {item.title}</Text>
              <TouchableOpacity style={styles.Button} onPress={() => setSelectedQuestionId(item.id)}>
                <Text style={styles.buttonText}>回答する</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

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


            <View
              style={{ maxHeight: "90%" }}
            >
              {/* 回答内容 */}
              <Text style={styles.label}>回答内容:</Text>
              <TextInput
                style={styles.input}
                value={answerText}
                onChangeText={setAnswerText}
                placeholder="回答を入力"
                multiline
                placeholderTextColor="#888"
              />

              {/* タグ選択 */}
              <Text style={styles.label}>
                タグ（複数選択可能）
                {selectedTags.length > 0 ? `: ${selectedTags.join(", ")}` : ""}
              </Text>

              <View style={{ height: 250 }}>
                <DropDownPicker
                  multiple
                  min={0}
                  max={5}
                  open={tagsOpen}
                  value={tagsValue}
                  items={tagsItems}
                  setOpen={setTagsOpen}
                  setValue={(callback) => {
                    setTagsValue(prev => {
                      const newValue = typeof callback === "function" ? callback(prev) : callback;
                      const unique = Array.from(new Set(newValue)) as string[];
                      setSelectedTags(unique);
                      return unique;
                    });
                  }}
                  setItems={setTagsItems}
                  placeholder="タグを選択してください"
                  listMode="SCROLLVIEW"
                  style={styles.dropdown}
                  dropDownContainerStyle={[styles.dropdownContainer, { maxHeight: 180 }]}
                  multipleText={selectedTags.length > 0 ? `選択中: ${selectedTags.join(", ")}` : "タグを選択"}
                  zIndex={2000}
                />

                {tagsValue.length > 0 && (
                  <View style={{ marginVertical: 8 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setTagsValue([]);
                        setSelectedTags([]);
                      }}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>× タグをすべてクリア</Text>
                    </TouchableOpacity>
                  </View>
                )}


              </View>

              {/* ボタン */}
              <View style={styles.buttonSpacing}>
                <TouchableOpacity style={styles.Button} onPress={handleAddTag}>
                  <Text style={styles.buttonText}>新しいタグを追加</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonSpacing}>
                <TouchableOpacity style={styles.Button} onPress={handleAnswerSubmit}>
                  <Text style={styles.buttonText}>送信</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: "#fff",
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#fad7acff",
    padding: 16,
    borderRadius: 8,
    width: "90%",
    alignSelf: "center",
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
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
  title: {
    fontSize: 16,
    marginBottom: 25,
    color: "#000",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
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
    height: 100,
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
    marginVertical: 4,

  },
});