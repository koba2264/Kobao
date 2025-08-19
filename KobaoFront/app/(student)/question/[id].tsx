// app/(student)/historyDetaile/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

type QuestionDetail = {
  id: string;
  content: string;
  asked_at: string;
  answer?: string;
  ansed_flag: boolean;
  stu_id: string;
  is_read: boolean;
};

export default function HistoryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:5000/student/messages/${id}`)
      .then((res) => res.json())
      .then((data: QuestionDetail) => {
        setQuestion(data);
        setLoading(false);

        // 既読でなければ既読更新
        if (!data.is_read) {
          fetch(`http://127.0.0.1:5000/student/messages/${id}/read`, {
            method: "PUT",
          }).catch((err) => console.error("既読更新失敗:", err));
        }
      })
      .catch((err) => {
        console.error("詳細取得エラー:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.container}>
        <Text>質問データが見つかりませんでした。</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 質問内容 */}
      <View style={styles.card}>
        <Text style={styles.label}>質問内容</Text>
        <Text style={styles.content}>{question.content}</Text>

        <Text style={styles.label}>質問日時</Text>
        <Text style={styles.date}>
          {new Date(question.asked_at).toLocaleString()}
        </Text>
      </View>

      {/* 回答内容 or 未回答メッセージ */}
      {question.ansed_flag ? (
        <View style={[styles.card, styles.answerCard]}>
          <Text style={styles.label}>回答</Text>
          <Text style={styles.answer}>
            {question.answer || "（回答は空です）"}
          </Text>
        </View>
      ) : (
        <View style={[styles.card, styles.noAnswerCard]}>
          <Text style={styles.label}>回答</Text>
          <Text style={styles.note}>まだ回答がありません</Text>
        </View>
      )}

      {/* 戻るボタン */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#FFE4B5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  answerCard: {
    backgroundColor: "#FFF4E0",
    borderColor: "#FF8C00",
    borderWidth: 1,
  },
  noAnswerCard: {
    backgroundColor: "#F5F5F5",
    borderColor: "#AAA",
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF8C00",
    marginTop: 4,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  date: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  answer: {
    fontSize: 15,
    color: "#333",
    marginTop: 4,
  },
  note: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  backButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
