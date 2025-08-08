import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
 
// 質問データ型
type Question = {
  id: number;
  title: string;
  tags: string[];
};
 
export default function QuestionByTagScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
 
  // タグ用state
  const [tagOpen, setTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagItems, setTagItems] = useState([
    { label: "Java", value: "Java" },
    { label: "Python", value: "Python" },
    { label: "React Native", value: "React Native" },
    { label: "データベース", value: "データベース" },
  ]);
 
  useEffect(() => {
    const dummyQuestions: Question[] = [
      { id: 1, title: "JavaとPythonの違いは何？", tags: ["Java", "Python"] },
      { id: 2, title: "React NativeでAPIを呼び出すには？", tags: ["React Native"] },
      { id: 3, title: "データベースの正規化とは？", tags: ["データベース"] },
      { id: 4, title: "Pythonでのリスト操作方法", tags: ["Python"] },
    ];
    setQuestions(dummyQuestions);
    setFilteredQuestions(dummyQuestions);
  }, []);
 
  // タグ変更時にフィルタリング
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((q) =>
        q.tags.some((tag) => selectedTags.includes(tag))
      );
      setFilteredQuestions(filtered);
    }
  }, [selectedTags, questions]);
 
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>タグで質問を絞り込む</Text>
      <DropDownPicker
        multiple={true}
        open={tagOpen}
        value={selectedTags}
        items={tagItems}
        setOpen={setTagOpen}
        setValue={setSelectedTags}
        setItems={setTagItems}
        placeholder="タグを選択"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
 
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Q. {item.title}</Text>
            <Text style={styles.tags}>タグ: {item.tags.join(", ")}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>該当する質問はありません</Text>}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FF8C00",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#fff",
  },
  dropdown: {
    marginBottom: 16,
    borderColor: "#fff",
  },
  dropdownContainer: {
    borderColor: "#fff",
  },
  card: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tags: {
    marginTop: 4,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    color: "#fff",
    marginTop: 20,
  },
});