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
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="questions"
        options={{
          title: "質問一覧",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}

