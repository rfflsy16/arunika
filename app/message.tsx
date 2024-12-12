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
    KeyboardEvent,
    Easing,
    StyleSheet
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
                        ? 'rgba(33, 150, 243, 0.9)'  // Biru semi-transparent
                        : 'rgba(33, 150, 243, 0.95)' 
                    : isDark 
                        ? 'rgba(255, 255, 255, 0.08)'  // Lebih subtle di dark mode
                        : 'rgba(0, 0, 0, 0.04)',
                borderRadius: 24,  // Lebih rounded
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopRightRadius: item.isMe ? 8 : 24,
                borderTopLeftRadius: item.isMe ? 24 : 8,
                // Update shadow utk efek floating yg lebih bagus
                shadowColor: item.isMe ? '#2196F3' : '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: isDark ? 0.25 : 0.15,
                shadowRadius: 8,
                elevation: 4
            }}>
                <Text style={{
                    color: item.isMe 
                        ? '#fff'
                        : isDark 
                            ? 'rgba(255, 255, 255, 0.95)'
                            : 'rgba(0, 0, 0, 0.9)',
                    fontSize: 16,
                    lineHeight: 22  // Tambah line height utk readability
                }}>
                    {item.text}
                </Text>
            </View>
            <Text style={{
                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                fontSize: 12,
                marginTop: 6,
                marginHorizontal: 8,
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

// Tambahin AnimatedPressable component
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Tambahin constants
const BUTTON_SIZE = 58;
const MENU_PADDING = 24;
const GRID_GAP = 32;
const COLUMN_COUNT = 3;
const ANIMATION_DURATION = 300;

// Bikin type untuk attachment options
type AttachmentOption = {
    id: string;
    icon: any; // IconName from Ionicons
    label: string;
    color: string;
    gradient: string[];
    action: () => void;
};

const ATTACHMENT_OPTIONS: AttachmentOption[] = [
    {
        id: 'camera',
        icon: 'camera-outline',
        label: 'Camera',
        color: '#2196F3',
        gradient: ['#1E88E5', '#64B5F6'],
        action: () => console.log('Open camera')
    },
    {
        id: 'gallery',
        icon: 'images-outline',
        label: 'Gallery',
        color: '#FF4081',
        gradient: ['#E91E63', '#FF4081'],
        action: () => console.log('Open gallery')
    },
    {
        id: 'document',
        icon: 'document-outline',
        label: 'Document',
        color: '#4CAF50',
        gradient: ['#43A047', '#81C784'],
        action: () => console.log('Open document')
    },
    {
        id: 'location',
        icon: 'location-outline',
        label: 'Location',
        color: '#FF9800',
        gradient: ['#FB8C00', '#FFB74D'],
        action: () => console.log('Share location')
    },
    {
        id: 'contact',
        icon: 'person-outline',
        label: 'Contact',
        color: '#9C27B0',
        gradient: ['#8E24AA', '#BA68C8'],
        action: () => console.log('Share contact')
    },
    {
        id: 'audio',
        icon: 'musical-notes-outline',
        label: 'Audio',
        color: '#F44336',
        gradient: ['#E53935', '#EF5350'],
        action: () => console.log('Share audio')
    }
];

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

    // Hapus semua keyboard animation, cukup pake state
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Tambahin state utk popup menu
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    
    // Tambah animation values
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const attachmentAnim = useRef(new Animated.Value(0)).current;
    const optionsAnim = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

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

    // Update keyboard event listener
    useEffect(() => {
        const keyboardWillShow = (e: KeyboardEvent) => {
            setIsKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
            
            if (showAttachMenu) {
                toggleAttachMenu();
            }

            // Auto scroll ke bawah
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        };

        const keyboardWillHide = () => {
            setIsKeyboardVisible(false);
            setKeyboardHeight(0);
        };

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
    }, [showAttachMenu]);

    // Update toggleAttachMenu
    const toggleAttachMenu = () => {
        Keyboard.dismiss();
        
        if (showAttachMenu) {
            // Close animation
            Animated.parallel([
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(attachmentAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }),
                ...optionsAnim.map((anim, i) => 
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 200,
                        delay: i * 30,
                        useNativeDriver: true
                    })
                )
            ]).start(() => setShowAttachMenu(false));
        } else {
            setShowAttachMenu(true);
            // Open animation
            Animated.parallel([
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(attachmentAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }),
                ...optionsAnim.map((anim, i) => 
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 200,
                        delay: i * 30,
                        useNativeDriver: true
                    })
                )
            ]).start();
        }
    };

    // Update attachment menu render
    const renderAttachmentMenu = () => {
        if (!showAttachMenu) return null;

        const row1 = ATTACHMENT_OPTIONS.slice(0, 3);
        const row2 = ATTACHMENT_OPTIONS.slice(3, 6);

        return (
            <>
                <Animated.View 
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            opacity: backdropAnim
                        }
                    ]}
                >
                    <Pressable 
                        style={StyleSheet.absoluteFill} 
                        onPress={toggleAttachMenu} 
                    />
                </Animated.View>

                <Animated.View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: isDark ? '#121212' : '#f8f8f8',
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    padding: MENU_PADDING,
                    paddingTop: 16,
                    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
                    transform: [{
                        translateY: attachmentAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [300, 0]
                        })
                    }]
                }}>
                    {/* Handle Bar */}
                    <View style={{
                        width: 40,
                        height: 4,
                        backgroundColor: isDark 
                            ? 'rgba(255,255,255,0.15)' 
                            : 'rgba(0,0,0,0.15)',
                        borderRadius: 2,
                        alignSelf: 'center',
                        marginBottom: 24
                    }} />

                    {/* Grid Container */}
                    <View style={{
                        gap: GRID_GAP,
                        paddingHorizontal: 8
                    }}>
                        {/* Row 1 */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {row1.map((option, index) => (
                                <AnimatedPressable
                                    key={option.id}
                                    style={[{
                                        opacity: optionsAnim[index],
                                        transform: [{
                                            scale: optionsAnim[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1]
                                            })
                                        }]
                                    }]}
                                    onPress={() => {
                                        option.action();
                                        toggleAttachMenu();
                                    }}
                                >
                                    <View style={{
                                        alignItems: 'center',
                                        gap: 10
                                    }}>
                                        <View style={{
                                            width: BUTTON_SIZE,
                                            height: BUTTON_SIZE,
                                            borderRadius: BUTTON_SIZE / 2,
                                            backgroundColor: isDark 
                                                ? `${option.color}20` 
                                                : `${option.color}15`,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: `${option.color}30`
                                        }}>
                                            <Ionicons 
                                                name={option.icon} 
                                                size={26}
                                                color={option.color}
                                                style={{ opacity: 0.9 }}
                                            />
                                        </View>
                                        <Text style={{
                                            color: isDark 
                                                ? 'rgba(255,255,255,0.9)' 
                                                : 'rgba(0,0,0,0.9)',
                                            fontSize: 13,
                                            fontWeight: '500'
                                        }}>
                                            {option.label}
                                        </Text>
                                    </View>
                                </AnimatedPressable>
                            ))}
                        </View>

                        {/* Row 2 */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {row2.map((option, index) => (
                                <AnimatedPressable
                                    key={option.id}
                                    style={[{
                                        opacity: optionsAnim[index + 3],
                                        transform: [{
                                            scale: optionsAnim[index + 3].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1]
                                            })
                                        }]
                                    }]}
                                    onPress={() => {
                                        option.action();
                                        toggleAttachMenu();
                                    }}
                                >
                                    <View style={{
                                        alignItems: 'center',
                                        gap: 10
                                    }}>
                                        <View style={{
                                            width: BUTTON_SIZE,
                                            height: BUTTON_SIZE,
                                            borderRadius: BUTTON_SIZE / 2,
                                            backgroundColor: isDark 
                                                ? `${option.color}20` 
                                                : `${option.color}15`,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: `${option.color}30`
                                        }}>
                                            <Ionicons 
                                                name={option.icon} 
                                                size={26}
                                                color={option.color}
                                                style={{ opacity: 0.9 }}
                                            />
                                        </View>
                                        <Text style={{
                                            color: isDark 
                                                ? 'rgba(255,255,255,0.9)' 
                                                : 'rgba(0,0,0,0.9)',
                                            fontSize: 13,
                                            fontWeight: '500'
                                        }}>
                                            {option.label}
                                        </Text>
                                    </View>
                                </AnimatedPressable>
                            ))}
                        </View>
                    </View>
                </Animated.View>
            </>
        );
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
            <Stack.Screen options={{ headerShown: false }} />
            
            <SafeAreaView style={{ flex: 1, backgroundColor }}>
                {/* Header */}
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

                {/* Main Content */}
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
                            onContentSizeChange={() => {
                                if (isKeyboardVisible) {
                                    flatListRef.current?.scrollToEnd({ animated: true });
                                }
                            }}
                            onLayout={() => {
                                if (isKeyboardVisible) {
                                    flatListRef.current?.scrollToEnd({ animated: true });
                                }
                            }}
                        />

                        {/* Message Input Container */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            padding: 16,
                            paddingBottom: Platform.OS === 'ios' ? 16 : 16,
                            gap: 8,
                            borderTopWidth: 1,
                            borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            backgroundColor: isDark ? '#121212' : '#f8f8f8'
                        }}>
                            {/* Attachment Button */}
                            <Pressable 
                                onPress={toggleAttachMenu}
                                style={({ pressed }) => ({
                                    opacity: pressed ? 0.7 : 1,
                                    padding: 10,
                                    backgroundColor: isDark 
                                        ? 'rgba(255,255,255,0.05)' 
                                        : 'rgba(0,0,0,0.03)',
                                    borderRadius: 12,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                })}
                            >
                                <Ionicons 
                                    name="add-circle-outline" 
                                    size={22} 
                                    color={isDark 
                                        ? 'rgba(255,255,255,0.8)' 
                                        : 'rgba(0,0,0,0.8)'
                                    } 
                                />
                            </Pressable>

                            {/* Message Input */}
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                backgroundColor: isDark 
                                    ? 'rgba(255,255,255,0.05)' 
                                    : 'rgba(0,0,0,0.03)',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                minHeight: 48,
                                maxHeight: 120
                            }}>
                                <TextInput
                                    value={message}
                                    onChangeText={setMessage}
                                    placeholder="Type a message..."
                                    placeholderTextColor={isDark 
                                        ? 'rgba(255,255,255,0.4)' 
                                        : 'rgba(0,0,0,0.4)'
                                    }
                                    style={{
                                        flex: 1,
                                        color: isDark 
                                            ? 'rgba(255,255,255,0.9)' 
                                            : 'rgba(0,0,0,0.9)',
                                        fontSize: 16,
                                        maxHeight: 100,
                                        paddingVertical: 4,
                                        textAlignVertical: 'center',
                                        lineHeight: 22
                                    }}
                                    multiline
                                    maxLength={1000}
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
                                        padding: 12,  // Lebih besar
                                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                                    })}
                                >
                                    <Ionicons 
                                        name="mic-outline" 
                                        size={24}  // Sedikit lebih besar
                                        color={isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'} 
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

                {/* Attachment Menu - Pindah ke luar KeyboardAvoidingView */}
                {renderAttachmentMenu()}
            </SafeAreaView>
        </>
    );
}   