import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable } from 'react-native';
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={{ marginTop: 10 }}>読み込み中...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.container}>
        <Text style={styles.note}>データが見つかりません。</Text>
        <Pressable style={styles.backButton} onPress={() => router.push('/(student)/history')}>
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, question.ansed_flag ? styles.answerCard : styles.noAnswerCard]}>
        <Text style={styles.label}>質問</Text>
        <Text style={styles.content}>{question.content}</Text>
        <Text style={styles.date}>
          {question.asked_at ? new Date(question.asked_at).toLocaleString() : ""}
        </Text>

        <Text style={styles.label}>回答</Text>
        <Text style={styles.answer}>
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
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
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
