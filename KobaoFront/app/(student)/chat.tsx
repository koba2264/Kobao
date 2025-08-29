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
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const [text, setText] = useState('');
  const router = useRouter();
  const scheme = useColorScheme(); // "light" | "dark"

  const isDark = scheme === 'dark';
  const styles = getStyles(isDark);

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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >

          {/* タイトル */}
          <Text style={styles.title}>KOBAOに質問しよう</Text>
          <Text style={styles.subtitle}>気になること、なんでも聞いてね！</Text>

          {/* 入力欄 */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="例：再帰ってなに？"
              placeholderTextColor={isDark ? "#aaa" : "#888"}
              value={text}
              onChangeText={(value) => {
                const cleaned = value.replace(/\n{2,}/g, "\n"); // 2行以上を1行にする
                setText(cleaned);
              }}
              style={styles.input}
              multiline
            />
          </View>
          {/* キャラクター */}
          <Image source={require('../../assets/kobaokun.png')} style={styles.character} />

          {/* 送信ボタン */}
          <Pressable style={styles.button} onPress={sendTextToFlask}>
            <Text style={styles.buttonText}>送信</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
      padding: 24,
    },
    character: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 4,
      color: isDark ? '#fff' : '#333',
    },
    subtitle: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
      color: isDark ? '#ccc' : '#666',
    },
    inputContainer: {
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? '#555' : '#ccc',
      padding: 12,
      marginBottom: 16,
      shadowColor: '#000',
      height: 150,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    input: {
      fontSize: 16,
      color: isDark ? '#fff' : '#333',
      minHeight: 80,
      maxHeight: 200, // 最大高さを指定
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
  });
