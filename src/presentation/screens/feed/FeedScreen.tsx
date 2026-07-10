import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Post } from "@/domain/entities/Post";
import { useGetFeed } from "@/hooks/post/useGetFeed";
import { CommentBottomSheet } from "@/presentation/components/CommentBottomSheet";
import PostCard from "@/presentation/components/PostCard";
import { ShareToDMBottomSheet } from "@/presentation/components/ShareToDMBottomSheet";
import StoryItem from "@/presentation/components/StoryItem";
import { useAuthStore } from "@/store/authStore";

const stories = [
  { id: "1", username: "Syifa" },
  { id: "2", username: "Hani" },
  { id: "3", username: "Faiza" },
];

const FeedContext = createContext<any>(null);

const CreateStoryButton = () => {
  const router = useRouter();

  // Fungsi untuk membuka galeri
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Izin akses galeri diperlukan!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });
    if (!result.canceled) {
      router.push({ pathname: '/story/editor', params: { imageUri: result.assets[0].uri } });
    }
  };

  // Fungsi untuk membuka kamera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Izin kamera diperlukan!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });
    if (!result.canceled) {
      router.push({ pathname: '/story/editor', params: { imageUri: result.assets[0].uri } });
    }
  };

  // Fungsi Alert untuk memilih sumber
  const handlePress = () => {
    Alert.alert(
      "Tambah Story",
      "Pilih sumber gambar:",
      [
        { text: "Kamera", onPress: takePhoto },
        { text: "Galeri", onPress: pickImage },
        { text: "Batal", style: "cancel" }
      ]
    );
  };

  return (
    <Pressable onPress={handlePress} style={styles.storyContainer}>
      <View style={styles.createStoryRing}>
        <Ionicons name="add" size={24} color={Colors.light.primary} />
      </View>
      <Text style={[styles.username, { fontFamily: Fonts.medium }]}>You</Text> 
    </Pressable>
  );
};

function FeedContent({ onOpenComment, onOpenShare }: { onOpenComment: (id: string) => void, onOpenShare: (id: string) => void }) {
  const router = useRouter();
  const { posts, error } = useContext(FeedContext);
  const user = useAuthStore((state) => state.user);

  const renderPostItem = useCallback(({ item }: { item: Post }) => (
    <PostCard
      post={item}
      currentUserId={user?.id}
      onLikeToggle={(id) => console.log(`Post liked: ${id}`)}
      onCommentPress={() => onOpenComment(item.id)}
      onSharePress={() => onOpenShare(item.id)}
    />
  ), [user?.id, onOpenComment, onOpenShare]);

  const storiesData = [{ id: "0", username: "You" }, ...stories];

  const listHeaderComponent = useMemo(() => (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.logo}>ScaleGram</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push("/notification")}>
            <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
          </Pressable>
          <Pressable onPress={() => router.push("/dm")}>
            <Ionicons name="paper-plane-outline" size={24} color={Colors.light.text} />
          </Pressable>
        </View>
      </View>
      <FlatList
        horizontal
        data={storiesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          if (index === 0) return <CreateStoryButton />;
          return <StoryItem username={item.username} />;
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyList}
      />
    </View>
  ), []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text style={styles.errorText}>Oops, gagal memuat feed.</Text>
      </View>
    );
  }

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
    />
  );
}

export default function FeedScreen() {
  const feedUseCase = useGetFeed();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const shareSheetRef = useRef<BottomSheet>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <FeedContext.Provider value={feedUseCase}>
          <FeedContent
            onOpenComment={(id) => { setSelectedPostId(id); bottomSheetRef.current?.snapToIndex(0); }}
            onOpenShare={(id) => { setSelectedPostId(id); shareSheetRef.current?.snapToIndex(0); }}
          />
        </FeedContext.Provider>
        <CommentBottomSheet ref={bottomSheetRef} postId={selectedPostId} />
        <ShareToDMBottomSheet ref={shareSheetRef} postId={selectedPostId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 20, marginBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { fontSize: 15, color: "#8A8A8A", fontFamily: Fonts.regular, marginBottom: 4 },
  logo: { fontSize: 32, fontFamily: Fonts.logo, color: Colors.light.text },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 18 },
  storyList: { paddingBottom: 24, paddingRight: 12 },
  storyContainer: { alignItems: "center", marginRight: 18, width: 74 },
  createStoryRing: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#E5E5E5', justifyContent: "center", alignItems: "center" },
  username: { marginTop: 8, fontSize: 13, color: Colors.light.text },
  empty: { marginTop: 40, textAlign: "center", color: "#999" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { marginTop: 12, textAlign: "center", color: "#666" },
});