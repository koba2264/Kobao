import React, { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const Home: React.FC = () => {
  const router = useRouter();

  // 質問の型定義
  type Question = {
    id: string;
    content: string;
    asked_at: string;
    ansed_flag: boolean;
    stu_id: string;
    is_read: boolean;
  };

  // 質問リスト（未回答・回答済みすべて）
  const [questions, setQuestions] = useState<Question[]>([]);

  // 質問取得
  useEffect(() => {
    fetch("http://127.0.0.1:5000/student/messages")
      .then(res => res.json())
      .then((data: Question[]) => {
        setQuestions(data);  // そのまま全部セット
      })
      .catch(err => {
        console.error("APIエラー:", err);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>現在の質問ステータス</Text>

          {questions.length === 0 ? (
            <Text style={styles.statusNote}>質問はまだありません。</Text>
          ) : (
            <>
              {questions.map((q) => (
                <View key={q.id} style={styles.questionBlock}>
                  <Text style={styles.statusQuestion}>{`・${q.content}`}</Text>
                  <Text style={styles.statusDate}>
                    {new Date(q.asked_at).toLocaleString()}
                  </Text>
                  <Text style={styles.statusNote}>
                    {q.ansed_flag ? "回答を見る" : "回答が来るまでしばらくお待ちください"}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.askButton}
        onPress={() => router.push("/chat")}
      >
        <Text style={styles.askButtonText}>質問する</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
    flexGrow: 1,
    width: "100%",
  },
  askButton: {
    width: "90%",
    backgroundColor: "#ff981aff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: '5%',
    right: '5%',
    alignSelf: "center",
  },
  askButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  statusBox: {
    backgroundColor: "#ff8c0834",
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusQuestion: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  statusNote: {
    fontSize: 13,
    color: "#555",
    marginTop: 10,
  },
  teacherButton: {
    marginTop: 12,
    backgroundColor: "#FF8C00",
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
