import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  Share,
  TextInput,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, { FadeIn } from "react-native-reanimated";

const DUMMY_STORIES = [
  {
    id: 1,
    username: "jessica.w",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    hasStory: true,
  },
  {
    id: 2,
    username: "david_kim",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    hasStory: true,
  },
  {
    id: 3,
    username: "sarah.smith",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    hasStory: true,
  },
  {
    id: 4,
    username: "alex_photo",
    avatar:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
    hasStory: true,
  },
  {
    id: 5,
    username: "linda.dev",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    hasStory: true,
  },
];

const DUMMY_POSTS = [
  {
    id: 1,
    username: "jessica.w",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    content:
      "Hari ini ngoding sambil nongkrong di cafe baru! ☕️ Workation emang the best sih. Ada yg mau join? #CodingLife #WorkationVibes",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    likes: 234,
    comments: 45,
    timeAgo: "20 menit yang lalu",
    reactions: {
      like: 156,
      love: 48,
      haha: 20,
      wow: 10,
    },
  },
  {
    id: 2,
    username: "david_kim",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    content:
      "Baru selesai meeting sama client! Project baru ini bakal seru nih guys 🚀 Btw ini view dari office kita, keren kan? #OfficeViews #StartupLife",
    image:
      "https://images.pexels.com/photos/7070/space-desk-workspace-coworking.jpg",
    likes: 567,
    comments: 89,
    timeAgo: "1 jam yang lalu",
    reactions: {
      like: 300,
      love: 167,
      haha: 50,
      wow: 50,
    },
  },
  {
    id: 3,
    username: "sarah.smith",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    content:
      "Weekend kemarin ikut tech conference! Ketemu banyak developer keren, sharing2 teknologi baru. Sampe skrg msh excited bgt pengen implement semua yg dipelajari 😆 #TechConference #DeveloperLife",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
    likes: 789,
    comments: 123,
    timeAgo: "3 jam yang lalu",
    reactions: {
      like: 400,
      love: 289,
      haha: 50,
      wow: 50,
    },
  },
  {
    id: 4,
    username: "alex_photo",
    avatar:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
    content:
      "Setup WFH baru nih! Akhirnya kesampaian juga bikin workspace yg nyaman. Productivity📈📈📈",
    image: "https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg",
    likes: 432,
    comments: 67,
    timeAgo: "5 jam yang lalu",
    reactions: {
      like: 250,
      love: 132,
      haha: 30,
      wow: 20,
    },
  },
];

