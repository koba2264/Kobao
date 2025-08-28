import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { api } from '@/src/api';
import { getStatus } from '@/src/auth';

type Message = {
  id: string;
  content: string;
  is_read: boolean;
};

export default function HistoryScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const styles = getStyles(isDark);
  const [status, setStatus] = React.useState<any>(null);

  useEffect(() => {
    getStatus().then(setStatus);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!status?.user_id) return;

      let isActive = true;
      fetch(`${api.defaults.baseURL}/student/messagesHistory/${status.user_id}`)
        .then((response) => response.json())
        .then((data: Message[]) => {
          if (isActive) setMessages(data);
        })
        .catch((error) => console.error('Failed to fetch messages:', error));

      return () => { isActive = false; };
    }, [status?.user_id])
  );

  const goDetail = (id: string) => {
    router.push({
      pathname: '/(student)/historyDetaile/[id]',
      params: { id },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>過去の質問一覧</Text>
      <FlatList
        data={messages.filter(msg => msg.is_read)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.is_read && styles.readCard]}
            onPress={() => goDetail(item.id)}
          >
            <Text style={styles.message}>{item.content}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>まだ既読の質問はありません</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      backgroundColor: isDark ? '#121212' : '#fff',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#FFA500' : '#FF8C00',
    },
    card: {
      backgroundColor: isDark ? '#333' : '#FFE4B5',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    readCard: {
      opacity: 0.8, // 既読を少し薄く
    },
    message: {
      fontSize: 16,
      color: isDark ? '#fff' : '#333',
      lineHeight: 22,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      marginTop: 50,
    },
    emptyText: {
      fontSize: 16,
      color: isDark ? '#888' : '#aaa',
      textAlign: 'center',
    },
  });
