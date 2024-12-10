import { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Pressable, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    Platform,
    TouchableOpacity,
    StatusBar
} from "react-native";
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;
    const isDark = useColorScheme() === 'dark';

    const handleRegister = () => {
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={{ 
                    flex: 1,
                    paddingHorizontal: 24,
                }}>
                    {/* Header Section */}
                    <View style={{ 
                        height: '25%', 
                        justifyContent: 'flex-end',
                        paddingBottom: 32
                    }}>
                        <Text style={{ 
                            fontSize: 32,
                            fontWeight: '700',
                            color: textColor,
                            marginBottom: 8
                        }}>
                            Create Account
                        </Text>
                        <Text style={{ 
                            fontSize: 16,
                            color: textColor,
                            opacity: 0.7
                        }}>
                            Start your journey with us today
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View style={{ 
                        height: '75%',
                        paddingTop: 32,
                        gap: 24
                    }}>
                        {/* Username Input */}
                        <View>
                            <Text style={{ 
                                fontSize: 15,
                                fontWeight: '600',
                                color: textColor,
                                marginBottom: 10,
                                opacity: 0.8
                            }}>
                                Username
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1.5,
                                borderColor: username ? tintColor : isDark ? '#ffffff20' : '#00000020',
                                borderRadius: 14,
                                padding: 14,
                                backgroundColor: isDark ? '#ffffff08' : '#00000005'
                            }}>
                                <Ionicons 
                                    name="person-outline" 
                                    size={20} 
                                    color={username ? tintColor : isDark ? '#ffffff80' : '#00000080'} 
                                    style={{ marginRight: 10 }}
                                />
                                <TextInput 
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Choose a username"
                                    placeholderTextColor={isDark ? '#ffffff50' : '#00000050'}
                                    style={{
                                        flex: 1,
                                        fontSize: 16,
                                        color: textColor,
                                        height: 24
                                    }}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View>
                            <Text style={{ 
                                fontSize: 15,
                                fontWeight: '600',
                                color: textColor,
                                marginBottom: 10,
                                opacity: 0.8
                            }}>
                                Email Address
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1.5,
                                borderColor: email ? tintColor : isDark ? '#ffffff20' : '#00000020',
                                borderRadius: 14,
                                padding: 14,
                                backgroundColor: isDark ? '#ffffff08' : '#00000005'
                            }}>
                                <Ionicons 
                                    name="mail-outline" 
                                    size={20} 
                                    color={email ? tintColor : isDark ? '#ffffff80' : '#00000080'} 
                                    style={{ marginRight: 10 }}
                                />
                                <TextInput 
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                    placeholderTextColor={isDark ? '#ffffff50' : '#00000050'}
                                    style={{
                                        flex: 1,
                                        fontSize: 16,
                                        color: textColor,
                                        height: 24
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text style={{ 
                                fontSize: 15,
                                fontWeight: '600',
                                color: textColor,
                                marginBottom: 10,
                                opacity: 0.8
                            }}>
                                Password
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1.5,
                                borderColor: password ? tintColor : isDark ? '#ffffff20' : '#00000020',
                                borderRadius: 14,
                                padding: 14,
                                backgroundColor: isDark ? '#ffffff08' : '#00000005'
                            }}>
                                <Ionicons 
                                    name="lock-closed-outline" 
                                    size={20} 
                                    color={password ? tintColor : isDark ? '#ffffff80' : '#00000080'} 
                                    style={{ marginRight: 10 }}
                                />
                                <TextInput 
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Create a password"
                                    placeholderTextColor={isDark ? '#ffffff50' : '#00000050'}
                                    secureTextEntry={!showPassword}
                                    style={{
                                        flex: 1,
                                        fontSize: 16,
                                        color: textColor,
                                        height: 24
                                    }}
                                />
                                <Pressable 
                                    onPress={() => setShowPassword(!showPassword)}
                                    hitSlop={8}
                                >
                                    <Ionicons 
                                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={20} 
                                        color={isDark ? '#ffffff60' : '#00000060'} 
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {/* Register Button */}
                        <Pressable 
                            style={({ pressed }) => ({
                                backgroundColor: isDark 
                                    ? pressed ? '#ffffff15' : '#ffffff10'
                                    : pressed ? tintColor + '90' : tintColor,
                                padding: 16,
                                borderRadius: 14,
                                alignItems: 'center',
                                marginTop: 8,
                                borderWidth: isDark ? 1 : 0,
                                borderColor: '#ffffff20'
                            })}
                            onPress={handleRegister}
                        >
                            <Text style={{ 
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: '600'
                            }}>
                                Create Account
                            </Text>
                        </Pressable>

                        {/* Login Link */}
                        <View style={{ 
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 4,
                            marginTop: 8
                        }}>
                            <Text style={{ 
                                color: textColor,
                                opacity: 0.7
                            }}>
                                Already have an account?
                            </Text>
                            <Link href="/login" asChild>
                                <TouchableOpacity hitSlop={8}>
                                    <Text style={{ 
                                        color: tintColor,
                                        fontWeight: '500'
                                    }}>
                                        Sign In
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
