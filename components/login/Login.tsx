import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import useNews from '@/hooks/useNews';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginPage = () => {
    const nav = useRouter()
    const { Login } = useNews()
    const colorSheme = useColorScheme()
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async() => {
        console.log('Logging in with:', email, password);
        await Login(email, password)
        nav.push({
            pathname: "/Upload/Upload"
        })
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={[styles.loginButton,{backgroundColor: Colors["light"].tint}]} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 32,
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    loginButton: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    link: {
        marginLeft: 4,
    },
});

export default LoginPage;