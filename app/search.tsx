import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from 'react';
import { router } from "expo-router";


export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    // Data trending yg lebih keren
    const trendingTopics = [
        { id: 1, title: "Street Drift King 👑", views: "1.2M views" },
        { id: 2, title: "Mountain Touge Battle 🗻", views: "890K views" },
        { id: 3, title: "Night Racing Vibes 🌙", views: "750K views" },
        { id: 4, title: "Perfect Drift Line 🎯", views: "650K views" },
        { id: 5, title: "JDM Drift Compilation 🏎️", views: "520K views" },
        { id: 6, title: "Drift Championship 🏆", views: "480K views" }
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={[styles.innerContainer, { backgroundColor }]}>
                {/* Header dgn custom back button */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={textColor} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: textColor }]}>Search</Text>
                </View>

                {/* Search Bar yg lebih keren */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput 
                        style={[styles.searchInput, { color: textColor }]}
                        placeholder="Cari video drift keren..." 
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity 
                            style={styles.clearButton}
                            onPress={() => setSearchQuery('')}
                        >
                            <Ionicons name="close-circle" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Trending Section yg lebih fancy */}
                <ScrollView style={styles.trendingContainer} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>🔥 Trending Now</Text>
                    {trendingTopics.map((topic) => (
                        <TouchableOpacity 
                            key={topic.id} 
                            style={styles.trendingItem}
                        >
                            <View>
                                <Text style={[styles.trendingText, { color: textColor }]}>{topic.title}</Text>
                                <Text style={styles.viewsText}>{topic.views}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(150, 150, 150, 0.1)'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 16
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(150, 150, 150, 0.1)',
        borderRadius: 16,
        margin: 16,
        padding: 12
    },
    searchIcon: {
        marginRight: 12
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 0
    },
    clearButton: {
        padding: 4
    },
    trendingContainer: {
        flex: 1,
        paddingHorizontal: 16
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    trendingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150, 150, 150, 0.1)'
    },
    trendingText: {
        fontSize: 16,
        marginBottom: 4
    },
    viewsText: {
        fontSize: 14,
        color: '#666'
    }
});