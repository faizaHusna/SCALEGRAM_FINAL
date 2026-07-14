import { Fonts } from "@/core/theme/fonts";
import { TabType } from "@/data/Profile/profileData";
import PostCard from "@/presentation/components/PostCard";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface ProfileContentProps {
  activeTab: TabType;
  myPosts: any[];
  savedPosts?: any[]; // 👈 1. Tambahkan properti savedPosts
  user: any;
  onLikeToggle: (id: string) => void;
  onSaveToggle?: (id: string) => void; // 👈 2. Tambahkan handler untuk save toggle
  onCommentPress: (id: string) => void;
  onSharePress: (id: string) => void;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  activeTab,
  myPosts = [],
  savedPosts = [], // 👈 3. Berikan default value array kosong
  user,
  onLikeToggle,
  onCommentPress,
  onSharePress,
}) => {
  const router = useRouter();

  if (activeTab === "grid") {
    return (
      <FlatList
        key="grid-tab"
        data={myPosts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/post/${item.id}` as any)}
            style={({ pressed }) => [styles.gridItemPressable, { opacity: pressed ? 0.9 : 1 }]}
          >
            {/* ✅ SEKARANG DUA-DUANYA SUDAH MENGGUNAKAN OPTIONAL CHAINING (?.) */}
            {item.mediaType === "video" || item.imageUrl?.endsWith(".mp4") || item.imageUrl?.endsWith(".mov") ? (
              <View style={styles.gridImage}>
                <Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <View style={styles.videoBadge}><Ionicons name="play" size={14} color="#FFF" /></View>
              </View>
            ) : (
              <Image source={{ uri: item.imageUrl || "https://placehold.co/400" }} style={styles.gridImage} cachePolicy="memory-disk" />
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={48} color="#C7C7CC" />
            <Text style={styles.emptyText}>Belum ada kiriman foto atau video.</Text>
          </View>
        }
        contentContainerStyle={styles.gridContainer}
      />
    );
  }

  if (activeTab === "list") {
    return (
      <FlatList
        key="list-tab"
        data={myPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id}
            onLikeToggle={onLikeToggle}
            onCommentPress={() => onCommentPress(item.id)}
            onSharePress={() => onSharePress(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={48} color="#C7C7CC" />
            <Text style={styles.emptyText}>Belum ada aliran postingan saat ini.</Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      />
    );
  }

  return (
    <FlatList
      key="saved-tab"
      data={savedPosts} // 👈 5. Menggunakan data dari Zustand state
      keyExtractor={(item) => item.id}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push(`/post/${item.id}` as any)} style={({ pressed }) => [styles.gridItemPressable, { opacity: pressed ? 0.9 : 1 }]}>
          <Image source={{ uri: item.imageUrl || "https://placehold.co/400" }} style={styles.gridImage} cachePolicy="memory-disk" />
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={48} color="#C7C7CC" />
          <Text style={styles.emptyText}>Belum ada foto yang Anda simpan.</Text>
        </View>
      }
      contentContainerStyle={styles.gridContainer}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: { paddingHorizontal: 2, paddingVertical: 2 },
  gridItemPressable: { flex: 1 / 3, aspectRatio: 1, margin: 2 },
  gridImage: { width: "100%", height: "100%", borderRadius: 8, backgroundColor: "#F4F5F7" },
  videoBadge: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(0,0,0,0.6)", width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 80, paddingHorizontal: 42, gap: 12 },
  emptyText: { textAlign: "center", color: "#8E8E93", fontFamily: Fonts.medium, fontSize: 13, lineHeight: 18 },
});