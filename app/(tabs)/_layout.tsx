import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, View } from 'react-native';

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    const arunikaColor = isDark ? '#FFD700' : '#FFA500';
    const bgColor = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarStyle: {
                    ...Platform.select({
                        ios: {
                            position: 'absolute',
                            backgroundColor: bgColor,
                            backdropFilter: 'blur(10px)',
                            height: 85,
                            paddingBottom: 25
                        },
                        android: {
                            backgroundColor: Colors[colorScheme ?? 'light'].background,
                            height: 85,
                            paddingBottom: 25
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
                name="spot"
                options={{
                    title: 'Spot',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="location" size={size} color={color} />
                    ),
                }}
            />
            {/* <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            /> */}
            <Tabs.Screen
                name="arunika"
                options={{
                    title: 'Arunika',
                    tabBarIcon: ({ size }) => (
                        <View style={{
                            position: 'absolute',
                            bottom: 10,
                            width: 42,
                            height: 42,
                            borderRadius: 21,
                            backgroundColor: arunikaColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}>
                            <Ionicons 
                                name="sparkles" 
                                size={size} 
                                color={isDark ? '#000' : '#FFF'} 
                            />
                        </View>
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{
                            fontSize: 11,
                            position: 'absolute',
                            bottom: 13,
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                            color: focused ? arunikaColor : '#888',
                            fontWeight: focused ? '600' : '400'
                        }}>
                            Arunika
                        </Text>
                    ),
                }}
            />
            {/* <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" size={size} color={color} />
                    ),
                }}
            /> */}
             <Tabs.Screen
                name='clips'
                options={{
                    title: 'Clips',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" size={size} color={color} />
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
