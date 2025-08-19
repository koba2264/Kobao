import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark" ? true : false;

  return (

    <View style={[styles.container, { backgroundColor: isDark ? "#000000" : "#fbfbfb" }]}>
      {/* ヘッダー */}
      <View style={[styles.header, { backgroundColor: "#FF8C00" }]}>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>KOBAO</Text>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={() => null}
      >
        <Tabs.Screen name="index" options={{ title: 'ホーム' }} />
      </Tabs>

      {/* フッター */}
      <View style={[
        styles.footer,
        { backgroundColor: isDark ? "#000" : "#fff", borderColor: isDark ? "#555" : "#ccc" }
      ]}>
        <TouchableOpacity
          style={[
            styles.footerItem,
            (pathname === '/' || pathname === '/standby' || pathname.startsWith('/question/') || pathname.startsWith('/questionStandby/')) && styles.activeItem,

          ]}
          onPress={() => router.push('/')}
        >
          <Text style={pathname === '/' ? styles.activeText : [styles.inactiveText, { color: isDark ? "#bbb" : "#444" }]}>⌂</Text>
          <Text
            style={pathname === '/' ? styles.activeText : [styles.inactiveText, { color: isDark ? "#bbb" : "#444" }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            ホーム
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerItem,
            (pathname === '/chat' || pathname === '/result' || pathname === '/sendTeacher') && styles.activeItem,
          ]}
          onPress={() => router.push('/chat')}
        >
          <Text style={pathname === '/chat' ? styles.activeText : [styles.inactiveText, { color: isDark ? "#bbb" : "#444" }]}>💭</Text>
          <Text
            style={pathname === '/chat' ? styles.activeText : [styles.inactiveText, { color: isDark ? "#bbb" : "#444" }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            質問
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerItem,

            (pathname === '/history' || pathname.startsWith('/historyDetaile/')) && styles.activeItem,
          ]}
          onPress={() => router.push('/history')}
        >
          <Text style={pathname === '/history' ? styles.activeText : [styles.inactiveText, { color: isDark ? "#bbb" : "#444" }]}>📙</Text>
          <Text
            style={pathname === '/history' ? styles.activeText : [styles.inactiveText, { color: isDark ? "#bbb" : "#444" }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            履歴
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerItem,
            pathname === '/mypage' && styles.activeItem,
          ]}
          onPress={() => router.push('/mypage')}
        >
          <Text style={pathname === '/mypage' ? styles.activeText : [styles.inactiveText, { color: isDark ? "#bbb" : "#444" }]}>👤</Text>
          <Text
            style={pathname === '/mypage' ? styles.activeText : [styles.inactiveText, { color: isDark ? "#bbb" : "#444" }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >プロフィール</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 1,
    borderTopWidth: 1,
    height: 100,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: '#FFE4B5',
  },
  activeText: {
    color: '#FF8C00',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inactiveText: {
    fontSize: 15,
  },
});
