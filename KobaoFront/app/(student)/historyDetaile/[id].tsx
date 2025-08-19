import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type DetailData = {
  id: string;
  question: string;
  content: string;
  date: string;
};


const dummyHistory = [
  { 
    id: '550e8400-e29b-41d4-a716-446655440000', 
    question: '山本隆之とは？', 
    content: '山本隆之さんは日本の著名な〇〇です。', 
    date: '2025-08-05' 
  },
  { 
    id: '550e8400-e29b-41d4-a716-446655440001', 
    question: 'KOBAOの由来', 
    content: 'KOBAOは〇〇の略で、△△から名付けられました。', 
    date: '2025-08-04' 
  },
];


export default function HistoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setLoading(false);
      return;
    }

    // 将来的にAPIに質問IDを送って詳細を取得する例
//     fetch(`https://api.example.com/questions/${id}`)
//       .then(res => res.json())
//       .then((json: DetailData) => {
//         setData(json);
//         setLoading(false);
//       })
//       .catch(() => {
//         // エラー時はダミーデータ表示など適宜対応
//         setData({
//           id,
//           question: '質問内容が取得できませんでした。',
//           content: '',
//           date: '',
//         });
//         setLoading(false);
//       });
//   }, [id]);

    
    const found = dummyHistory.find(item => item.id === id);

    if (found) {
      setData(found);
    } else {
      setData({
        id,
        question: '質問内容が取得できませんでした。',
        content: '',
        date: '',
      });
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={{ marginTop: 10 }}>読み込み中...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>データが見つかりません。</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>質問詳細</Text>
      <Text style={styles.date}>{data.date}</Text>
      <Text style={styles.question}>{data.question}</Text>
      <Text style={styles.answerTitle}>回答</Text>
      <Text style={styles.answer}>{data.content || 'まだ回答がありません。'}</Text>

      <Pressable style={styles.backButton} onPress={() => router.push("/history")}>
        <Text style={styles.backButtonText}>戻る</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000ff',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    marginBottom: 24,
    color: '#333',
  },
  answerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 32,
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});