// Path: app/explore/scroll-feed.tsx
import { useAutoRefresh } from '@/context/ActivityContext'; // 💡 1. Impor hook jalan pintas
import { CommentBottomSheet } from "@/presentation/components/CommentBottomSheet";
import PostCard from "@/presentation/components/PostCard";
import { ShareToDMBottomSheet } from "@/presentation/components/ShareToDMBottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

// Mock data postingan lengkap tetap dipertahankan dummy
const dummyFullExplorePosts = [
  { id: "1", username: "pantai_lovers", avatarUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", likes: Array(245).fill("dummy_user_id"), caption: "Vitamin Sea! 🌊 Mantap banget buat santai sore. #beach #sea", createdAt: "2 hours ago", userId: "dummy_u1", comments: [] },
  { id: "2", username: "nature_wild", avatarUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=150", imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", likes: Array(189).fill("dummy_user_id"), caption: "Menenangkan pikiran di tengah rindangnya hutan. 🌲 #nature #forest", createdAt: "5 hours ago", userId: "dummy_u2", comments: [] },
  { id: "3", username: "alex_fashion", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", likes: Array(512).fill("dummy_user_id"), caption: "Gaya kasual untuk hunting foto hari ini. 😎 #portrait #fashion", createdAt: "1 day ago", userId: "dummy_u3", comments: [] },
  { id: "4", username: "clara.adinda", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", likes: Array(340).fill("dummy_user_id"), caption: "Just capturing the inner peace. ✨ #portrait", createdAt: "2 days ago", userId: "dummy_u4", comments: [] },
  { id: "5", username: "idrus_alam", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", likes: Array(98).fill("dummy_user_id"), caption: "Menyatu dengan alam terbuka. 🏔️ #men #nature", createdAt: "3 days ago", userId: "dummy_u5", comments: [] },
  { id: "6", username: "susan_rahma", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", likes: Array(720).fill("dummy_user_id"), caption: "Smile, it confuses people. 😊 #portrait", createdAt: "1 week ago", userId: "dummy_u6", comments: [] },
];

export default function ExploreScrollFeedScreen() {
  const refreshProps = useAutoRefresh(); // 💡 2. Panggil hook-nya
  const router = useRouter();
  const { clickedPostId } = useLocalSearchParams<{ clickedPostId: string }>();

  // Ref dan State untuk Bottom Sheet Komentar & Share DM (Sama seperti FeedScreen)
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const shareSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Menyusun ulang data berdasarkan postingan yang diklik
  const reorderedPosts = useMemo(() => {
    if (!clickedPostId) return dummyFullExplorePosts;

    const targetIndex = dummyFullExplorePosts.findIndex((post) => post.id === clickedPostId);
    if (targetIndex === -1) return dummyFullExplorePosts;

    const newPosts = [...dummyFullExplorePosts];
    const [clickedPost] = newPosts.splice(targetIndex, 1);
    newPosts.unshift(clickedPost);
   
    return newPosts;
  }, [clickedPostId]);

  return (
    <View style={styles.container}>
      {/* Header navigasi balik */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Jelajahi</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={reorderedPosts as any[]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId="user_dummy" 
            onLikeToggle={(id) => console.log(`Liked explore post: ${id}`)}
            onCommentPress={() => {
              setSelectedPostId(item.id);
              bottomSheetRef.current?.present();
            }}
            onSharePress={() => {
              setSelectedPostId(item.id);
              shareSheetRef.current?.present();
            }}

            {...refreshProps}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent} // Properti padding disamakan dengan FeedScreen di bawah
      />

      {/* Menambahkan Komponen Bottom Sheet di Root Screen */}
      <CommentBottomSheet ref={bottomSheetRef} postId={selectedPostId} />
      <ShareToDMBottomSheet ref={shareSheetRef} postId={selectedPostId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  listContent: {
    // 💡 FIX PADDING: Disamakan persis dengan contentContainerStyle FeedScreen Anda
    paddingHorizontal: 20, 
    paddingBottom: 120,
  }
});