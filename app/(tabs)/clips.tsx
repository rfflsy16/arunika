import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from 'expo-av';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import { ResizeMode } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import { router } from "expo-router";

const { width, height: screenHeight } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 49; 

// Data dummy utk reels
const reelsData = [
    {
        id: '1',
        uri: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        caption: 'Test Video 🎥',
        likes: '105.2k',
        comments: '2.3k'
    }
];

export default function ClipsScreen() {
    useKeepAwake();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();

    // Hitung tinggi video container
    const videoHeight = screenHeight - TAB_BAR_HEIGHT - insets.bottom;

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        return (
            <View style={[styles.videoContainer, { height: videoHeight }]}>
                <Video
                    source={{ uri: item.uri }}
                    style={styles.video}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={index === activeIndex && isFocused}
                    isLooping
                    isMuted={false}
                    onError={(error: unknown) => {
                        console.log("Error loading video:", error);
                    }}
                    onLoadStart={() => {
                        console.log("Video mulai loading");
                    }}
                    onLoad={() => {
                        console.log("Video berhasil load");
                    }}
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
                // vertical
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
                    <Ionicons name="search" size={20} color="#fff" onPress={() => router.push('/search')}/>
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
