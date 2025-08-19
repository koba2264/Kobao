import React, { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const Home: React.FC = () => {
  const router = useRouter();

  type Question = {
    id: string;
    content: string;
    asked_at: string;
    ansed_flag: boolean;
    stu_id: string;
    is_read: boolean;
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/student/messages")
      .then(res => res.json())
      .then((data: Question[]) => {
        setQuestions(data);
      })
      .catch(err => {
        console.error("APIエラー:", err);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusBox}>
          {questions.length === 0 ? (
            <Text style={styles.statusNote}>質問はまだありません。</Text>
          ) : (
            <>
              {questions
                .filter((q) => q.ansed_flag)
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
                    <Text style={styles.teacherButtonText}>
                      詳細を見る
                    </Text>
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
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
