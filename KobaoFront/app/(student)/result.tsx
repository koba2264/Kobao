import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  View, Text, ActivityIndicator, StyleSheet, ScrollView, Pressable, useColorScheme 
} from 'react-native';

export default function ResultScreen() {
  const { message } = useLocalSearchParams();
  const [reply, setReply] = useState<string | null>(null);
  const scheme = useColorScheme(); // "light" or "dark"
  const isDark = scheme === "dark";
  const styles = getStyles(isDark);

  // ルーターを使用して画面遷移を行う
  const sendTextToFlask = () => {
    router.push({
      pathname: '/(student)/sendTeacher',
      params: { message },
    });
  };

  // Flask API からの返答を取得
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
        <Text style={{ marginTop: 10, color: isDark ? "#fff" : "#000" }}>考え中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.all}>
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

      {/* 送信ボタン */}
      <Pressable style={styles.askButton} onPress={sendTextToFlask}>
        <Text style={styles.askButtonText}>先生に送信</Text>
      </Pressable>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    all: {
      flex: 1,
      backgroundColor: isDark ? "#121212" : "#fff",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      padding: 20,
      width: '100%',
      backgroundColor: isDark ? "#121212" : "#fff",
    },
    chatContainer: {
      flexDirection: 'column',
      gap: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? "#121212" : "#fff",
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
      color: isDark ? '#aaa' : '#666',
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
      backgroundColor: isDark ? '#333' : '#eee',
      padding: 12,
      borderRadius: 16,
      maxWidth: '70%',
    },
    botMessage: {
      color: isDark ? '#fff' : '#333',
      fontSize: 16,
    },
    askButton: {
      width: "90%",
      backgroundColor: "#ff981aff",
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      position: "absolute",
      bottom: 30,
      alignSelf: "center",
    },
    askButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
