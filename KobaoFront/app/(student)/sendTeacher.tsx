import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function ResultScreen() {
    const { message } = useLocalSearchParams();
    const displayMessage = Array.isArray(message) ? message[0] : message ?? '';

    const onSendPress = () => {
        router.push({
            pathname: '/(student)/sendTeacher',
            params: { message: displayMessage },
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>質問内容</Text>

                {/* 高さ・幅固定しスクロール可能に */}
                <ScrollView
                    style={styles.userMessageContainer}
                    contentContainerStyle={{ padding: 8 }}
                    nestedScrollEnabled={true} 
                >
                    <Text style={styles.userMessage}>{displayMessage}</Text>
                </ScrollView>

                <Text style={styles.confirmText}>上記の内容で送信しますか？</Text>
            </ScrollView>

            <Pressable style={styles.askButton} onPress={onSendPress}>
                <Text style={styles.askButtonText}>決定</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#424242',
        marginBottom: 16,
        textAlign: 'center',
    },
    userMessageContainer: {
        backgroundColor: '#FFCC80',
        borderRadius: 16,
        maxWidth: '90%',
        width: 320,
        height: 150,
        alignSelf: 'center',
        marginBottom: 24,
    },
    userMessage: {
        fontSize: 18,
        color: '#4E342E',
    },

    confirmText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
    },
    askButton: {
        width: "90%",
        backgroundColor: "#ff981aff",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
    },
    askButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
