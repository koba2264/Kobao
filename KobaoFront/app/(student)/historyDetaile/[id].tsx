import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type QuestionDetail = {
  id: string;
  content: string;
  asked_at: string;
  answer?: string;
  ansed_flag: boolean;
  stu_id: string;
  is_read: boolean;
};

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme(); // light / dark

  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    fetch(`http://127.0.0.1:5000/student/answer/${id}`)
      .then(res => res.json())
      .then((data: QuestionDetail) => {
        setQuestion(data);
        setLoading(false);
      })
      .catch(() => {
        setQuestion({
          id: id,
          content: '質問内容が取得できませんでした。',
          asked_at: '',
          ansed_flag: false,
          stu_id: '',
          is_read: true,
        });
        setLoading(false);
      });
  }, [id]);

  const isDark = colorScheme === "dark";

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={{ marginTop: 10, color: isDark ? "#fff" : "#000" }}>読み込み中...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
        <Text style={[styles.note, { color: isDark ? "#ccc" : "#888" }]}>データが見つかりません。</Text>
        <Pressable style={styles.backButton} onPress={() => router.push('/(student)/history')}>
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
      <View style={[
        styles.card, 
        question.ansed_flag ? styles.answerCard : styles.noAnswerCard,
        { backgroundColor: isDark ? (question.ansed_flag ? "#333" : "#1E1E1E") : undefined }
      ]}>
        <Text style={[styles.label, { color: isDark ? "#FFA500" : "#FF8C00" }]}>質問</Text>
        <Text style={[styles.content, { color: isDark ? "#fff" : "#333" }]}>{question.content}</Text>
        <Text style={[styles.date, { color: isDark ? "#aaa" : "#666" }]}>
          {question.asked_at ? new Date(question.asked_at).toLocaleString() : ""}
        </Text>

        <Text style={[styles.label, { color: isDark ? "#FFA500" : "#FF8C00" }]}>回答</Text>
        <Text style={[styles.answer, { color: isDark ? "#fff" : "#333" }]}>
          {question.answer || "まだ回答がありません。"}
        </Text>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.push("/(student)/history")}>
        <Text style={styles.backButtonText}>戻る</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  answerCard: {
    borderColor: "#FF8C00",
    borderWidth: 1,
  },
  noAnswerCard: {
    borderColor: "#AAA",
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  content: {
    fontSize: 16,
    marginTop: 4,
  },
  date: {
    fontSize: 13,
    marginTop: 4,
  },
  answer: {
    fontSize: 15,
    marginTop: 4,
  },
  note: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
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
