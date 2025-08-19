import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList } from 'react-native';

type Question = {
  id: number;
  text: string; 
};

export default function IndexScreen() {
  const [text, setText] = useState('');
  const [data, setData] = useState<Question[]>([]);

  const sendTextToFlask = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/chatbot/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const json: Question[] = await response.json();
      setData(json);
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
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.text}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
});
