import React, { useEffect, useState } from "react";
import {useFocusEffect,useRouter } from 'expo-router';
import {api} from '@/src/api';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const Home: React.FC = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const styles = getStyles(isDark);

  type Question = {
    id: string;
    content: string;
    asked_at: string;
    ansed_flag: boolean;
    stu_id: string;
    is_read: boolean;
  };

  const [questions, setQuestions] = useState<Question[]>([]);

    useFocusEffect(
    React.useCallback(() => {
      fetch(`${api.defaults.baseURL}/student/messages`)
        .then(res => res.json())
        .then((data: Question[]) => {
          setQuestions(data);
        })
        .catch(err => console.error("APIエラー:", err));
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusBox}>
          {questions.length === 0 ? (
            <Text style={styles.statusNote}>質問はまだありません。</Text>
          ) : (
            <>
              {questions
                .filter((q) => !q.ansed_flag)
                .map((q) => (
                  <View key={q.id} style={styles.questionBlock}>
                    <Text style={styles.statusQuestion}>{`・${q.content}`}</Text>
                    <Text style={styles.statusDate}>
                      {new Date(q.asked_at).toLocaleString()}
                    </Text>

                    <TouchableOpacity
                      style={styles.teacherButton}
                      onPress={() => router.push({
                        pathname: '/(student)/questionStandby/[id]',
                        params: { id: q.id }
                      })}
                    >
                      <Text style={styles.teacherButtonText}>詳細を見る</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : "#fff",
      justifyContent: "space-between",
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 80,
      flexGrow: 1,
      width: "100%",
    },
    statusBox: {
      backgroundColor: isDark ? '#333' : "#ff8c0834",
      borderRadius: 10,
      padding: 16,
      marginBottom: 24,
    },
    statusQuestion: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
    },
    statusDate: {
      fontSize: 12,
      color: isDark ? "#aaa" : "#666",
      marginBottom: 6,
    },
    statusNote: {
      fontSize: 13,
      color: isDark ? "#ccc" : "#555",
      marginTop: 10,
    },
    teacherButton: {
      marginTop: 12,
      backgroundColor: isDark ? "#FFA500" : "#FF8C00",
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    teacherButtonText: {
      color: "#fff",
    },
    questionBlock: {
      marginBottom: 8,
    },
  });
