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
    Keyboard,
    KeyboardEvent
} from "react-native";
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

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
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    // Tambahin state utk popup menu
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const attachMenuAnim = useRef(new Animated.Value(0)).current;

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

    // Handle keyboard events
    useEffect(() => {
        const keyboardWillShow = (e: KeyboardEvent) => {
            setIsKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
            
            // Delay scroll sedikit biar smooth
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        };

        const keyboardWillHide = () => {
            setIsKeyboardVisible(false);
            setKeyboardHeight(0);
        };

        // Subscribe ke event keyboard
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            keyboardWillShow
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            keyboardWillHide
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Auto scroll pas content berubah
    const handleContentSizeChange = () => {
        if (isKeyboardVisible) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    };

    // Tambahin fungsi utk show/hide menu
    const toggleAttachMenu = () => {
        if (showAttachMenu) {
            Animated.spring(attachMenuAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 5
            }).start(() => setShowAttachMenu(false));
        } else {
            setShowAttachMenu(true);
            Animated.spring(attachMenuAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 40,
                friction: 6
            }).start();
        }
    };

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
        <>
            {/* Custom Header */}
            <Stack.Screen
                options={{
                    headerShown: false // Hide default header
                }}
            />

            <SafeAreaView style={{ flex: 1, backgroundColor }}>
                {/* Custom Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? '#ffffff10' : '#00000010',
                    backgroundColor: backgroundColor
                }}>
                    {/* Back Button */}
                    <Pressable 
                        onPress={() => router.back()}
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.7 : 1,
                            padding: 8,
                            marginLeft: -8
                        })}
                    >
                        <Ionicons 
                            name="chevron-back" 
                            size={28} 
                            color={textColor} 
                        />
                    </Pressable>
                    
                    {/* Profile Info */}
                    <Pressable 
                        style={({ pressed }) => ({
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 4,
                            opacity: pressed ? 0.7 : 1
                        })}
                        onPress={() => {
                            // Nanti bisa navigate ke profile
                            console.log('View profile');
                        }}
                    >
                        <Image 
                            source={{ uri: params.avatar as string }} 
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                marginRight: 12
                            }}
                        />
                        
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: textColor,
                                marginBottom: 2
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
                    </Pressable>

                    {/* Action Buttons */}
                    <View style={{ 
                        flexDirection: 'row', 
                        gap: 20,
                        marginRight: -8
                    }}>
                        {/* Voice Call */}
                        <Pressable 
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.7 : 1,
                                padding: 8
                            })}
                            onPress={() => {
                                console.log('Voice call');
                            }}
                        >
                            <Ionicons 
                                name="call-outline" 
                                size={24} 
                                color={textColor} 
                            />
                        </Pressable>

                        {/* Video Call */}
                        <Pressable 
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.7 : 1,
                                padding: 8
                            })}
                            onPress={() => {
                                console.log('Video call');
                            }}
                        >
                            <Ionicons 
                                name="videocam-outline" 
                                size={24} 
                                color={textColor} 
                            />
                        </Pressable>

                        {/* More Options */}
                        <Pressable 
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.7 : 1,
                                padding: 8
                            })}
                            onPress={() => {
                                console.log('More options');
                            }}
                        >
                            <Ionicons 
                                name="ellipsis-vertical" 
                                size={24} 
                                color={textColor} 
                            />
                        </Pressable>
                    </View>
                </View>

                {/* Wrap content dalam KeyboardAvoidingView */}
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Updated offset
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
                            onContentSizeChange={handleContentSizeChange}
                            onLayout={handleContentSizeChange}
                            maintainVisibleContentPosition={{
                                minIndexForVisible: 0,
                                autoscrollToTopThreshold: 10
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

                        {/* Message Input Container */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            padding: 16,
                            paddingBottom: Platform.OS === 'android' ? (isKeyboardVisible ? 12 : 20) : 20,
                            gap: 8,
                            borderTopWidth: 1,
                            borderTopColor: isDark ? '#ffffff15' : '#00000010',
                            backgroundColor: backgroundColor
                        }}>
                            {/* Attachment Button & Menu */}
                            <View>
                                <Pressable 
                                    onPress={toggleAttachMenu}
                                    style={({ pressed }) => ({
                                        opacity: pressed ? 0.7 : 1,
                                        padding: 10,
                                        backgroundColor: isDark ? '#ffffff15' : '#00000008',
                                        borderRadius: 12,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    })}
                                >
                                    <Ionicons 
                                        name="add-circle-outline" 
                                        size={22} 
                                        color={isDark ? '#ffffff90' : '#00000090'} 
                                    />
                                </Pressable>

                                {/* Popup Menu */}
                                {showAttachMenu && (
                                    <>
                                        <Pressable 
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                width: Dimensions.get('window').width,
                                                height: Dimensions.get('window').height,
                                                backgroundColor: isDark ? '#00000050' : '#00000030'
                                            }}
                                            onPress={toggleAttachMenu}
                                        />
                                        <Animated.View style={{
                                            position: 'absolute',
                                            bottom: 80,
                                            left: 0,
                                            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                                            borderRadius: 20,
                                            padding: 16,
                                            flexDirection: 'row',
                                            gap: 16,
                                            shadowColor: '#000',
                                            shadowOffset: {
                                                width: 0,
                                                height: 4,
                                            },
                                            shadowOpacity: isDark ? 0.35 : 0.15,
                                            shadowRadius: 8,
                                            elevation: 8,
                                            transform: [
                                                { 
                                                    translateY: attachMenuAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [20, 0]
                                                    })
                                                },
                                                {
                                                    scale: attachMenuAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0.8, 1]
                                                    })
                                                }
                                            ],
                                            opacity: attachMenuAnim
                                        }}>
                                            {/* Camera Button */}
                                            <Pressable 
                                                onPress={() => {
                                                    console.log('Open camera');
                                                    toggleAttachMenu();
                                                }}
                                                style={({ pressed }) => ({
                                                    opacity: pressed ? 0.7 : 1,
                                                    padding: 16,
                                                    backgroundColor: isDark ? '#ffffff10' : '#00000008',
                                                    borderRadius: 16,
                                                    alignItems: 'center',
                                                    width: 80,
                                                    height: 80,
                                                    justifyContent: 'center'
                                                })}
                                            >
                                                <View style={{
                                                    backgroundColor: isDark ? '#ffffff15' : '#00000010',
                                                    padding: 10,
                                                    borderRadius: 12,
                                                    marginBottom: 8
                                                }}>
                                                    <Ionicons 
                                                        name="camera-outline" 
                                                        size={24} 
                                                        color={isDark ? '#ffffff90' : '#00000090'} 
                                                    />
                                                </View>
                                                <Text style={{
                                                    color: isDark ? '#ffffff90' : '#00000090',
                                                    fontSize: 12,
                                                    fontWeight: '500'
                                                }}>
                                                    Camera
                                                </Text>
                                            </Pressable>

                                            {/* Photo Library Button */}
                                            <Pressable 
                                                onPress={() => {
                                                    console.log('Open photos');
                                                    toggleAttachMenu();
                                                }}
                                                style={({ pressed }) => ({
                                                    opacity: pressed ? 0.7 : 1,
                                                    padding: 16,
                                                    backgroundColor: isDark ? '#ffffff10' : '#00000008',
                                                    borderRadius: 16,
                                                    alignItems: 'center',
                                                    width: 80,
                                                    height: 80,
                                                    justifyContent: 'center'
                                                })}
                                            >
                                                <View style={{
                                                    backgroundColor: isDark ? '#ffffff15' : '#00000010',
                                                    padding: 10,
                                                    borderRadius: 12,
                                                    marginBottom: 8
                                                }}>
                                                    <Ionicons 
                                                        name="images-outline" 
                                                        size={24} 
                                                        color={isDark ? '#ffffff90' : '#00000090'} 
                                                    />
                                                </View>
                                                <Text style={{
                                                    color: isDark ? '#ffffff90' : '#00000090',
                                                    fontSize: 12,
                                                    fontWeight: '500'
                                                }}>
                                                    Photos
                                                </Text>
                                            </Pressable>

                                            {/* File Button */}
                                            <Pressable 
                                                onPress={() => {
                                                    console.log('Open files');
                                                    toggleAttachMenu();
                                                }}
                                                style={({ pressed }) => ({
                                                    opacity: pressed ? 0.7 : 1,
                                                    padding: 16,
                                                    backgroundColor: isDark ? '#ffffff10' : '#00000008',
                                                    borderRadius: 16,
                                                    alignItems: 'center',
                                                    width: 80,
                                                    height: 80,
                                                    justifyContent: 'center'
                                                })}
                                            >
                                                <View style={{
                                                    backgroundColor: isDark ? '#ffffff15' : '#00000010',
                                                    padding: 10,
                                                    borderRadius: 12,
                                                    marginBottom: 8
                                                }}>
                                                    <Ionicons 
                                                        name="document-outline" 
                                                        size={24} 
                                                        color={isDark ? '#ffffff90' : '#00000090'} 
                                                    />
                                                </View>
                                                <Text style={{
                                                    color: isDark ? '#ffffff90' : '#00000090',
                                                    fontSize: 12,
                                                    fontWeight: '500'
                                                }}>
                                                    Files
                                                </Text>
                                            </Pressable>
                                        </Animated.View>
                                    </>
                                )}
                            </View>

                            {/* Message Input */}
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                backgroundColor: isDark ? '#ffffff15' : '#00000008',
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                minHeight: 44,
                                maxHeight: 120
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
                                        paddingVertical: 4,
                                        textAlignVertical: 'center',
                                        lineHeight: 20
                                    }}
                                    multiline
                                    maxLength={1000}
                                    onContentSizeChange={() => {
                                        if (isKeyboardVisible) {
                                            flatListRef.current?.scrollToEnd({ animated: true });
                                        }
                                    }}
                                />
                            </View>

                            {/* Right Action Buttons Container */}
                            <View style={{ 
                                flexDirection: 'row', 
                                gap: 4,
                                marginLeft: 4 
                            }}>
                                {/* Microphone Button */}
                                <Pressable 
                                    onPress={() => console.log('Start recording')}
                                    style={({ pressed }) => ({
                                        opacity: pressed ? 0.7 : 1,
                                        padding: 10,
                                        backgroundColor: isDark ? '#ffffff15' : '#00000008',
                                        borderRadius: 12,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    })}
                                >
                                    <Ionicons 
                                        name="mic-outline" 
                                        size={22} 
                                        color={isDark ? '#ffffff90' : '#00000090'} 
                                    />
                                </Pressable>

                                {/* Send Button */}
                                <Pressable 
                                    onPress={handleSend}
                                    style={({ pressed }) => ({
                                        opacity: message.trim() ? (pressed ? 0.7 : 1) : 0.5,
                                        padding: 10,
                                        backgroundColor: message.trim() 
                                            ? isDark 
                                                ? '#2196F3' 
                                                : tintColor 
                                            : isDark 
                                                ? '#ffffff20' 
                                                : '#00000015',
                                        borderRadius: 12,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    })}
                                    disabled={!message.trim()}
                                >
                                    <Ionicons 
                                        name="send" 
                                        size={22} 
                                        color={message.trim() ? '#fff' : isDark ? '#ffffff70' : '#00000070'} 
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}   