import { useState } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    TextInput, 
    FlatList, 
    Image, 
    Pressable 
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

export default function ChatScreen() {
    const [search, setSearch] = useState('');
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const isDark = useColorScheme() === 'dark';
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;

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
                        onPress={() => console.log('Notification pressed')}
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
        </SafeAreaView>
    );
}
