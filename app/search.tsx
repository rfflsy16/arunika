import { View, Text, TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export default function SearchScreen() {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;
    const isDark = useColorScheme() === 'dark';

    return (
        <View style={{ flex: 1, backgroundColor }}>
            <Text>Search Screen</Text>
        </View>
    );  
}