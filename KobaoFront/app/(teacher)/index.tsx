import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "@/src/api";
import { getTokens } from "@/src/token";

export default function HomeScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<{ admin?: boolean } | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const tokens = await getTokens();
        const response = await fetch(`${api.defaults.baseURL}/auth/admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens?.refresh}`,
          }
        });
        const data = await response.json();
        setStatus({ admin: data.admin });
        console.log(data.admin)
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  if (status === null) return null;
  type MenuRoute =
    | "/"
    | "/question_list"
    | "/question_tally"
    | "/tag_add"
    | "/s_register"
    | "/s_list"
    | "/t_register"
    | "/t_list";

  type MenuItem = {
    title: string;
    icon: string;
    route: MenuRoute;
  };

  let menus: MenuItem[] = [];


  //  管理者限定メニュー
  if (status.admin) {
    menus = [
      { title: "質問一覧", icon: "list-outline", route: "/question_list" },
      { title: "質問集計", icon: "stats-chart-outline", route: "/question_tally" },
      { title: "質問比率", icon: "pie-chart-outline", route: "/" },
      { title: "回答状況", icon: "checkmark-done-outline", route: "/" },
      { title: "タグ追加", icon: "pricetag-outline", route: "/tag_add" },
      { title: "学生登録", icon: "person-add-outline", route: "/s_register" },
      { title: "学生一覧", icon: "people-outline", route: "/s_list" },
      { title: "教師登録", icon: "person-add-outline", route: "/t_register" },
      { title: "教師一覧", icon: "people-outline", route: "/t_list" },
    ];
  } else {
    menus = [
      { title: "質問一覧", icon: "list-outline", route: "/question_list" },
      { title: "質問集計", icon: "stats-chart-outline", route: "/question_tally" },
      { title: "質問比率", icon: "pie-chart-outline", route: "/" },
      { title: "回答状況", icon: "checkmark-done-outline", route: "/" },
      { title: "タグ追加", icon: "pricetag-outline", route: "/tag_add" },
    ];
  }

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <Text style={styles.title}>ダッシュボード</Text>
      <Text style={styles.subtitle}>
        ようこそ、{status.admin ? "管理者" : "教員"}さん
      </Text>

      {/* メニューグリッド */}
      <FlatList
        data={menus}
        keyExtractor={(item) => item.route}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon as any} size={32} color="#FF8C00" />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF8C00",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fdfdfd",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
});
