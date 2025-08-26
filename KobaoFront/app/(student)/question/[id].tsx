import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "@/src/api";

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

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const styles = getStyles(isDark);

  useEffect(() => {
    if (!id) return;

    fetch(`${api.defaults.baseURL}/student/answer/${id}`)
      .then((res) => res.json())
      .then((data: QuestionDetail) => {
        setQuestion(data);
        setLoading(false);

        // 既読でなければ既読更新
        if (!data.is_read) {
          fetch(`${api.defaults.baseURL}/student/is_read/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_read: true }),
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
        <Text style={styles.content}>読み込み中...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>質問データが見つかりませんでした。</Text>
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
        <Text style={styles.date}>{new Date(question.asked_at).toLocaleString()}</Text>
      </View>

      {/* 回答内容 or 未回答メッセージ */}
      {question.ansed_flag ? (
        <View style={[styles.card, styles.answerCard]}>
          <Text style={styles.label}>回答</Text>
          <Text style={styles.answer}>{question.answer || "（回答は空です）"}</Text>
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

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: isDark ? "#121212" : "#fff",
    },
    card: {
      backgroundColor: isDark ? "#333" : "#FFE4B5",
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    answerCard: {
      backgroundColor: isDark ? "#444" : "#FFF4E0",
      borderColor: isDark ? "#FFA500" : "#FF8C00",
      borderWidth: 1,
    },
    noAnswerCard: {
      backgroundColor: isDark ? "#222" : "#F5F5F5",
      borderColor: isDark ? "#888" : "#AAA",
      borderWidth: 1,
    },
    label: {
      fontSize: 14,
      fontWeight: "bold",
      color: isDark ? "#FFA500" : "#FF8C00",
      marginTop: 4,
    },
    content: {
      fontSize: 16,
      color: isDark ? "#fff" : "#333",
      marginTop: 4,
    },
    date: {
      fontSize: 13,
      color: isDark ? "#ccc" : "#666",
      marginTop: 4,
    },
    answer: {
      fontSize: 15,
      color: isDark ? "#fff" : "#333",
      marginTop: 4,
    },
    note: {
      fontSize: 14,
      color: isDark ? "#aaa" : "#888",
      marginTop: 4,
    },
    backButton: {
      backgroundColor: isDark ? "#FFA500" : "#FF8C00",
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
