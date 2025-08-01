
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs>
            {/* name:ファイルの名前 options:設定集 */}
            <Tabs.Screen name='index' options={{ title: 'Home' }} />
        </Tabs>
    )
}