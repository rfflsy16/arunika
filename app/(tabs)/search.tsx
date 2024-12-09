import { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    ScrollView, 
    Pressable, 
    ActivityIndicator,
    SafeAreaView,
    Image
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Types
type Category = {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

type SearchResult = {
    id: number;
    title: string;
    category: string;
    image: string;
    rating: number;
    reviews: number;
}

// Data constants dgn type
const CATEGORIES: Category[] = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'recent', label: 'Recent', icon: 'time' },
    { id: 'popular', label: 'Popular', icon: 'trending-up' },
    { id: 'food', label: 'Food', icon: 'restaurant' },
    { id: 'tech', label: 'Tech', icon: 'hardware-chip' },
    { id: 'education', label: 'Education', icon: 'school' },
];

const DUMMY_RESULTS: SearchResult[] = [
    { 
        id: 1, 
        title: 'Cara Memasak Nasi Goreng Spesial',
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500',
        rating: 4.8,
        reviews: 128
    },
    { 
        id: 2, 
        title: 'Tips Jago Programming dalam 30 Hari',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500',
        rating: 4.9,
        reviews: 256
    },
    { 
        id: 3, 
        title: 'Review iPhone 15 Pro Max Terbaru',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500',
        rating: 4.7,
        reviews: 89
    },
];

// Component types
type SearchHeaderProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    textColor: string;
    handleSearchFocus?: () => void;
}

// Komponen SearchHeader (optional, bisa dipindah ke komponen terpisah)
function SearchHeader({ searchQuery, setSearchQuery, textColor, handleSearchFocus }: SearchHeaderProps) {
    return (
        <Pressable 
            style={({ pressed }) => ([{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(150,150,150,0.1)',
                borderRadius: 16,
                paddingHorizontal: 16,
                height: 56,
                borderWidth: 1,
                borderColor: 'rgba(150,150,150,0.2)',
            }, pressed && {
                transform: [{ scale: 0.995 }]
            }])}
            onPress={handleSearchFocus}
        >
            <Ionicons name="search" size={24} color={textColor} style={{ opacity: 0.6 }} />
            <TextInput
                placeholder="Search anything..."
                placeholderTextColor={`${textColor}60`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    color: textColor,
                    fontWeight: '400'
                }}
            />
            {searchQuery.length > 0 && (
                <Pressable 
                    onPress={() => setSearchQuery('')}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 0.8,
                        transform: [{ scale: pressed ? 0.95 : 1 }]
                    })}
                >
                    <Ionicons name="close-circle" size={24} color={textColor} />
                </Pressable>
            )}
        </Pressable>
    );
}

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            {/* Search Header */}
            <View style={{ 
                padding: 16,
                paddingTop: 8,
                backgroundColor: backgroundColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
            }}>
                <SearchHeader
                    searchQuery={searchQuery}
                    setSearchQuery={handleSearch}
                    textColor={textColor}
                    handleSearchFocus={() => {}}
                />

                {/* Filter Tags */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 16 }}
                >
                    {['All', 'Recent', 'Popular', 'Trending', 'Featured'].map((filter) => (
                        <Pressable 
                            key={filter}
                            onPress={() => setSelectedCategory(filter)}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                backgroundColor: filter === selectedCategory ? tintColor : 'rgba(150,150,150,0.1)',
                                borderRadius: 25,
                                marginRight: 10,
                                borderWidth: filter === selectedCategory ? 0 : 1,
                                borderColor: 'rgba(150,150,150,0.2)'
                            }}
                        >
                            <Text style={{ 
                                color: filter === selectedCategory ? '#fff' : textColor,
                                fontWeight: '600',
                                fontSize: 15
                            }}>
                                {filter}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Search Results */}
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
            >
                {isLoading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={tintColor} />
                    </View>
                ) : searchQuery ? (
                    DUMMY_RESULTS.map(item => (
                        <Pressable 
                            key={item.id}
                            style={({ pressed }) => ({
                                backgroundColor: pressed ? 'rgba(150,150,150,0.1)' : backgroundColor,
                                borderRadius: 20,
                                marginBottom: 16,
                                padding: 12,
                                flexDirection: 'row',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            })}
                        >
                            <Image 
                                source={{ uri: item.image }}
                                style={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: 15,
                                }}
                            />
                            <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                                <View style={{ 
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    marginBottom: 6
                                }}>
                                    <Text style={{ 
                                        fontSize: 13,
                                        color: tintColor,
                                        fontWeight: '600',
                                        backgroundColor: `${tintColor}15`,
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 6
                                    }}>
                                        {item.category}
                                    </Text>
                                </View>
                                <Text style={{ 
                                    fontSize: 16, 
                                    color: textColor,
                                    fontWeight: '600',
                                    marginBottom: 6
                                }}>
                                    {item.title}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={{ 
                                        marginLeft: 4,
                                        color: textColor,
                                        fontWeight: '600'
                                    }}>
                                        {item.rating}
                                    </Text>
                                    <Text style={{ 
                                        marginLeft: 4,
                                        color: textColor,
                                        opacity: 0.6
                                    }}>
                                        ({item.reviews} reviews)
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    ))
                ) : (
                    <View style={{ 
                        padding: 40, 
                        alignItems: 'center',
                        opacity: 0.7
                    }}>
                        <Ionicons name="search-circle" size={80} color={textColor} style={{ opacity: 0.5, marginBottom: 16 }} />
                        <Text style={{ 
                            color: textColor,
                            fontSize: 16,
                            fontWeight: '600',
                            marginBottom: 8
                        }}>
                            Mau Nyari Apa Nih? 🤔
                        </Text>
                        <Text style={{ 
                            color: textColor,
                            opacity: 0.6,
                            textAlign: 'center',
                            paddingHorizontal: 32
                        }}>
                            Ketik sesuatu di search bar di atas utk mulai mencari...
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
