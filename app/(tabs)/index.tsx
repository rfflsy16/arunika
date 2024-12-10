import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    TextInput, 
    FlatList, 
    Image, 
    Pressable, 
    Animated,
    Dimensions,
    Easing
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Dummy data utk chat list
const CHATS = [
    {
        id: '1',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        lastMessage: 'Hey, how are you doing?',
        time: '2m ago',
        unread: 2,
        online: true
    },
    {
        id: '2',
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
        lastMessage: 'The project looks amazing! 🎉',
        time: '5m ago',
        unread: 0,
        online: true
    },
    {
        id: '3',
        name: 'Jessica Parker',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        lastMessage: 'Let me check and get back to you',
        time: '1h ago',
        unread: 1,
        online: false
    },
    // ... tambah dummy data lain sesuai kebutuhan
];

const NOTIFICATIONS = [
    {
        id: '1',
        title: 'New Message',
        description: 'You have a new message from Sarah Wilson',
        time: '2m ago'
    },
    {
        id: '2',
        title: 'Project Update',
        description: 'Alex Thompson commented on your project',
        time: '5m ago'
    },
    // ... tambah dummy data lain sesuai kebutuhan
];

type ChatItemProps = {
    item: typeof CHATS[0];
    onPress: () => void;
};

function ChatItem({ item, onPress }: ChatItemProps) {
    const textColor = useThemeColor({}, 'text');
    const isDark = useColorScheme() === 'dark';
    
    return (
        <Pressable 
            onPress={onPress}
            style={({ pressed }) => ({
                flexDirection: 'row',
                padding: 16,
                backgroundColor: pressed ? (isDark ? '#ffffff10' : '#00000005') : 'transparent',
                borderRadius: 16,
                marginHorizontal: 16,
                marginVertical: 4,
                alignItems: 'center'
            })}
        >
            {/* Avatar & Online Status */}
            <View style={{ position: 'relative' }}>
                <Image 
                    source={{ uri: item.avatar }}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: isDark ? '#ffffff20' : '#00000010'
                    }}
                />
                {item.online && (
                    <View style={{
                        position: 'absolute',
                        right: 2,
                        bottom: 2,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#4CAF50',
                        borderWidth: 2,
                        borderColor: isDark ? '#151718' : '#fff'
                    }} />
                )}
            </View>

            {/* Chat Info */}
            <View style={{ 
                flex: 1,
                marginLeft: 12
            }}>
                <View style={{ 
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4
                }}>
                    <Text style={{ 
                        fontSize: 16,
                        fontWeight: '600',
                        color: textColor
                    }}>
                        {item.name}
                    </Text>
                    <Text style={{ 
                        fontSize: 12,
                        color: textColor,
                        opacity: 0.5
                    }}>
                        {item.time}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text 
                        numberOfLines={1}
                        style={{ 
                            flex: 1,
                            fontSize: 14,
                            color: textColor,
                            opacity: 0.7
                        }}
                    >
                        {item.lastMessage}
                    </Text>
                    {item.unread > 0 && (
                        <View style={{
                            minWidth: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: Colors[useColorScheme() ?? 'light'].tint,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 8,
                            paddingHorizontal: 6
                        }}>
                            <Text style={{ 
                                fontSize: 12,
                                color: '#fff',
                                fontWeight: '600'
                            }}>
                                {item.unread}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
}

function NotificationItem({ item }: { item: typeof NOTIFICATIONS[0] }) {
    const textColor = useThemeColor({}, 'text');
    
    return (
        <View style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: textColor + '20'
        }}>
            <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: textColor 
            }}>
                {item.title}
            </Text>
            <Text style={{ 
                fontSize: 14, 
                color: textColor, 
                opacity: 0.7, 
                marginVertical: 4 
            }}>
                {item.description}
            </Text>
            <Text style={{ 
                fontSize: 12, 
                color: textColor, 
                opacity: 0.5 
            }}>
                {item.time}
            </Text>
        </View>
    );
}

