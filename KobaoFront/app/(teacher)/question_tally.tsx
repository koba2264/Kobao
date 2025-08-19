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
      { label: "", value: "" }
    ]);
  const select_all_tag = async () =>{
      try {
        const response = await fetch('http://127.0.0.1:5000/teacher/select_tag', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json();
        // console.log(data)
        console.log(data.tag)
        console.log("bbb")
        // データの受け取り(map)。(tag[値]:any[型])
        const formattedTags = data.tag.map
        ((tag:any) => ({
          label: tag.tab_name.trim(),
          value: tag.tab_name.trim(),
        }));
        setTagItems(formattedTags)
      } catch (error) {
          Alert.alert("エラー", "タグ追加中に問題が発生しました");
      }
    } 
    useEffect(() => {
      if(tagOpen){
        select_all_tag();
      }
    },[tagOpen])
  
    const select_all_question = async () =>{
      try {
        const response = await fetch('http://127.0.0.1:5000/teacher/select_question_tag', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json();
        // console.log(data)
        // データの受け取り(map)。(tag[値]:any[型])
        const Qestions_tag = data.question_tag.map
        ((question_tag:any) => ({
          id: question_tag.id,
          title: question_tag.content,
          tags: [question_tag.tab_name.trim()],
        }));
        setQuestions(Qestions_tag);
        setFilteredQuestions(Qestions_tag);
        console.log(Qestions_tag[0].tags);
        
      } catch (error) {
        Alert.alert("エラー", "タグ追加中に問題が発生しました");
      }
    } 
 
  useEffect(() => {
    select_all_question();
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