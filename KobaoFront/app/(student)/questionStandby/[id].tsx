import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

type QuestionDetail = {
  id: string;
  content: string;
  asked_at: string;
  answer?: string;
  ansed_flag: boolean;
  stu_id: string;
  is_read: boolean;
};

export default function HistoryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const styles = getStyles(isDark);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:5000/student/messages/${id}`)
      .then((res) => res.json())
      .then((data: QuestionDetail) => {
        setQuestion(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("詳細取得エラー:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>読み込み中...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>質問データが見つかりませんでした。</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>質問内容</Text>
        <Text style={styles.content}>{question.content}</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: isDark ? "#121212" : "#fff",
    },
    card: {
      backgroundColor: isDark ? "#333" : "#FFE4B5",
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "bold",
      color: isDark ? "#FFA500" : "#FF8C00",
      marginTop: 4,
    },
    content: {
      fontSize: 16,
      color: isDark ? "#fff" : "#333",
      marginTop: 4,
    },
    backButton: {
      backgroundColor: isDark ? "#FFA500" : "#FF8C00",
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    backButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
