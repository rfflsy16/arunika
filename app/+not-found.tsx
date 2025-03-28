import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function NotFoundScreen() {
    const colorScheme = useColorScheme();
    const textColor = { color: Colors[colorScheme ?? 'light'].text };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, textColor]}>
                Waduh! Halaman Ga Ketemu Nih 🤔
            </Text>
            <Link href="/" style={styles.link}>
                <Text style={[styles.linkText, textColor]}>
                    Balik ke Home yuk! 🏠
                </Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
