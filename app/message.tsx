import { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Pressable, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    Platform, 
    FlatList,
    Image,
    Animated,
    Dimensions,
    Keyboard
} from "react-native";
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Dummy messages utk testing
const MESSAGES = [
    {
        id: '1',
        text: 'Hey, how are you?',
        time: '09:41',
        isMe: false
    },
    {
        id: '2',
        text: 'I\'m good! Just finished my work. How about you?',
        time: '09:42',
        isMe: true
    },
    {
        id: '3',
        text: 'Same here! Would you like to grab coffee sometime?',
        time: '09:43',
        isMe: false
    },
    {
        id: '4',
        text: 'Sure! That sounds great! When are you free?',
        time: '09:44',
        isMe: true
    }
];

type MessageItemProps = {
    item: typeof MESSAGES[0];
    textColor: string;
    tintColor: string;
    isDark: boolean;
};

function MessageItem({ item, textColor, tintColor, isDark }: MessageItemProps) {
    return (
        <View style={{
            alignSelf: item.isMe ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            marginVertical: 4,
            marginHorizontal: 16
        }}>
            <View style={{
                backgroundColor: item.isMe 
                    ? isDark 
                        ? '#2196F3'  // Biru lebih gelap utk dark mode
                        : tintColor 
                    : isDark 
                        ? '#ffffff15'  // Lebih gelap utk dark mode
                        : '#00000008',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopRightRadius: item.isMe ? 4 : 20,
                borderTopLeftRadius: item.isMe ? 20 : 4,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: isDark ? 0.2 : 0.1,
                shadowRadius: 2,
                elevation: 2
            }}>
                <Text style={{
                    color: item.isMe 
                        ? '#fff'  // Tetep putih utk bubble chat kita
                        : isDark 
                            ? '#ffffffee'  // Sedikit transparent di dark mode
                            : '#000000ee',
                    fontSize: 16
                }}>
                    {item.text}
                </Text>
            </View>
            <Text style={{
                color: isDark ? '#ffffff80' : '#00000080',
                fontSize: 12,
                marginTop: 4,
                marginHorizontal: 4,
                alignSelf: item.isMe ? 'flex-end' : 'flex-start'
            }}>
                {item.time}
            </Text>
        </View>
    );
}

// Bikin type buat message
type Message = {
    id: string;
    text: string;
    time: string;
    isMe: boolean;
};

// Bikin type buat chat history
type ChatHistory = {
    [key: string]: Message[];
};

// Pindahin CHAT_HISTORY ke global state (simulasi database)
let CHAT_HISTORY: ChatHistory = {
    '1': [
        {
            id: '1_1',
            text: 'Hey Sarah! How are you?',
            time: '09:41',
            isMe: true
        },
        {
            id: '1_2',
            text: 'Hi! Im doing great, thanks for asking! Just finished my morning workout 🏃‍♀️',
            time: '09:42',
            isMe: false
        }
    ],
    '2': [
        {
            id: '2_1',
            text: 'Alex, have you checked the latest project updates?',
            time: '10:15',
            isMe: true
        }
    ],
    '3': [
        {
            id: '3_1',
            text: 'Emily, what time is the meeting tomorrow?',
            time: '11:30',
            isMe: true
        }
    ]
};

