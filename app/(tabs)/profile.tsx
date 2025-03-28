import { View, Text, Image, ScrollView, Pressable, SafeAreaView, Switch } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useDarkMode } from '@/hooks/useDarkMode';

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description?: string;
    onPress?: () => void;
    showArrow?: boolean;
    isDanger?: boolean;
    isSwitch?: boolean;
    value?: boolean;
}

function MenuItem({ 
    icon, 
    label, 
    description, 
    onPress, 
    showArrow = true, 
    isDanger = false,
    isSwitch = false,
    value
}: MenuItemProps) {
    const textColor = useThemeColor({}, 'text');
    const iconColor = useThemeColor({}, 'icon');
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;
    
    return (
        <Pressable 
            onPress={!isSwitch ? onPress : undefined}
            style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: pressed ? 'rgba(150,150,150,0.1)' : 'transparent',
                marginHorizontal: 16,
                marginVertical: 4,
                borderRadius: 16
            })}>
            <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: isDanger ? 'rgba(255,68,68,0.1)' : 'rgba(10,126,164,0.1)',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Ionicons 
                    name={icon} 
                    size={20} 
                    color={isDanger ? '#ff4444' : Colors[useColorScheme() ?? 'light'].tint} 
                />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ 
                    fontSize: 16,
                    fontWeight: '500',
                    color: isDanger ? '#ff4444' : textColor
                }}>
                    {label}
                </Text>
                {description && (
                    <Text style={{ 
                        fontSize: 13,
                        color: textColor,
                        opacity: 0.6,
                        marginTop: 2
                    }}>
                        {description}
                    </Text>
                )}
            </View>
            {isSwitch ? (
                <Switch 
                    value={value}
                    onValueChange={onPress}
                    trackColor={{ 
                        false: '#767577', 
                        true: `${tintColor}80` 
                    }}
                    thumbColor={value ? tintColor : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                />
            ) : showArrow && (
                <Ionicons name="chevron-forward" size={20} color={iconColor} />
            )}
        </Pressable>
    );
}

export default function ProfileScreen() {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;
    const { isDark, toggleTheme } = useDarkMode();

    const handleLogout = () => {
        console.log('Logging out...');
        
        router.replace('/login');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <ScrollView style={{ flex: 1 }}>
                {/* Profile Header */}
                <View style={{ padding: 24, alignItems: 'center' }}>
                    <View style={{
                        padding: 3,
                        borderRadius: 60,
                        backgroundColor: tintColor,
                        marginBottom: 16
                    }}>
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500' }}
                            style={{ 
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                borderWidth: 4,
                                borderColor: backgroundColor
                            }}
                        />
                    </View>
                    <Text style={{ 
                        fontSize: 24, 
                        fontWeight: '700', 
                        color: textColor,
                        marginBottom: 4
                    }}>Arunika AI</Text>
                    <Text style={{ 
                        color: textColor, 
                        opacity: 0.7,
                        fontSize: 15
                    }}>arunika@ai.com</Text>
                </View>

                {/* Account Settings */}
                <View style={{ marginTop: 12 }}>
                    <Text style={{ 
                        fontSize: 14,
                        fontWeight: '600',
                        color: textColor,
                        opacity: 0.7,
                        marginLeft: 24,
                        marginBottom: 8,
                        textTransform: 'uppercase'
                    }}>Account</Text>
                    <MenuItem 
                        icon="person" 
                        label="Edit Profile" 
                        description="Change your profile information"
                    />
                    <MenuItem 
                        icon="settings-sharp" 
                        label="Settings" 
                        description="App preferences and more"
                    />
                </View>

                {/* App Settings */}
                <View style={{ marginTop: 24 }}>
                    <Text style={{ 
                        fontSize: 14,
                        fontWeight: '600',
                        color: textColor,
                        opacity: 0.7,
                        marginLeft: 24,
                        marginBottom: 8,
                        textTransform: 'uppercase'
                    }}>Preferences</Text>
                    <MenuItem 
                        icon={isDark ? "moon" : "sunny"} 
                        label="Dark Mode"
                        description="Ubah tampilan ke mode gelap"
                        isSwitch={true}
                        value={isDark}
                        onPress={toggleTheme}
                    />
                    <MenuItem 
                        icon="notifications" 
                        label="Notifications" 
                        description="Manage your notifications"
                    />
                    <MenuItem 
                        icon="lock-closed" 
                        label="Privacy" 
                        description="Control your privacy settings"
                    />
                    <MenuItem 
                        icon="shield" 
                        label="Security" 
                        description="Protect your account"
                    />
                </View>

                {/* About Section */}
                <View style={{ marginTop: 24 }}>
                    <Text style={{ 
                        fontSize: 14,
                        fontWeight: '600',
                        color: textColor,
                        opacity: 0.7,
                        marginLeft: 24,
                        marginBottom: 8,
                        textTransform: 'uppercase'
                    }}>About</Text>
                    <MenuItem 
                        icon="information-circle" 
                        label="About" 
                        description="Learn more about us"
                    />
                    <MenuItem 
                        icon="document-text" 
                        label="Terms of Service" 
                        description="Read our terms"
                    />
                    <MenuItem 
                        icon="shield-checkmark" 
                        label="Privacy Policy" 
                        description="How we handle your data"
                    />
                    <MenuItem 
                        icon="help-circle" 
                        label="Help Center" 
                        description="Get support"
                    />
                </View>

                {/* Logout */}
                <View style={{ 
                    marginTop: 24, 
                    marginBottom: Platform.OS === 'ios' ? 50 : 40 
                }}>
                    <MenuItem 
                        icon="log-out" 
                        label="Logout" 
                        description="Sign out from your account"
                        showArrow={false}
                        isDanger={true}
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
