import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getTokens } from "@/src/token";
import { api } from "@/src/api";

export default function Layout() {
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

  if (status === null) return null; // または <Loading />

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#FF8C00" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#FF8C00",
        drawerInactiveTintColor: "#555",
        drawerStyle: { backgroundColor: "#fff", width: 200 },
        drawerLabelStyle: { fontSize: 14 },
      }}
    >
      {/* 共通スクリーン */}
      <Drawer.Screen
        name="index"
        options={{
          title: "ダッシュボード",
          drawerLabel: "ダッシュボード",
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="question_list"
        options={{
          title: "質問一覧",
          drawerLabel: "質問一覧",
          drawerIcon: ({ color, size }) => <Ionicons name="list-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="question_tally"
        options={{
          title: "質問集計",
          drawerLabel: "質問集計",
          drawerIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="question_ratio"
        options={{
          title: "質問比率",
          drawerLabel: "質問比率",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pie-chart-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="answer_status"
        options={{
          title: "回答状況",
          drawerLabel: "回答状況",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="tag_add"
        options={{
          title: "タグの追加",
          drawerLabel: "タグの追加",
          drawerIcon: ({ color, size }) => <Ionicons name="pricetag-outline" color={color} size={size} />,
        }}
      />

      {/* 管理者スクリーン。存在は常に描画、非表示は display で制御 */}
      <Drawer.Screen
        name="s_register"
        options={{
          title: "学生登録",
          drawerLabel: "学生登録",
          drawerIcon: ({ color, size }) => <Ionicons name="person-add-outline" color={color} size={size} />,
          drawerItemStyle: { display: status.admin ? 'flex' : 'none' },
        }}
      />
      <Drawer.Screen
        name="s_list"
        options={{
          title: "学生一覧",
          drawerLabel: "学生一覧",
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
          drawerItemStyle: { display: status.admin ? 'flex' : 'none' },
        }}
      />
      <Drawer.Screen
        name="t_register"
        options={{
          title: "教員登録",
          drawerLabel: "教員登録",
          drawerIcon: ({ color, size }) => <Ionicons name="person-add-outline" color={color} size={size} />,
          drawerItemStyle: { display: status.admin ? 'flex' : 'none' },
        }}
      />
      <Drawer.Screen
        name="t_list"
        options={{
          title: "教員一覧",
          drawerLabel: "教員一覧",
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
          drawerItemStyle: { display: status.admin ? 'flex' : 'none' },
        }}
      />
    </Drawer>
  );
}
