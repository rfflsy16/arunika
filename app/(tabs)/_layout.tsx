import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarStyle: {
                    ...Platform.select({
                        ios: {
                            position: 'absolute',
                            backgroundColor: isDark 
                                ? 'rgba(21,23,24,0.8)' 
                                : 'rgba(255,255,255,0.8)',
                            backdropFilter: 'blur(10px)',
                        },
                        android: {
                            backgroundColor: Colors[colorScheme ?? 'light'].background,
                        },
                    }),
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubble" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="spot"
                options={{
                    title: 'Spot',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="location" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
