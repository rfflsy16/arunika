import { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    Pressable, 
    Dimensions,
    ScrollView,
    StyleSheet,
    Platform,
    Image
} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Location from 'expo-location';
import { useTheme } from '@/context/ThemeContext';

// Dummy data spots
const SPOTS = [
    {
        id: '1',
        title: 'Budi Santoso',
        description: 'Lagi nongkrong di mall nih! 🛍️',
        rating: '5 menit lalu',
        reviews: 0,
        profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
        coordinate: {
            latitude: -6.2088,
            longitude: 106.8456
        }
    },
    {
        id: '2',
        title: 'Sarah Amelia',
        description: 'Ngopi dulu gaes di Starbucks ☕',
        rating: '15 menit lalu',
        reviews: 0,
        profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
        coordinate: {
            latitude: -6.2100,
            longitude: 106.8476
        }
    },
    {
        id: '3',
        title: 'Reza Prakasa',
        description: 'Lagi meeting di kantor nich 💼',
        rating: '1 jam lalu',
        reviews: 0,
        profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
        coordinate: {
            latitude: -6.2150,
            longitude: 106.8234
        }
    },
    {
        id: '4',
        title: 'Diana Putri',
        description: 'Gym time! 💪 Semangat!',
        rating: '30 menit lalu',
        reviews: 0,
        profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
        coordinate: {
            latitude: -6.1988,
            longitude: 106.8156
        }
    },
    {
        id: '5',
        title: 'Andi Wijaya',
        description: 'Makan siang di Padang, ada yg mau join? 🍱',
        rating: '2 menit lalu',
        reviews: 0,
        profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
        coordinate: {
            latitude: -6.1920,
            longitude: 106.8220
        }
    },
    {
        id: '6',
        title: 'Maya Sari',
        description: 'Car free day nih! Lari pagi 🏃‍♀️',
        rating: '45 menit lalu',
        reviews: 0,
        profilePic: 'https://randomuser.me/api/portraits/women/6.jpg',
        coordinate: {
            latitude: -6.2050,
            longitude: 106.8300
        }
    }
];

const { width } = Dimensions.get('window');

export default function SpotScreen() {
    const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
    const [showMap, setShowMap] = useState(true);
    
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const { isDark } = useTheme();
    const tintColor = Colors[useColorScheme() ?? 'light'].tint;

    useEffect(() => {
        setShowMap(false);
        const timer = setTimeout(() => {
            setShowMap(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, [isDark]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied');
                return;
            }

            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 1
                },
                (location) => {
                    setCurrentLocation(location);
                }
            );

            return () => {
                if (locationSubscription) {
                    locationSubscription.remove();
                }
            };
        })();
    }, []);

    const handleSpotPress = (spotId: string) => {
        const spot = SPOTS.find(s => s.id === spotId);
        if (spot && mapRef.current) {
            setSelectedSpot(spotId);
            mapRef.current.animateToRegion({
                latitude: spot.coordinate.latitude,
                longitude: spot.coordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }, 1000);
        }
    };

    const goToMyLocation = () => {
        if (currentLocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            {showMap && (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    userInterfaceStyle={isDark ? 'dark' : 'light'}
                    initialRegion={{
                        latitude: -6.2088,
                        longitude: 106.8456,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02
                    }}
                >
                    {currentLocation && (
                        <Marker
                            coordinate={{
                                latitude: currentLocation.coords.latitude,
                                longitude: currentLocation.coords.longitude
                            }}
                        >
                            <View style={styles.currentLocationMarker}>
                                <View style={styles.currentLocationDot} />
                                <View style={styles.currentLocationRing} />
                            </View>
                        </Marker>
                    )}

                    {SPOTS.map(spot => (
                        <Marker
                            key={spot.id}
                            coordinate={spot.coordinate}
                            onPress={() => handleSpotPress(spot.id)}
                        >
                            <View style={styles.markerContainer}>
                                <Image 
                                    source={{ uri: spot.profilePic }}
                                    style={styles.markerImage}
                                />
                            </View>
                        </Marker>
                    ))}
                </MapView>
            )}

            {/* My Location Button */}
            <Pressable 
                onPress={goToMyLocation}
                style={({ pressed }) => ([
                    styles.myLocationButton,
                    { 
                        opacity: pressed ? 0.8 : 1,
                        backgroundColor: isDark ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)'
                    }
                ])}
            >
                <Ionicons 
                    name="navigate-sharp" 
                    size={22} 
                    color={tintColor}
                />
            </Pressable>

            {/* Bottom Sheet */}
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 16 }}
                style={{
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 100 : 80,
                    left: 0,
                    right: 0,
                }}
            >
                {SPOTS.map(spot => (
                    <Pressable
                        key={spot.id}
                        onPress={() => handleSpotPress(spot.id)}
                        style={({ pressed }) => ({
                            width: width * 0.7,
                            marginRight: 16,
                            padding: 16,
                            backgroundColor: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)',
                            borderRadius: 16,
                            borderWidth: 1.5,
                            borderColor: selectedSpot === spot.id ? tintColor : 'transparent',
                            opacity: pressed ? 0.9 : 1,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        })}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image 
                                source={{ uri: spot.profilePic }}
                                style={styles.cardImage}
                            />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={{ 
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: textColor
                                }}>
                                    {spot.title}
                                </Text>
                                <Text style={{ 
                                    fontSize: 13,
                                    color: textColor,
                                    opacity: 0.5
                                }}>
                                    {spot.rating}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ 
                            fontSize: 14,
                            color: textColor,
                            opacity: 0.7,
                            marginTop: 8
                        }}>
                            {spot.description}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        padding: 2,
        borderWidth: 2,
        borderColor: Colors.light.tint
    },
    markerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 18
    },
    cardImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    currentLocationMarker: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    currentLocationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2D86FF',
        borderWidth: 2,
        borderColor: 'white'
    },
    currentLocationRing: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#2D86FF40'
    },
    myLocationButton: {
        position: 'absolute',
        right: 16,
        bottom: Platform.OS === 'ios' ? 280 : 260,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 12,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 999,
    },
});
