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

// 返信が来ていない質問の型
  const [questions, setQuestions] = useState<Question[]>([]);
// 返信が来ているかどうかのフラグ
  const ansed_flag = questions.some(q => q.ansed_flag);
  const is_read = questions.some(q => q.is_read);
  // 回答待ち（未回答）の質問があるかどうか
  const hasPendingQuestions = questions.some(q => !q.ansed_flag);
  // 未回答の質問件数
  const pendingCount = questions.filter(q => !q.ansed_flag).length;



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

  // 返信が来た時の質問一覧画面
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusBox}>

          {ansed_flag  ? (

            <>
              <Text style={styles.statusTitle}>返信あり！</Text>
              {questions
                .filter((q) => !q.is_read)
                .map((q) => (
                  <View key={q.id} style={styles.questionBlock}>
                    <Text style={styles.statusQuestion}>{`・${q.content}`}</Text>
                    <Text style={styles.statusDate}>
                      {new Date(q.asked_at).toLocaleString()}
                    </Text>

                    <TouchableOpacity
                      style={styles.teacherButton}
                      onPress={() => router.push({
                        pathname: '/(student)/question/[id]',
                        params: { id: q.id }
                      })}
                    >
                      <Text style={styles.teacherButtonText}>
                        {q.ansed_flag ? "回答を見る" : "詳細を見る"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </>
          ) : (
            <Text style={styles.statusTitle}>まだ回答がありません</Text>
          )}
        </View>
      </ScrollView>

      {hasPendingQuestions && (
      <TouchableOpacity
        style={styles.stnButton}
        onPress={() => router.push("/standby")}
      >
        <Text style={styles.askButtonText}>回答待ち{pendingCount}件</Text>
      </TouchableOpacity>
    )}

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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
    flexGrow: 1,
    width: "100%",
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 0.7, 
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  buttonContainer: {
    flex: 0.3, 
    justifyContent: "center",
    alignItems: "center",
  },
  askButton: {
    width: "90%",
    backgroundColor: "#ff981aff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  stnButton: {
    width: "90%",
    backgroundColor: "#ff981aff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
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
    flex: 1, 
  },


});