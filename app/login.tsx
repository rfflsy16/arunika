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

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;
    const isDark = useColorScheme() === 'dark';

    const handleLogin = () => {
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
                            Sign In
                        </Text>
                        <Text style={{ 
                            fontSize: 16,
                            color: textColor,
                            opacity: 0.7
                        }}>
                            Continue your journey with us
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View style={{ 
                        height: '75%',
                        paddingTop: 32,
                        gap: 24
                    }}>
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
                                    placeholder="Enter your password"
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

                        {/* Forgot Password */}
                        <Pressable 
                            hitSlop={8}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.7 : 1,
                                alignSelf: 'flex-end'
                            })}
                        >
                            <Text style={{ 
                                fontSize: 14,
                                color: tintColor,
                                fontWeight: '500'
                            }}>
                                Forgot Password?
                            </Text>
                        </Pressable>

                        {/* Login Button */}
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
                            onPress={handleLogin}
                        >
                            <Text style={{ 
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: '600'
                            }}>
                                Continue
                            </Text>
                        </Pressable>

                        {/* Register Link */}
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
                                New here?
                            </Text>
                            <Link href="/register" asChild>
                                <TouchableOpacity hitSlop={8}>
                                    <Text style={{ 
                                        color: tintColor,
                                        fontWeight: '500'
                                    }}>
                                        Create an account
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
