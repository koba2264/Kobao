import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


type Message = {
  id: string;
  content: string;
  is_read: boolean;
};

export default function HistoryScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      fetch('http://127.0.0.1:5000/student/messages')
        .then((response) => response.json())
        .then((data: Message[]) => setMessages(data))
        .catch((error) => console.error('Failed to fetch messages:', error));
    }, [])
  );

  function goDetail(id: string): void {
    router.push({
      pathname: '/(student)/historyDetaile/[id]',
      params: { id},
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>過去の質問一覧</Text>
      <FlatList
      data={messages.filter((msg) => msg.is_read)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => goDetail(item.id)}>
          <Text style={styles.message}
          numberOfLines={1}
          ellipsizeMode="tail">・{item.content}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>まだ既読の質問はありません</Text>
      }
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
    emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#aaa',
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
