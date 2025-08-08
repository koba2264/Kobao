import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, FlatList } from 'react-native';

type Message = {
  id: number;
  message: string;
};

export default function IndexScreen() {
  const [text, setText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // ← メッセージ一覧の状態

  // メッセージを送信する
  const sendTextToFlask = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/student/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      setResponseText(data.result);
      fetchMessages(); // 送信後にメッセージ一覧を更新
    } catch (error) {

    }
  };

  // メッセージ一覧を取得する
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/student/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View>
      <TextInput
        placeholder="メッセージを入力"
        value={text}
        onChangeText={setText}
      />
      <Button title="送信" onPress={sendTextToFlask} />

      <Text>サーバーからの返答: {responseText}</Text>

      <Text>メッセージ一覧:</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.message}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
});
