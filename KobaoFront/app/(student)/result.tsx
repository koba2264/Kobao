import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

export default function ResultScreen() {
  const { message } = useLocalSearchParams();
  const [reply, setReply] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;

    fetch('http://127.0.0.1:5000/chatbot/receive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
      .then(res => res.json())
      .then(data => setReply(data.result))
      .catch(() => setReply('エラーが発生しました。'));
  }, [message]);

  if (!reply) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={{ marginTop: 10 }}>考え中...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.chatContainer}>
        {/* ユーザー */}
        <View style={styles.messageBlockRight}>
          <Text style={styles.name}>あなた</Text>
          <View style={styles.userMessageContainer}>
            <Text style={styles.userMessage}>{message}</Text>
          </View>
        </View>

        {/* KOBAOの返答 */}
        <View style={styles.messageBlockLeft}>
          <Text style={styles.name}>KOBAO</Text>
          <View style={styles.botMessageContainer}>
            <Text style={styles.botMessage}>{reply}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBlockRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageBlockLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  userMessageContainer: {
    backgroundColor: '#FF8C00',
    padding: 12,
    borderRadius: 16,
    maxWidth: '70%',
  },
  userMessage: {
    color: '#fff',
    fontSize: 16,
  },
  botMessageContainer: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 16,
    maxWidth: '70%',
  },
  botMessage: {
    color: '#333',
    fontSize: 16,
  },
});
