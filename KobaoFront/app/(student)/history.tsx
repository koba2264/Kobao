import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


type Message = {
  id: string;
  content: string;
};

export default function HistoryScreen() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/student/messages')
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => {
        console.error('Failed to fetch messages:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>過去の質問一覧</Text>
      <FlatList

        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goDetail(item.id)}>
            <Text style={styles.message}>{item.content}</Text>
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
