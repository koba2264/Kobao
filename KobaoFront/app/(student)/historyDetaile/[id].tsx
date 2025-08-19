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
        <Text style={styles.errorText}>データが見つかりません。</Text>
        <Pressable style={styles.backButton} onPress={() => router.push('/(student)/history')}>
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>質問詳細</Text>
      <Text style={styles.date}>{question.asked_at ? new Date(question.asked_at).toLocaleString() : ''}</Text>
      <Text style={styles.question}>{question.content}</Text>
      <Text style={styles.answerTitle}>回答</Text>
      <Text style={styles.answer}>{question.answer || 'まだ回答がありません。'}</Text>

      <Pressable style={styles.backButton} onPress={() => router.push("/(student)/history")}>
        <Text style={styles.backButtonText}>戻る</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#000000ff' },
  date: { fontSize: 12, color: '#888', marginBottom: 16 },
  question: { fontSize: 18, marginBottom: 24, color: '#333' },
  answerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  answer: { fontSize: 16, color: '#555' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  backButton: { marginTop: 32, backgroundColor: '#FF8C00', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
