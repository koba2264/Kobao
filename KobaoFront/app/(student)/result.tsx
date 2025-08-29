import "react-native-get-random-values";
import { getStatus } from '@/src/auth';
import { v4 as uuidv4 } from "uuid";
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { api } from "@/src/api";

// chatbotからの返答用
type QuestionAnswer = {
  ans_id: string;
  que_text: string;
  ans_text: string;
};

export default function ResultScreen() {
  const [text, setText] = useState('');
  const id = uuidv4();

  const [reply, setReply] = useState<QuestionAnswer[] | null>(null);

  // 選択中のQA
  const [selectedQA, setSelectedQA] = useState<QuestionAnswer | null>(null);

  // モーダル用
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQA, setModalQA] = useState<QuestionAnswer | null>(null);

  const { message } = useLocalSearchParams();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const styles = getStyles(isDark);

  // 仮のQ&Aデータ
  const sendTextToFlask = () => {
    router.push({
      pathname: '/(student)/sendTeacher',
      params: { message, id },
    });
  };

  // Flask API からの返答を取得
  useEffect(() => {
    setReply(null);
    if (!message) return;

    fetch(`${api.defaults.baseURL}/chatbot/receive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message }),
    })
      .then(res => res.json())
      .then((data: QuestionAnswer[]) => { setReply(data), console.log(data); })
      .catch(() => setReply([{ ans_id: "error", que_text: 'エラー', ans_text: 'エラーが発生しました' }]));
  }, [message]);

  // QAブロックのタップ処理
  const handleTap = (qa: QuestionAnswer) => {
    setSelectedQA(qa);
    setModalQA(qa);
    setModalVisible(true);
  };

    const [status, setStatus] = React.useState<any>(null);
    React.useEffect(() => {
      getStatus().then(setStatus);
    }, []);

  // 選択QAをFlaskに送信
  // 解決ボタンでモーダルQAをFlaskに送信
  const resolve = async () => {
    if (!modalQA) return;

    try {
      const response = await fetch(`${api.defaults.baseURL}/student/QA_receive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          stu_id: status.user_id,
          ans_id: modalQA.ans_id,
          question: modalQA.que_text,
          answer: modalQA.ans_text,
        }),
      });

      if (!response.ok) throw new Error('送信失敗');

      await fetch(`${api.defaults.baseURL}/chatbot/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        que_id: id,
        ans_id: modalQA.ans_id,
      }),
    });

      setModalVisible(false);
      Alert.alert('送信成功', '解決済みとして送信しました');
    } catch (error) {
      console.error(error);
      Alert.alert('送信失敗', '通信に失敗しました');
    }
  };

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
      {/* チャット部分 */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
              {reply.length > 0 ? (
                reply.map((qa) => (
                  <Pressable
                    key={qa.ans_id}
                    style={[
                      styles.qaBlock,
                      selectedQA?.ans_id === qa.ans_id && { backgroundColor: '#ffd580' }
                    ]}
                    onPress={() => handleTap(qa)}
                  >
                    <Text style={styles.botQuestion} numberOfLines={2} ellipsizeMode="tail">
                      Q: {qa.que_text}
                    </Text>
                    <Text style={styles.botAnswer} numberOfLines={2} ellipsizeMode="tail">
                      A: {qa.ans_text}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text style={styles.botMessage}>回答がありません</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* フッターの固定ボタン */}
      <View style={{ padding: 10 }}>
        <Pressable style={styles.askButton} onPress={sendTextToFlask}>
          <Text style={styles.askButtonText}>先生に送信</Text>
        </Pressable>
      </View>

      {/* モーダル */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Pressable
                  style={styles.modalCloseIcon}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseIconText}>×</Text>
                </Pressable>

                <Text style={styles.modalTitle}>質問詳細</Text>
                <Text style={styles.modalText}>Q: {modalQA?.que_text}</Text>
                <Text style={styles.modalText}>A: {modalQA?.ans_text}</Text>

                <Pressable
                  style={styles.modalActionButton}
                  onPress={resolve}
                >
                  <Text style={styles.modalActionText}>解決</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    all: { flex: 1, backgroundColor: isDark ? "#121212" : "#fff", width: "100%" },
    scrollContent: { flexGrow: 1, justifyContent: 'flex-start', padding: 20, width: '100%', paddingBottom: 100, backgroundColor: isDark ? "#121212" : "#fff" },
    chatContainer: { flexDirection: 'column', gap: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? "#121212" : "#fff" },
    messageBlockRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
    messageBlockLeft: { alignSelf: 'flex-start', width: '100%', alignItems: 'flex-start' },
    name: { fontSize: 12, color: isDark ? '#aaa' : '#666', marginBottom: 4 },
    userMessageContainer: { backgroundColor: '#FF8C00', padding: 12, borderRadius: 16, maxWidth: '70%' },
    userMessage: { color: '#fff', fontSize: 16 },
    botMessageContainer: { backgroundColor: isDark ? '#333' : '#eee', padding: 12, borderRadius: 16, maxWidth: '70%' },
    botMessage: { color: isDark ? '#fff' : '#333', fontSize: 16 },
    askButton: { width: "90%", backgroundColor: "#ff981aff", borderRadius: 10, paddingVertical: 12, alignItems: "center", position: "absolute", bottom: 30, alignSelf: "center" },
    askButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    qaBlock: { marginBottom: 12, padding: 8, borderRadius: 12 },
    botQuestion: { fontWeight: "bold", fontSize: 16, color: isDark ? "#fff" : "#333", marginBottom: 4 },
    botAnswer: { fontSize: 16, color: isDark ? "#ccc" : "#555" },

    // モーダル用
    modalText: { fontSize: 16, marginBottom: 8, color: isDark ? '#ccc' : '#555' },
    modalCloseButton: { marginTop: 12, backgroundColor: '#FF8C00', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
    modalCloseText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 20,
    },
    modalContent: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: isDark ? '#2c2c2c' : '#fff',
      padding: 20,
      borderRadius: 16,
      alignItems: 'stretch',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDark ? '#fff' : '#333',
      textAlign: 'center',
    },

    qaBox: {
      backgroundColor: isDark ? '#444' : '#f9f9f9',
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#555' : '#ddd',
    },
    qaLabel: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
      color: '#FF8C00',
    },
    qaText: {
      fontSize: 16,
      color: isDark ? '#fff' : '#333',
    },

    modalButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    modalCloseIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 5,
    },
    modalCloseIconText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FF8C00',
    },
    modalActionButton: {
      marginTop: 20,
      backgroundColor: '#FF8C00',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
    modalActionText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },

  });
