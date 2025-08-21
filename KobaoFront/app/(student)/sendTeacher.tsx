import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { 
  View, Text, StyleSheet, ScrollView, Pressable, Alert, useColorScheme 
} from 'react-native';

export default function ResultScreen() {
  const { message } = useLocalSearchParams();
  const displayMessage = Array.isArray(message) ? message[0] : message ?? '';
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const styles = getStyles(isDark);

    const onSendPress = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/student/receive", {  
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: displayMessage }),
            });

            if (response.ok) {
                              Alert.alert(
                    "送信完了",
                    "先生に質問を送信しました！",
                    [
                        {
                            text: "OK",
                            onPress: () => router.replace("/chat"), // chat画面に遷移
                        },
                    ]
                );
            } else {
                Alert.alert("エラー", "送信に失敗しました");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Alert.alert("通信エラー", errorMessage);
        }
    };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>質問内容</Text>

      <View style={styles.messageContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.userMessage}>{displayMessage}</Text>
        </ScrollView>
      </View>

      <Pressable style={styles.askButton} onPress={onSendPress}>
        <Text style={styles.askButtonText}>決定</Text>
      </Pressable>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
      padding: 20,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#eee' : '#424242',
      textAlign: 'center',
      marginBottom: 16,
    },
    messageContainer: {
      flex: 0.7,
      backgroundColor: isDark ? '#333' : '#ff8c0834',
      borderRadius: 16,
      padding: 12,
    },
    scrollContent: {
      flexGrow: 1,
    },
    userMessage: {
      fontSize: 18,
      color: isDark ? '#fff' : '#4E342E',
    },
    askButton: {
      width: '100%',
      backgroundColor: '#ff981aff',
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    askButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
