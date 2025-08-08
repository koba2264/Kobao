import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  //console.log('現在のパス:', pathname);


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KOBAO</Text>
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={() => null}
      >
        <Tabs.Screen name="index" options={{ title: 'ホーム' }} />
      </Tabs>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.footerItem,
            pathname === '/' && styles.activeItem,
          ]}
          onPress={() => router.push('/')}
        >
          <Text style={pathname === '/' ? styles.activeText : styles.inactiveText}>🏠</Text>
          <Text style={pathname === '/' ? styles.activeText : styles.inactiveText} numberOfLines={1}
            ellipsizeMode="tail"
          >ホーム</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerItem,
            (pathname === '/chat' || pathname === '/result') && styles.activeItem,
          ]}
          onPress={() => router.push('/chat')}
        >
          <Text style={pathname === '/chat' ? styles.activeText : styles.inactiveText}>💬</Text>
          <Text style={pathname === '/chat' ? styles.activeText : styles.inactiveText} numberOfLines={1}
            ellipsizeMode="tail"
          >質問</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerItem,
            pathname === '/history' && styles.activeItem,
          ]}
          onPress={() => router.push('/history')}
        >
          <Text style={pathname === '/history' ? styles.activeText : styles.inactiveText}>📜</Text>
          <Text style={pathname === '/history' ? styles.activeText : styles.inactiveText} numberOfLines={1}
            ellipsizeMode="tail"
          >履歴</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerItem,
            pathname === '/profile' && styles.activeItem,
          ]}
          onPress={() => router.push('/profile')}
        >
          <Text style={pathname === '/profile' ? styles.activeText : styles.inactiveText}>👤</Text>
          <Text style={pathname === '/profile' ? styles.activeText : styles.inactiveText} numberOfLines={1}
            ellipsizeMode="tail"
          >プロフィール</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FF8C00',
  },
  headerTitle: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
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
    color: '#444',
    fontSize: 15,
  },

});