export default function ChatScreen() {
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [notificationBtnLayout, setNotificationBtnLayout] = useState({ x: 0, y: 0 });
    const animatedValue = useRef(new Animated.Value(0)).current;
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const isDark = useColorScheme() === 'dark';
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;

    const showModal = () => {
        setModalVisible(true);
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 40,
            friction: 6,
            velocity: 1
        }).start();
    };

    const hideModal = () => {
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 5,
            velocity: -1
        }).start(() => setModalVisible(false));
    };

    const modalScale = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.1, 0.7, 1]
    });

    const modalTranslateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-notificationBtnLayout.y + 40, 0]
    });

    const modalTranslateX = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [80, 30, 0]
    });

    const modalRotateX = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['45deg', '10deg', '0deg']
    });

    const modalRotateY = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['-45deg', '-10deg', '0deg']
    });

    const modalSkewX = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['10deg', '5deg', '0deg']
    });

    const modalOpacity = animatedValue.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0, 0.8, 1]
    });

    const overlayOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5]
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            {/* Header */}
            <View style={{ 
                padding: 16,
                paddingBottom: 0
            }}>
                {/* Title & Notification Button */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16
                }}>
                    <Text style={{ 
                        fontSize: 28,
                        fontWeight: '700',
                        color: textColor,
                    }}>
                        Messages
                    </Text>
                    
                    {/* Notification Button */}
                    <Pressable 
                        onPress={() => {
                            showModal();
                        }}
                        onLayout={(event) => {
                            event.target.measure((x, y, width, height, pageX, pageY) => {
                                setNotificationBtnLayout({ x: pageX, y: pageY });
                            });
                        }}
                        style={({ pressed }) => ({
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: pressed 
                                ? (isDark ? '#ffffff15' : '#00000010')
                                : (isDark ? '#ffffff10' : '#00000008'),
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        })}
                    >
                        <Ionicons 
                            name="notifications-outline" 
                            size={22} 
                            color={textColor} 
                        />
                        
                        {/* Notification Badge */}
                        <View style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: tintColor,
                            borderWidth: 1.5,
                            borderColor: backgroundColor
                        }} />
                    </Pressable>
                </View>

                {/* Search Bar */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isDark ? '#ffffff10' : '#00000008',
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 8
                }}>
                    <Ionicons 
                        name="search-outline" 
                        size={20} 
                        color={textColor + '80'} 
                        style={{ marginRight: 8 }}
                    />
                    <TextInput 
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search messages..."
                        placeholderTextColor={textColor + '60'}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            color: textColor,
                            height: 24
                        }}
                    />
                </View>
            </View>

            {/* Chat List */}
            <FlatList
                data={CHATS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ChatItem 
                        item={item} 
                        onPress={() => console.log('Chat pressed:', item.name)}
                    />
                )}
                contentContainerStyle={{ paddingVertical: 8 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Notification Modal */}
            {modalVisible && (
                <>
                    <Animated.View 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#000',
                            opacity: overlayOpacity
                        }}
                    />
                    <Pressable 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'flex-start'
                        }}
                        onPress={hideModal}
                    >
                        <Animated.View 
                            style={{
                                position: 'absolute',
                                top: notificationBtnLayout.y + 50,
                                right: 20,
                                width: 300,
                                backgroundColor: backgroundColor,
                                borderRadius: 20,
                                padding: 16,
                                shadowColor: '#000',
                                shadowOffset: { width: -5, height: 5 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                                opacity: modalOpacity,
                                transform: [
                                    { scale: modalScale },
                                    { translateY: modalTranslateY },
                                    { translateX: modalTranslateX },
                                    { rotateX: modalRotateX },
                                    { rotateY: modalRotateY },
                                    { skewX: modalSkewX }
                                ]
                            }}
                        >
                            <View style={{
                                position: 'absolute',
                                top: -10,
                                right: 20,
                                width: 20,
                                height: 20,
                                backgroundColor: backgroundColor,
                                transform: [{ rotate: '45deg' }],
                                shadowColor: '#000',
                                shadowOffset: { width: -2, height: -2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 2
                            }} />
                            
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: textColor,
                                marginBottom: 16
                            }}>
                                Notifications
                            </Text>
                            
                            <FlatList
                                data={NOTIFICATIONS}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <NotificationItem item={item} />}
                                style={{ 
                                    width: '100%',
                                    maxHeight: 400 
                                }}
                                showsVerticalScrollIndicator={false}
                            />
                        </Animated.View>
                    </Pressable>
                </>
            )}
        </SafeAreaView>
    );
}
