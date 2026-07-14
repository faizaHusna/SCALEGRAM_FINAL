import { useAutoRefresh } from '@/context/ActivityContext'; // 💡 1. Impor hook jalan pintas
import { Colors } from "@/core/theme/colors";
import { Post } from "@/domain/entities/Post";
import { useGetFeed } from "@/hooks/post/useGetFeed";
import { CommentBottomSheet } from "@/presentation/components/CommentBottomSheet";
import { CreateStoryButton } from "@/presentation/components/CreateStoryButton";
import PostCard from "@/presentation/components/PostCard";
import { ShareToDMBottomSheet } from "@/presentation/components/ShareToDMBottomSheet";
import StoryItem from "@/presentation/components/StoryItem";
import { useAuthStore } from "@/store/authStore";
import { usePostStore } from '@/store/postStore';
import { useStoryStore } from '@/store/useStoryStore';
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect, useRouter } from "expo-router";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// IMPORT STYLES
import { styles } from "@/domain/style/FeedStyles";

const FeedContext = createContext<any>(null);
function FeedContent({ onOpenComment, onOpenShare }: { onOpenComment: (id: string) => void, onOpenShare: (id: string) => void }) {
  const router = useRouter();
  const { posts, error } = useContext(FeedContext);
  const user = useAuthStore((state) => state.user);

  // STATE UNTUK MENYIMPAN ID STORY YANG SUDAH DITEKAN
  const [viewedStories, setViewedStories] = useState<string[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // ✅ 1. AMBIL DATA STYLES DARI ZUSTAND STORE
  const rawStories = useStoryStore((state) => state.storiesData);

  // ✅ 2. GABUNGKAN DENGAN USER PROFILE ANDA DI POSITION PALING DEPAN
const storiesData = useMemo(() => {
  // Saring rawStories, buang item yang punya ID "create_placeholder" atau "0" agar tidak duplikat
  const filteredRaw = rawStories.filter(
    (story: any) => story.id !== "create_placeholder" && story.id !== "0"
  );
  
  // Baru gabungkan dengan tombol "You" di paling depan
  return [{ id: "create_placeholder", username: "You", avatarUrl: user?.avatarUrl }, ...filteredRaw];
}, [user?.avatarUrl, rawStories]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60, // Postingan harus terlihat minimal 60% baru videonya berputar
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      const focusedItem = viewableItems[0];
      setActivePostId(focusedItem.key || focusedItem.item.id);
    }
  }).current;

  // Fungsi saat Story Teman ditekan
  const handleStoryPress = (id: string, username: string) => {
    if (id === "create_placeholder") return; // Abaikan jika yang ditekan tombol 'You'
    if (!viewedStories.includes(id)) {
      setViewedStories([...viewedStories, id]);
    }
    Alert.alert("Membuka Story", `Melihat story dari ${username}`);
  };

  // ✅ 3. FUNGSI RENDER POST SEKARANG SUDAH MASUK KEMBALI KE DALAM FUNGSI UTAMA
  const renderPostItem = useCallback(({ item }: { item: Post }) => (
    <PostCard
      post={item}
      currentUserId={user?.id}
      isActive={item.id === activePostId} 
      onLikeToggle={(id) => console.log(`Post liked: ${id}`)}
      onCommentPress={() => onOpenComment(item.id)}
      onSharePress={() => onOpenShare(item.id)}
      onEditPress={(postId) => {
        // Arahkan ke layar edit postingan bawa parameter postId
        router.push({
          pathname: "/edit-post"as any , // 👈 Sesuaikan dengan nama file/rute screen edit Anda
          params: { postId: postId }
        });
      }}
      onReportPress={async (postId) => {
        try {
          const response = await fetch(`https://api.scalegram.com/posts/${postId}/report`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reportedBy: user?.id, 
              reason: "Pelanggaran Panduan Komunitas",
              createdAt: new Date().toISOString()
            })
          });
          if (!response.ok) {
            throw new Error('Gagal mengirimkan laporan ke server');
          }
          console.log(`Post ${postId} berhasil dilaporkan ke backend.`);
        } catch (error) {
          console.error("Error Report API:", error);
          throw error;
        }
      }}

      
    />
  ), [user?.id, onOpenComment, onOpenShare, activePostId]);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    if (hours >= 17 && hours < 21) return "Good Evening";
    return "Good Night";
  };

  // ✅ 4. HEADER & STORIES FLATLIST DI DALAM USEMEMO
  const listHeaderComponent = useMemo(() => {
    const greetingText = getGreeting();

    return (
      <View>
        {/* --- BAGIAN 1: HEADER --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greetingText},</Text>
            <Text style={styles.logo}>ScaleGram</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable onPress={() => router.push("/notification")}>
              <Ionicons name="notifications-outline" size={26} color={Colors.light.text} />
            </Pressable>
            <Pressable onPress={() => router.push("/dm")}>
              <Ionicons name="paper-plane-outline" size={26} color={Colors.light.text} />
            </Pressable>
          </View>
        </View>

        {/* --- BAGIAN 2: STORIES FLATLIST --- */}
        <FlatList
          horizontal
          data={storiesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            if (index === 0) return <CreateStoryButton />;

            return (
              <StoryItem
                username={item.username}
                avatarUrl={item.avatarUrl}
                isSeen={viewedStories.includes(item.id)}
                onPress={() => handleStoryPress(item.id, item.username)}
              />
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyList}
        />
      </View>
    );
  }, [router, viewedStories, storiesData]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text style={styles.errorText}>Oops, gagal memuat feed.</Text>
      </View>
    );
  }

  // ✅ 5. RETURN UTAMA UNTUK SELURUH HALAMAN FEED POST
  return (
    <FlatList
      data={posts}
      renderItem={renderPostItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={listHeaderComponent}
      ListEmptyComponent={() => <Text style={styles.empty}>No posts yet.</Text>}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}

     
    />
  );
} // 👈 DI SINI TANDA TUTUP YANG BENAR UNTUK FeedContent!

export default function FeedScreen() {
  const refreshProps = useAutoRefresh(); // 💡 2. Panggil hook-nya
  const feedUseCase = useGetFeed();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const shareSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { fetchAllPosts } = usePostStore();

  useFocusEffect(
    useCallback(() => {
      fetchAllPosts(); // Mengambil data paling segar dari database
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <FeedContext.Provider value={feedUseCase}>
        <FeedContent
          onOpenComment={(id) => { setSelectedPostId(id); bottomSheetRef.current?.present(); }}
          onOpenShare={(id) => { setSelectedPostId(id); shareSheetRef.current?.present(); }}
          {...refreshProps}
        />
      </FeedContext.Provider>
      <CommentBottomSheet ref={bottomSheetRef} postId={selectedPostId} />
      <ShareToDMBottomSheet ref={shareSheetRef} postId={selectedPostId} />
    </SafeAreaView>
  );
}