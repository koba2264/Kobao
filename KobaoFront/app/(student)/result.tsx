import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';

// chatbotからの返答用
type Question = {
  id: number;
  text: string; 
}

export default function ResultScreen() {

  // 入力されたテキスト
  const [text, setText] = useState('');

  // chatbotからの返答されたテキストのリスト
  const [reply, setReply] = useState<Question[] | null>(null);
  // ルーターからのパラメータ取得
  const { message } = useLocalSearchParams();

  // 返答の状態管理
  // const [reply, setReply] = useState<string | null>(null);

  // ルーターを使用して画面遷移を行う
  const sendTextToFlask = () => {
    router.push({
      pathname: '/(student)/sendTeacher',
      params: { message },
    });
  };


  // Flask API からの返答を取得
  useEffect(() => {
    setReply(null);
    if (!message) return;

    fetch('https://10174dc7873a.ngrok-free.app/chatbot/receive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message }),
    })
      .then(res => res.json())
      .then((data: Question[]) => {
        setReply(data);
      })
      .catch(() => setReply([{id:1,text:'エラーが発生しました'}]));
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
            {/* 返答のリストを表示 */}

            {(reply && reply.length > 0) ? (
              reply.map((re) => (
              <Text key={re.id} style={styles.botMessage}>{re.text}</Text>
              ))
            ) : (
              <Text style={styles.botMessage}>回答がありません</Text>
            )}
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

const styles = StyleSheet.create({
  all:{
   flex: 1, backgroundColor: "#fff", 
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
    width: '100%',
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
