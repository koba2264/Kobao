import React, { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const Home: React.FC = () => {
  // ルーターを使用して画面遷移を行う
  const router = useRouter();

  // 質問が保留中かどうか( true=質問中 / false=質問なし　で判定)
  const [hasPendingQuestion, setHasPendingQuestion] = useState(false);
  // 保留中の質問内容
  const [pendingQuestionText, setPendingQuestionText] = useState("");


  // Flask API から質問ステータスを取得（まだ）
  // useEffect(() => {
  //   fetch("http://localhost:5000/api/pending")// ここは実際のAPIエンドポイントに合わせて変更してください
  //     .then(res => res.json())// ここでAPIからのレスポンスを取得
  //     .then(data => {  // data.pending が true の場合、質問が保留中
  //       setHasPendingQuestion(data.pending);   // data.question が存在する場合、質問内容を設定
  //       setPendingQuestionText(data.question || ""); // デフォルト値を設定
  //     })
  //     .catch(err => {
  //       console.error("APIエラー:", err);
  //     });
  // }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* 回答状況*/}
        {hasPendingQuestion ? (// 質問が保留中の場合
         
         <View style={styles.statusBox}> 
            
            <Text style={styles.statusTitle}>現在の質問ステータス</Text>
            
            {/* 保留中の質問内容 */}
            <Text style={styles.statusQuestion}>{pendingQuestionText}</Text>
            
            {/* 質問が保留中であることを示すメッセージ */}
            <Text style={styles.statusNote}>回答が来るまでしばらくお待ちください</Text>

            {/* 回答を見るボタン */}
            {/* ここで、回答を見るボタンを押すと結果画面に遷移 */}
            <TouchableOpacity style={styles.teacherButton} onPress={() => router.push("/result")}>
              <Text style={styles.teacherButtonText}>回答を見る</Text>
            </TouchableOpacity>
          
          </View>
        ) : (// 質問が保留中でない場合
          <View style={styles.statusBox}>

            <Text style={styles.statusTitle}>現在の質問ステータス</Text>      
            <Text style={styles.statusNote}>現在、回答待ちの質問はありません。</Text>
          </View>
        )}


      </ScrollView>
        {/* 質問ボタン */}
        {/* 質問ボタンを押すとチャット画面に遷移 */}
        <TouchableOpacity style={styles.askButton} onPress={() => router.push("/chat")}>
          <Text style={styles.askButtonText}>質問する</Text>
        </TouchableOpacity>
    </View>
  );
};

export default Home;

// スタイル定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
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
    color: "#fff",
    fontWeight: "bold",
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
    marginBottom: 4,
  },
  statusNote: {
    fontSize: 13,
    color: "#555",
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
  historySection: {
    marginBottom: 24,
  },
  historyTitle: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 16,
  },
  historyItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    fontSize: 15,
    marginBottom: 4,
  },
  more: {
    textAlign: "right",
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
});
