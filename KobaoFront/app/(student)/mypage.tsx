import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { api } from '@/src/api';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { logout } from "@/src/auth";

const Home: React.FC = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";


    useFocusEffect(
        React.useCallback(() => {
            fetch(`${api.defaults.baseURL}/student/messages`)
                .then(res => res.json())
                .catch(err => console.error("APIエラー:", err));
        }, [])
    );







































    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
            <View style={styles.listContainer}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={[styles.statusBox, { backgroundColor: isDark ? "#222" : "#ff8c0834" }]}>
                        <Text style={[styles.statusTitle, { color: isDark ? "#fff" : "#000" }]}>私の情報</Text>
                    </View>
                </ScrollView>
            </View>

            {/* ボタン部分 */}
            <View style={[styles.buttonContainer]}>
                {(
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isDark ? "#ff981a" : "#ff981aff" }]}
                        onPress={async () => {
                            await logout();
                            router.replace("/login");
                        }}
                    >
                        <Text style={styles.buttonText}>ログアウト</Text>
                    </TouchableOpacity>
                )}
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
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: '#FF8C00',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        width: "95%",
        
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
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
