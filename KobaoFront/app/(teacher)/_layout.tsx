import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
 
export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#FF8C00" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#FF8C00",
        drawerInactiveTintColor: "#555",
        drawerStyle: {
          backgroundColor: "#fff",
          width: 200,
        },
        drawerLabelStyle: {
          fontSize: 14,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "ダッシュボード",
          drawerLabel: "ダッシュボード",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="question_list"
        options={{
          title: "質問一覧",
          drawerLabel: "質問一覧",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="question_tally"
        options={{
          title: "質問集計",
          drawerLabel: "質問集計",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="tag_add"
        options={{
          title: "タグの追加",
          drawerLabel: "タグの追加",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="pricetag-outline" color={color} size={size} />
          ),
        }}
      />
 
      <Drawer.Screen
        name="s_register"
        options={{
          title: "学生登録",
          drawerLabel: "学生登録",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-add-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="s_list"
        options={{
          title: "学生一覧",
          drawerLabel: "学生一覧",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="t_register"
        options={{
          title: "教師登録",
          drawerLabel: "教師登録",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-add-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="t_list"
        options={{
          title: "教師一覧",
          drawerLabel: "教師一覧",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}