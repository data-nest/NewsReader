import useNews from '@/hooks/useNews';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import RenderHTML from 'react-native-render-html';

interface NewsItem {
    author: string;
    content: string;
    description: string;
    id: number;
    image: string;
    role: string;
    title: string;
}  


const ArticlePage = () => {
    const { width } = useWindowDimensions();
    const { id } = useLocalSearchParams()
    const { getOneNews } = useNews()
    const nav = useRouter()
    const [news, setNews] = useState<NewsItem | null>()
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        handleGetNews()
    },[])

    const handleGetNews = async() => {
        try {
            setLoading(true)
            const data = await getOneNews(id)
            console.log(data)
            setNews(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if(loading){
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={20} />
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>nav.back()} style={styles.backButton}>
                    <MaterialIcons size={24} name='arrow-back' />
                </TouchableOpacity>
            </View>
            {news?.image && <Image source={{ uri: news?.image }} style={styles.image} />}
            <View style={styles.content}>
                {news?.image && <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.paragraph, { marginRight: 4 }]}>
                        By
                    </Text>
                    <Text style={[styles.paragraph, { fontWeight: "bold" }]}>
                        {news?.author} | {news?.role}
                    </Text>
                </View>}
                <Text style={styles.title}>
                    {news?.title}
                </Text>
                {!news?.image && <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.paragraph, { marginRight: 4 }]}>
                        By
                    </Text>
                    <Text style={[styles.paragraph, { fontWeight: "bold" }]}>
                        {news?.author} | {news?.role}
                    </Text>
                </View>}
                <RenderHTML
                    contentWidth={width}
                    source={{ html: news?.content }}
                    tagsStyles={{
                        p: {
                            marginBottom: 8,
                        },
                        h1: {
                            marginBottom: 12,
                        },
                        h2: {
                            marginBottom: 10,
                        },
                    }}
                    defaultTextProps={{
                        style: { lineHeight: 22 },
                    }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10
    },
    content: {
        paddingVertical: 24,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default ArticlePage;