export default function MessageScreen() {
    const params = useLocalSearchParams();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);
    
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;
    const isDark = useColorScheme() === 'dark';

    // Tambahin ref buat keyboard height
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [inputHeight, setInputHeight] = useState(0);

    // Load chat history safely
    useEffect(() => {
        try {
            if (params.id) {
                const chatId = params.id as string;
                const history = CHAT_HISTORY[chatId] || [];
                setChatHistory(history);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setChatHistory([]);
        } finally {
            setIsLoading(false);
        }
    }, [params.id]);

    // Handle send message safely
    const handleSend = () => {
        try {
            if (!message.trim() || !params.id) return;

            const chatId = params.id as string;
            const newMessage: Message = {
                id: `${chatId}_${Date.now()}`,
                text: message.trim(),
                time: new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                isMe: true
            };

            // Update local state
            setChatHistory(prev => [...prev, newMessage]);

            // Update global state (simulasi database)
            CHAT_HISTORY = {
                ...CHAT_HISTORY,
                [chatId]: [...(CHAT_HISTORY[chatId] || []), newMessage]
            };

            // Clear input
            setMessage('');

            // Scroll to bottom safely
            setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }, 100);

        } catch (error) {
            console.error('Error sending message:', error);
            // Bisa tambah error handling UI di sini
        }
    };

    // Handle keyboard show/hide
    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: textColor }}>Loading chat...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#ffffff10' : '#00000010'
            }}>
                <Pressable 
                    onPress={() => router.back()}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                        padding: 4
                    })}
                >
                    <Ionicons 
                        name="chevron-back" 
                        size={24} 
                        color={textColor} 
                    />
                </Pressable>
                
                <Image 
                    source={{ uri: params.avatar as string }} 
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginHorizontal: 12
                    }}
                />
                
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: textColor
                    }}>
                        {params.name}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: textColor,
                        opacity: 0.6
                    }}>
                        Online
                    </Text>
                </View>

                <Pressable 
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                        padding: 4
                    })}
                >
                    <Ionicons 
                        name="ellipsis-vertical" 
                        size={24} 
                        color={textColor} 
                    />
                </Pressable>
            </View>

            {/* Wrap content dalam KeyboardAvoidingView */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <View style={{ flex: 1 }}>
                    {/* Chat Messages */}
                    <FlatList
                        ref={flatListRef}
                        data={chatHistory}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <MessageItem 
                                item={item} 
                                textColor={textColor}
                                tintColor={tintColor}
                                isDark={isDark}
                            />
                        )}
                        contentContainerStyle={{ 
                            paddingVertical: 16,
                            flexGrow: 1,
                            justifyContent: chatHistory.length === 0 ? 'center' : 'flex-start'
                        }}
                        showsVerticalScrollIndicator={false}
                        onLayout={() => {
                            if (chatHistory.length > 0 && flatListRef.current) {
                                flatListRef.current.scrollToEnd({ animated: false });
                            }
                        }}
                        ListEmptyComponent={() => (
                            <View style={{ 
                                flex: 1, 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                opacity: 0.5
                            }}>
                                <Text style={{ color: textColor }}>No messages yet</Text>
                            </View>
                        )}
                    />

                    {/* Message Input */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end', // Changed from center
                        padding: 16,
                        gap: 12,
                        borderTopWidth: 1,
                        borderTopColor: isDark ? '#ffffff10' : '#00000010',
                        paddingBottom: Platform.OS === 'android' ? keyboardHeight : 16 // Add padding for Android
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'flex-end', // Changed from center
                            backgroundColor: isDark ? '#ffffff15' : '#00000008',
                            borderRadius: 24,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            minHeight: 44,
                            maxHeight: 120 // Limit max height
                        }}>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Type a message..."
                                placeholderTextColor={isDark ? '#ffffff50' : '#00000050'}
                                style={{
                                    flex: 1,
                                    color: isDark ? '#ffffffee' : '#000000ee',
                                    fontSize: 16,
                                    maxHeight: 100,
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                    textAlignVertical: 'center'
                                }}
                                multiline
                                maxLength={1000}
                                onContentSizeChange={(e) => {
                                    const height = e.nativeEvent.contentSize.height;
                                    setInputHeight(height);
                                    // Auto scroll when input grows
                                    if (flatListRef.current) {
                                        flatListRef.current.scrollToEnd({ animated: true });
                                    }
                                }}
                            />
                        </View>

                        <Pressable 
                            onPress={handleSend}
                            style={({ pressed }) => ({
                                opacity: message.trim() ? (pressed ? 0.7 : 1) : 0.5,
                                padding: 8,
                                backgroundColor: message.trim() 
                                    ? isDark 
                                        ? '#2196F3' 
                                        : tintColor 
                                    : isDark 
                                        ? '#ffffff20' 
                                        : '#00000020',
                                borderRadius: 20,
                                alignSelf: 'flex-end', // Align with input
                                marginBottom: 2
                            })}
                            disabled={!message.trim()}
                        >
                            <Ionicons 
                                name="send" 
                                size={24} 
                                color={message.trim() ? '#fff' : isDark ? '#ffffff80' : '#00000080'} 
                            />
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}   