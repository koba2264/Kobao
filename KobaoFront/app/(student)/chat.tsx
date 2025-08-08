import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const [text, setText] = useState('');
  const router = useRouter();

  const sendTextToFlask = () => {
    if (!text.trim()) return;
    const inputText = text;
    setText('');
    router.push({
      pathname: '/(student)/result',
      params: { message: inputText },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          contentInset={{ bottom: 40 }} 
        >
          {/* キャラクター */}
          <Image source={require('../../assets/kobaokun.png')} style={styles.character} />

          {/* タイトル */}
          <Text style={styles.title}>KOBAOに質問しよう</Text>
          <Text style={styles.subtitle}>気になること、なんでも聞いてね！</Text>

          {/* 入力欄 */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="例：再帰ってなに？"
              value={text}
              onChangeText={(value) => {
                const cleaned = value.replace(/\n{2,}/g, "\n"); // 2行以上を1行にする
                setText(cleaned);
              }}
              style={styles.input}
              multiline
            />
          </View>

          {/* 送信ボタン */}
          <Pressable style={styles.button} onPress={sendTextToFlask}>
            <Text style={styles.buttonText}>送信</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  character: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  history: {
    marginTop: 24,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  historyItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});
