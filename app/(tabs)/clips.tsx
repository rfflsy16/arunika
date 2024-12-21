import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useKeepAwake } from "expo-keep-awake";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";

const { width, height: screenHeight } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 49;

// Tipe data
interface VideoData {
  id: string;
  uri: string;
  caption: string;
  likes: string;
  comments: string;
}

// Data dummy
const reelsData: VideoData[] = [
  {
    id: "1",
    uri: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
    caption: "Test Video 🎥",
    likes: "105.2k",
    comments: "2.3k",
  },
];

// Component Video Item
const VideoItem = ({
  uri,
  index,
  activeIndex,
  isFocused,
}: {
  uri: string;
  index: number;
  activeIndex: number;
  isFocused: boolean;
}) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.staysActiveInBackground = true;
    if (index === activeIndex && isFocused) {
      player.play();
    }
  });

  return (
    <VideoView
      style={styles.video}
      player={player}
      contentFit="cover"
      nativeControls={false}
    />
  );
};

// Component Action Button
const ActionButton = ({
  icon,
  text,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text?: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon} size={26} color="white" />
    {text && <Text style={styles.actionText}>{text}</Text>}
  </TouchableOpacity>
);

export default function ClipsScreen() {
  useKeepAwake();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const videoHeight = screenHeight - TAB_BAR_HEIGHT - insets.bottom;

  const renderItem = ({ item, index }: { item: VideoData; index: number }) => (
    <View style={[styles.videoContainer, { height: videoHeight }]}>
      <VideoItem
        uri={item.uri}
        index={index}
        activeIndex={activeIndex}
        isFocused={isFocused}
      />

      <View style={styles.overlay}>
        <View style={styles.captionSection}>
          <Text style={styles.caption}>{item.caption}</Text>
        </View>

        <View style={styles.actionsSection}>
          <ActionButton icon="heart" text={item.likes} />
          <ActionButton icon="chatbubble" text={item.comments} />
          <ActionButton icon="share-social" />
        </View>
      </View>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
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
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        snapToInterval={videoHeight}
        decelerationRate="fast"
      />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push("/search")}
        >
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: "transparent",
  },
  searchButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    marginRight: 15,
  },
  videoContainer: {
    width: width,
  },
  video: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  captionSection: {
    flex: 1,
    justifyContent: "flex-end",
    paddingRight: 80,
    marginBottom: 20,
  },
  actionsSection: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  caption: {
    color: "white",
    fontSize: 16,
  },
  actionButton: {
    alignItems: "center",
    gap: 5,
  },
  actionText: {
    color: "white",
    fontSize: 14,
  },
});
