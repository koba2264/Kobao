
import { View, Text, StyleSheet } from "react-native";
 
export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ダッシュボード</Text>
      <Text style={styles.description}>
        ここに統計情報や最近の活動などを表示できます。
      </Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
