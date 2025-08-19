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
            <Text style={styles.title}>質問内容</Text>

            <View style={styles.messageContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.userMessage}>{displayMessage}</Text>
                </ScrollView>
            </View>

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
        justifyContent: 'space-between', 
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#424242',
        textAlign: 'center',
        marginBottom: 16,
    },
    messageContainer: {
        flex: 0.7,      
        backgroundColor: '#ff8c0834',
        borderRadius: 16,
        padding: 12,
    },
    scrollContent: {
        flexGrow: 1,
    },
    userMessage: {
        fontSize: 18,
        color: '#4E342E',
    },
    askButton: {
        width: '100%',
        backgroundColor: '#ff981aff',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    askButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
