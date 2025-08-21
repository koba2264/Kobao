import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const Home: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  type Question = {
    id: string;
    content: string;
    asked_at: string;
    ansed_flag: boolean;
    stu_id: string;
    is_read: boolean;
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  // 未読の返信があるかどうか
  const hasUnreadAnswers = questions.some(q => q.ansed_flag && !q.is_read);
  // 回答待ち（未回答）の質問があるかどうか
  const hasPendingQuestions = questions.some(q => !q.ansed_flag);
  const pendingCount = questions.filter(q => !q.ansed_flag).length;
  // 回答済みかつ未読のものだけ
  const answeredCount = questions.filter(q => q.ansed_flag && !q.is_read);


  useFocusEffect(
    React.useCallback(() => {
      fetch("http://127.0.0.1:5000/student/messages")
        .then(res => res.json())
        .then((data: Question[]) => {
          setQuestions(data);
        })
        .catch(err => console.error("APIエラー:", err));
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <View style={styles.listContainer}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.statusBox, { backgroundColor: isDark ? "#222" : "#ff8c0834" }]}>
            {hasUnreadAnswers ? (
              <>
                <Text style={[styles.statusTitle, { color: isDark ? "#fff" : "#000" }]}>新着{answeredCount.length}件</Text>

                {questions
                  .filter(q => q.ansed_flag && !q.is_read)
                  .map((q) => (
                    <View key={q.id} style={styles.questionBlock}>
                      <Text
                        style={[styles.statusQuestion, { color: isDark ? "#fff" : "#000" }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {`・${q.content}`}
                      </Text>

                      <TouchableOpacity
                        style={[styles.teacherButton, { backgroundColor: isDark ? "#ff981a" : "#FF8C00" }]}
                        onPress={() =>
                          router.push({
                            pathname: '/(student)/question/[id]',
                            params: { id: q.id },
                          })
                        }
                      >
                        <Text style={styles.teacherButtonText}>
                          {q.ansed_flag ? "回答を見る" : "詳細を見る"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </>
            ) : (
              <Text style={[styles.statusTitle, { color: isDark ? "#aaa" : "#000" }]}>
                まだ回答がありません
              </Text>
            )}
          </View>
        </ScrollView>
      </View>

      {/* ボタン部分 */}
      <View style={[styles.buttonContainer, { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 }]}>
        {hasPendingQuestions && (
          <TouchableOpacity
            style={[styles.sideButton, { backgroundColor: isDark ? "#ff981a" : "#ff981aff" }]}
            onPress={() => router.push("/standby")}
          >
            <Text style={styles.askButtonText}>回答待ち{pendingCount}件</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.sideButton, { backgroundColor: isDark ? "#ff981a" : "#ff981aff" }]}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.askButtonText}>質問する</Text>
        </TouchableOpacity>
      </View>
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
  teacherButton: {
    marginTop: 12,
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
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  stnButton: {
    width: "90%",
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
    borderRadius: 10,
    padding: 16,
    flex: 1,
  },
  sideButton: {
  flex: 1,          
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: "center",
  marginHorizontal: 5,  
},

});
