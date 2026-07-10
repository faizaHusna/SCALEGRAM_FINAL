// FILE: src/presentation/components/PostCard.tsx (FIXED - ROBUST MEMOIZATION & STABLE GESTURES)
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Shadows } from "@/core/theme/shadows";
import { Post } from "@/domain/entities/Post";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { Menu } from 'react-native-paper';

interface Props {
  post: Post;
  currentUserId?: string;
  onLikeToggle?: (postId: string) => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
}

export const POST_CARD_HEIGHT = 480;

function PostCardComponent({ post, currentUserId, onLikeToggle, onCommentPress, onSharePress }: Props) {
  if (!post) return null;

  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);

  // 1. Local State dengan inisialisasi yang aman
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const [likesCountLocal, setLikesCountLocal] = useState(0);
  const [isSavedLocal, setIsSavedLocal] = useState(false);
  const [visible, setVisible] = useState(false);

  // 2. Sinkronisasi data dari properti post secara aman
  useEffect(() => {
    const isLiked = !!(currentUserId && Array.isArray(post.likes) && post.likes.includes(currentUserId));
    const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;

    setIsLikedLocal(isLiked);
    setLikesCountLocal(likesCount);
  }, [post.likes, currentUserId]);

  // 3. Handle Like dengan useCallback untuk menghindari instabilitas fungsi
  const handleLike = useCallback(() => {
    const newStatus = !isLikedLocal;
    setIsLikedLocal(newStatus);
    setLikesCountLocal((prev) => (newStatus ? prev + 1 : prev - 1));
    onLikeToggle?.(post.id);
  }, [isLikedLocal, post.id, onLikeToggle]);

  const navigateToProfile = useCallback(() => {
    if (post.username) {
      router.push(`/profile/${post.username}` as any);
    }
  }, [post.username, router]);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.user} onPress={navigateToProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.username?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <View>
            <Text style={styles.username}>{post.username || "Anonymous"}</Text>
            <Text style={styles.time}>Just now</Text>
          </View>
        </Pressable>

        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Pressable onPress={() => setVisible(true)} style={{ padding: 4 }}>
              <Ionicons name="ellipsis-horizontal" size={22} color="#8B8B8B" />
            </Pressable>
          }
          contentStyle={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
          }}
        >
          <Menu.Item
            onPress={() => setVisible(false)}
            title="Simpan Postingan"
            titleStyle={styles.menuItemText}
          />
          <Menu.Item
            onPress={() => setVisible(false)}
            title="Bagikan Tautan"
            titleStyle={styles.menuItemText}
          />
          <Menu.Item
            onPress={() => setVisible(false)}
            title="Laporkan"
            titleStyle={[styles.menuItemText, { color: '#FF3B30' }]}
          />
        </Menu>
      </View>

      {/* Image */}
      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
          cachePolicy="memory-disk"
          transition={200}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={55} color="#BDBDBD" />
          <Text style={styles.placeholder}>No Image</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>

        <Pressable 
        onPress={handleLike} 
        style={({ pressed }) => [
    styles.actionButton, // Style asli Anda
    { opacity: pressed ? 0.7 : 1 }
  ]}
>
        

          <Ionicons
            name={isLikedLocal ? "heart" : "heart-outline"}
            size={24}
            color={isLikedLocal ? "#FF3B30" : "#222"}
          />
        </Pressable>

        <Pressable
          onPress={onCommentPress}
          style={({ pressed }) => [
            styles.actionButton, styles.actionGap, // Style asli Anda
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Ionicons name="chatbubble-outline" size={23} color="#222" />
        </Pressable>

        <Pressable
          onPress={onSharePress}
          style={({ pressed }) => [
            styles.actionButton, styles.actionGap, // Style asli Anda
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Ionicons name="paper-plane-outline" size={23} color="#222" />
        </Pressable>

        <View style={styles.flexSpacer} />

        <Pressable
          onPress={() => setIsSavedLocal(!isSavedLocal)}
          style={({ pressed }) => [
            styles.actionButton, // Style asli Anda
            { opacity: pressed ? 0.7 : 1 }
          ]}

        >
          <Ionicons
            name={isSavedLocal ? "bookmark" : "bookmark-outline"}
            size={23}
            color={isSavedLocal ? "#000" : "#222"}
          />
        </Pressable>
      </View>

      <Text style={styles.likes}>{likesCountLocal} Likes</Text>

      <Text style={styles.caption}>
        <Text style={styles.captionUser}>{post.username || "Anonymous"}</Text> {post.caption || ""}
      </Text>
    </View>
  );
}

// Custom Memo Comparison yang kokoh untuk mencegah re-render yang tidak efisien
export default memo(PostCardComponent, (prev, next) => {
  return (
    prev.post.id === next.post.id &&
    prev.post.likes?.length === next.post.likes?.length &&
    prev.post.imageUrl === next.post.imageUrl &&
    prev.post.username === next.post.username &&
    prev.currentUserId === next.currentUserId &&
    prev.onCommentPress === next.onCommentPress && // Pastikan callback stabil
    prev.onSharePress === next.onSharePress
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 18,
    marginBottom: 24,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EFE8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.primary,
  },
  username: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.light.text,
  },
  time: {
    marginTop: 2,
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: "#999",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 22,
    marginBottom: 18,
  },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    borderRadius: 22,
    backgroundColor: "#F4F5F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  placeholder: {
    marginTop: 10,
    fontFamily: Fonts.medium,
    color: "#9A9A9A",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  actionButton: {
    padding: 4, // Memperluas area sentuh (touch target minimum 44px)
  },
  actionGap: {
    marginLeft: 11,
  },
  flexSpacer: {
    flex: 1,
  },
  likes: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 8,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 22,
  },
  captionUser: {
    fontFamily: Fonts.bold,
  },
  menuItemText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#222'
  }
});