import { api } from "@/src/api";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity,Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { PieChart } from "react-native-chart-kit";

type Question = { id: string; que_id:string; title: string; tags: string[] };

export default function QuestionByTagScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const data = [
    { name: "数学", tag_count: 40, color: "rgba(131, 167, 234, 1)", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "英語", population: 30, color: "#F00", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "国語", population: 30, color: "orange", legendFontColor: "#7F7F7F", legendFontSize: 15 }
  ];

  const [tab, setTab] = useState<"tally" | "ratio" | "status">("tally");

  // タグ用state
  const [tagOpen, setTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagItems, setTagItems] = useState([{ label: "", value: "" }]);

  const selectedTagsText = selectedTags.length > 0 ? `選択中: ${selectedTags.join(", ")}` : "タグを選択";


  // タグ一覧取得
  const select_all_tag = async () => {
    try {
      const response = await fetch(`${api.defaults.baseURL}/teacher/select_tag`, { method: 'POST' });
      const data = await response.json();
      const formattedTags = data.tag.map((tag: any) => ({
        label: tag.tag_name.trim(),
        value: tag.tag_name.trim(),
      }));
      setTagItems(formattedTags);
    } catch (error) { console.log("error", error); }
  };
  useEffect(() => { if (tagOpen) select_all_tag(); }, [tagOpen]);

  // 質問一覧取得（タグ付き）
  const select_all_question = async () => {
    try {
      const response = await fetch(`${api.defaults.baseURL}/teacher/select_question_tag`, { method: 'POST' });
      console.log(response);
      const data = await response.json();
      const Qestions_tag = data.ans_tag.map((ans_tag: any) => ({
        id: ans_tag.answer_id,
        que_id: ans_tag.question_id,
        title: ans_tag.question_content,
        tags: ans_tag.tags.map((t: any) => t.tag.trim())
      }));
      setQuestions(Qestions_tag);
      setFilteredQuestions(Qestions_tag);
    } catch (error) { console.log("error", error); }
  };
  useEffect(() => { select_all_question(); }, []);

  // 選択タグでフィルタリング
  useEffect(() => {
    if (selectedTags.length === 0) setFilteredQuestions(questions);
    else {
      const filtered = questions.filter(q => q.tags.some(tag => selectedTags.includes(tag)));
      setFilteredQuestions(filtered);
    }
  }, [selectedTags, questions]);

    const goDetail = (id: string) => {
    router.push({
      pathname: '/(teacher)/questionDetaile/[id]' as any,
      params: { id },
    });
  };



  return (
    <View style={styles.container}>
      {/* 横並びタブ */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, tab === "tally" && styles.activeTab]} onPress={() => setTab("tally")}>
          <Text style={styles.tabText}>質問集計</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, tab === "ratio" && styles.activeTab]} onPress={() => setTab("ratio")}>
          <Text style={styles.tabText}>質問比率</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, tab === "status" && styles.activeTab]} onPress={() => setTab("status")}>
          <Text style={styles.tabText}>回答状況</Text>
        </TouchableOpacity>
      </View>

      {/* タブ内容 */}
      {tab === "tally" && (
        <>
          <Text style={styles.heading}>
            タグで質問を絞り込む
            {selectedTags.length > 0 ? `: ${selectedTags.join(", ")}` : ""}
          </Text>

          <DropDownPicker
            multiple
            open={tagOpen}
            value={selectedTags}
            items={tagItems}
            setOpen={setTagOpen}
            setValue={setSelectedTags}
            setItems={setTagItems}
            placeholder="タグを選択"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            multipleText={selectedTags.length > 0 ? `選択中: ${selectedTags.join(", ")}` : "タグを選択"}
          />

          <FlatList
            style={{ flex: 1 }}
            data={filteredQuestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity
                            onPress={() => goDetail(item.que_id)}
                          >
                <Text style={styles.title}>Q. {item.title}</Text>
                <Text style={styles.tags}>タグ:{item.tags.join(",")}</Text>
                          </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>該当する質問はありません</Text>}
          />
        </>
      )}

      {tab === "ratio" && (
        <View style={styles.centered}>
          <PieChart
        data={data}
        width={Dimensions.get("window").width}
        height={220}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
        </View>
      )}

      {tab === "status" && (
        <View style={styles.centered}>
          <Text style={styles.heading}>回答状況をグラフなどで表示</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#ffffffff" },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#000000ff" },
  dropdown: { marginBottom: 16, borderColor: "#FF8C00" },
  dropdownContainer: { borderColor: "#FF8C00" },
  card: { padding: 12, backgroundColor: "#fbc37eff", borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "bold" },
  tags: { marginTop: 4, color: "#555" },
  emptyText: { textAlign: "center", color: "#fff", marginTop: 20 },
  tabContainer: { flexDirection: "row", marginBottom: 12 },
  tabButton: { flex: 1, padding: 8, backgroundColor: "#FFA500", marginHorizontal: 2, borderRadius: 4 },
  activeTab: { backgroundColor: "#FF8C00" },
  tabText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" }
});
