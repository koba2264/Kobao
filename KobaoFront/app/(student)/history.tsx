import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// 今はダミーデータ。将来はDB/APIから取得予定。
const dummyHistory = [
  { id: '550e8400-e29b-41d4-a716-446655440000', message: '山本隆之とは？', date: '2025-08-05' },
  { id: '550e8400-e29b-41d4-a716-446655440001', message: 'KOBAOの由来', date: '2025-08-04' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<typeof dummyHistory>([]);

  // 将来的にAPIからデータ取得するときのイメージ
  useEffect(() => {
    // API呼び出し例
    // fetch('https://api.example.com/questions')
    //   .then(res => res.json())
    //   .then(data => setHistory(data))
    //   .catch(() => setHistory(dummyHistory));

    // とりあえずダミーデータをセット
    setHistory(dummyHistory);
  }, []);

  // 詳細ページへIDだけ渡す。詳細は詳細ページでAPIから取得する想定
  const goDetail = (id: string) => {
    router.push({
      pathname: '/historyDetail',
      params: { id },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>過去の質問一覧</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goDetail(item.id)}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FF8C00',
  },
  card: {
    backgroundColor: '#FFE4B5',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
});