export default function Arunika() {
  const { isDark } = useTheme();
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const arunikaColor = isDark ? "#FFD700" : "#FFA500";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#121212" : "#f5f5f5",
    },
    storiesSection: {
      backgroundColor: isDark ? "#1E1E1E" : "#fff",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#333" : "#eee",
    },
    storiesScrollView: {
      paddingHorizontal: 16,
    },
    storyContainer: {
      marginRight: 16,
      alignItems: "center",
    },
    storyCircle: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 2,
      borderColor: arunikaColor,
      padding: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    storyAvatar: {
      width: "100%",
      height: "100%",
      borderRadius: 30,
    },
    storyUsername: {
      fontSize: 12,
      marginTop: 4,
      color: isDark ? "#999" : "#666",
      textAlign: "center",
    },
    postsSection: {
      paddingVertical: 8,
    },
    postCard: {
      backgroundColor: isDark ? "#1E1E1E" : "#fff",
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 20,
      overflow: "hidden",
      ...Platform.select({
        android: {
          elevation: 4,
        },
        ios: {
          shadowColor: isDark ? "#000" : "#666",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      }),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
          >
            {DUMMY_STORIES.map((story) => (
              <TouchableOpacity
                key={story.id}
                onPress={() => setActiveStory(story.id)}
                style={styles.storyContainer}
              >
                <LinearGradient
                  colors={
                    story.hasStory
                      ? [arunikaColor, "#FF6B6B"]
                      : ["#ccc", "#999"]
                  }
                  style={styles.storyCircle}
                >
                  <Image
                    source={{ uri: story.avatar }}
                    style={styles.storyAvatar}
                  />
                </LinearGradient>
                <Text style={styles.storyUsername}>{story.username}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts Section */}
        <View style={styles.postsSection}>
          {DUMMY_POSTS.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isDark={isDark}
              arunikaColor={arunikaColor}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface PostCardProps {
  post: {
    id: number;
    username: string;
    avatar: string;
    content: string;
    image: string;
    likes: number;
    comments: number;
    timeAgo: string;
    reactions: {
      like: number;
      love: number;
      haha: number;
      wow: number;
    };
  };
  isDark: boolean;
  arunikaColor: string;
}

const PostCard = ({ post, isDark, arunikaColor }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { width } = Dimensions.get("window");

  const handleShare = async () => {
    try {
      await Share.share({
        message: post.content,
        url: post.image,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const styles = StyleSheet.create({
    postCard: {
      backgroundColor: isDark ? "#1E1E1E" : "#fff",
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 20,
      overflow: "hidden",
      ...Platform.select({
        android: {
          elevation: 4,
        },
        ios: {
          shadowColor: isDark ? "#000" : "#666",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      }),
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    userInfo: {
      marginLeft: 12,
      flex: 1,
    },
    username: {
      fontSize: 15,
      fontWeight: "600",
      color: isDark ? "#fff" : "#000",
    },
    timeAgo: {
      fontSize: 12,
      color: isDark ? "#999" : "#666",
    },
    content: {
      padding: 16,
      fontSize: 14,
      color: isDark ? "#fff" : "#000",
      lineHeight: 20,
    },
    image: {
      width: width - 32,
      height: 300,
      marginHorizontal: 16,
      borderRadius: 12,
    },
    actionContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    statsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    likesCount: {
      fontSize: 14,
      color: isDark ? "#fff" : "#000",
      marginRight: 16,
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 0.5,
      borderTopColor: isDark ? "#333" : "#eee",
      paddingTop: 12,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: isDark ? "#333" : "#f5f5f5",
    },
    actionText: {
      marginLeft: 6,
      fontSize: 14,
      color: isDark ? "#fff" : "#000",
    },
    commentSection: {
      backgroundColor: isDark ? "#1A1A1A" : "#f8f8f8",
      borderTopWidth: 0.5,
      borderTopColor: isDark ? "#333" : "#eee",
      padding: 16,
    },
    commentHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    commentTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#fff" : "#000",
    },
    commentInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#333" : "#fff",
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 8,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    input: {
      flex: 1,
      marginLeft: 8,
      color: isDark ? "#fff" : "#000",
      fontSize: 14,
    },
    sendButton: {
      padding: 8,
    },
  });

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} />
      )}

      <View style={styles.actionContainer}>
        <View style={styles.statsRow}>
          <Text style={styles.likesCount}>
            {isLiked ? post.likes + 1 : post.likes} likes
          </Text>
          <Text style={styles.likesCount}>{post.comments} comments</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isLiked && { backgroundColor: "#ffebee" },
            ]}
            onPress={() => setIsLiked(!isLiked)}
          >
            <MaterialCommunityIcons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? arunikaColor : isDark ? "#fff" : "#000"}
            />
            <Text
              style={[styles.actionText, isLiked && { color: arunikaColor }]}
            >
              Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowComments(!showComments)}
          >
            <MaterialCommunityIcons
              name="comment-outline"
              size={22}
              color={isDark ? "#fff" : "#000"}
            />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <MaterialCommunityIcons
              name="share-outline"
              size={22}
              color={isDark ? "#fff" : "#000"}
            />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showComments && (
        <View style={styles.commentSection}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentTitle}>Comments</Text>
          </View>

          <View style={styles.commentInputContainer}>
            <MaterialCommunityIcons
              name="emoticon-outline"
              size={24}
              color={isDark ? "#999" : "#666"}
            />
            <TextInput
              placeholder="Write a comment..."
              placeholderTextColor={isDark ? "#999" : "#666"}
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton}>
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={arunikaColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};
