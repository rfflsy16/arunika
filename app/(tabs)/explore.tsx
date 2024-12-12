import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height: screenHeight } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 49; // Default iOS tab bar height

// Data dummy utk reels
const reelsData = [
    {
        id: '1',
        uri: 'https://assets.mixkit.co/videos/preview/mixkit-drifting-car-during-a-race-753-large.mp4',
        caption: 'Drift king in action 🏎️💨',
        likes: '45.2k',
        comments: '2.3k'
    },
    {
        id: '2',
        uri: 'https://assets.mixkit.co/videos/preview/mixkit-race-car-drifting-around-a-corner-753-large.mp4',
        caption: 'Perfect angle drift 🔥',
        likes: '32.1k',
        comments: '1.8k'
    },
    {
        id: '3',
        uri: 'https://assets.mixkit.co/videos/preview/mixkit-professional-racing-car-drifting-1184-large.mp4',
        caption: 'Smoke show 💨',
        likes: '28.9k',
        comments: '1.5k'
    },
    {
        id: '4',
        uri: 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-drifting-at-sunset-34537-large.mp4',
        caption: 'Sunset drift vibes 🌅',
        likes: '50.3k',
        comments: '3.1k'
    },
    {
        id: '5',
        uri: 'https://assets.mixkit.co/videos/preview/mixkit-race-car-burning-rubber-752-large.mp4',
        caption: 'Burning rubber 🔥🏎️',
        likes: '38.7k',
        comments: '2.4k'
    },
    {
        id: '6',
        uri: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-road-curved-hills-35898-large.mp4',
        caption: 'Mountain pass touge 🗻',
        likes: '42.5k',
        comments: '2.8k'
    },
    {
        id: '7',
        uri: 'https://assets.mixkit.co/videos/preview/mixkit-red-sports-car-driving-fast-around-a-corner-34544-large.mp4',
        caption: 'Red beast drifting 🚗💨',
        likes: '35.9k',
        comments: '2.1k'
    },
    {
        id: '8',
        uri: 'https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-city-at-night-1740-large.mp4',
        caption: 'Night city drift 🌃',
        likes: '47.8k',
        comments: '3.3k'
    }
];

export default function ExploreScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    const insets = useSafeAreaInsets();

    // Hitung tinggi video container
    const videoHeight = screenHeight - TAB_BAR_HEIGHT - insets.bottom;

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        return (
            <View style={[styles.videoContainer, { height: videoHeight }]}>
                <Video
                    source={{ uri: item.uri }}
                    style={styles.video}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={index === activeIndex}
                    isLooping
                    isMuted={false}
                />
                
                <View style={styles.overlay}>
                    <View style={styles.captionSection}>
                        <Text style={styles.caption}>{item.caption}</Text>
                    </View>

                    <View style={styles.actionsSection}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="heart" size={28} color="white" />
                            <Text style={styles.actionText}>{item.likes}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble" size={26} color="white" />
                            <Text style={styles.actionText}>{item.comments}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="share-social" size={26} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
        if (viewableItems[0] != null) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={styles.mainContainer}>
            <FlatList
                ref={flatListRef}
                data={reelsData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                vertical
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50
                }}
                snapToInterval={videoHeight}
                decelerationRate="fast"
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: 'transparent'
    },
    searchButton: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 50,
        marginTop: 10,
        marginRight: 15
    },
    videoContainer: {
        width: width,
    },
    video: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    captionSection: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingRight: 80,
        marginBottom: 20
    },
    actionsSection: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20
    },
    caption: {
        color: 'white',
        fontSize: 16
    },
    actionButton: {
        alignItems: 'center',
        gap: 5
    },
    actionText: {
        color: 'white',
        fontSize: 14
    }
});
