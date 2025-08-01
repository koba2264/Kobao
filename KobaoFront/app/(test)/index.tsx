import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function IndexScreen() {
  const [text, setText] = useState('');

  const sendTextToFlask = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/chatbot/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      console.log(data);
    } catch {
      
    }
  };

  return (
    <View>
      <TextInput
        placeholder="メッセージを入力"
        value={text}
        onChangeText={setText}
      />
      <Button title="送信" onPress={sendTextToFlask} />
    </View>
  );
}

const styles = StyleSheet.create({
});
