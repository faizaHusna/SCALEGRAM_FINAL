import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { PostRepository } from "@/data/repositories/PostRepository";
import { CommentBottomSheet } from "@/presentation/components/CommentBottomSheet";
import Screen from "@/presentation/components/Screen";
import { ShareToDMBottomSheet } from "@/presentation/components/ShareToDMBottomSheet";
import { AuthState, useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";


import { TabType } from "@/data/Profile/profileData";
import { ConnectionsModal } from "./styles/ConnectionsModal";
import { EditProfileModal } from "./styles/EditProfileModal";
import { ProfileContent } from "./styles/ProfileContent";
import { ProfileHeader } from "./styles/ProfileHeader";
import { ProfileTabs } from "./styles/ProfileTabs";

export default function ProfileScreen() {
const { user, setUser, logout } = useAuthStore((state: AuthState) => state); // 👈 Tambah tipe state agar aman
const { posts, setPosts } = useFeedStore();

  const [activeTab, setActiveTab] = useState<TabType>("grid");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isConnectionsModalVisible, setIsConnectionsModalVisible] = useState(false);
  const [connectionsType, setConnectionsType] = useState<"followers" | "following">("followers");
  const [interactionPostId, setInteractionPostId] = useState<string | null>(null);

  const commentSheetRef = useRef<BottomSheetModal>(null);
  const shareSheetRef = useRef<BottomSheetModal>(null);

  const postRepository = useMemo(() => new PostRepository(), []);

const myPosts = useMemo(() => {
    return posts.filter((post) => post.userId === user?.id);
  }, [posts, user]);

  // 2. Tambahkan Filter postingan yang DI-SAVE oleh user ini 👇
  const savedPosts = useMemo(() => {
    return posts.filter((post: any) => post.savedBy?.includes(user?.id || ""));
  }, [posts, user]);

  const openConnectionsModal = (type: "followers" | "following") => {
    setConnectionsType(type);
    setIsConnectionsModalVisible(true);
  };

  const handleLikeToggle = (id: string) => {
    const updatedPosts = posts.map((p) => {
      if (p.id === id) {
        const isLiked = p.likes?.includes(user?.id || "");
        const nextLikes = isLiked
          ? p.likes.filter((uid) => uid !== user?.id)
          : [...(p.likes || []), user?.id || ""];
        return { ...p, likes: nextLikes };
      }
      return p;
    });
    setPosts(updatedPosts);
  };

 const handleSaveToggle = async (id: string) => {
  // Ambil data postingan yang mau di-bookmark
  const postToUpdate = posts.find((p: any) => p.id === id);
  if (!postToUpdate) return;

  const isSaved = postToUpdate.savedBy?.includes(user?.id || "") || false;

  // 1. INTI PERBAIKAN: Petakan langsung dari variabel 'posts' di scope komponen
  const updatedPosts = posts.map((p: any) => {
    if (p.id === id) {
      const nextSaved = isSaved
        ? (p.savedBy || []).filter((uid: string) => uid !== user?.id)
        : [...(p.savedBy || []), user?.id || ""];
      return { ...p, savedBy: nextSaved };
    }
    return p;
  });

  // 2. Masukkan array hasil map langsung ke setPosts (tanpa callback function)
  setPosts(updatedPosts);

  // 3. Kirim update ke Firestore cloud di background
  try {
    await postRepository.toggleSavePost(id, user?.id || "", isSaved);
  } catch (error) {
    console.error("Gagal sinkronisasi bookmark ke database cloud:", error);
  }
};

  return (
    <Screen scrollable={false}>
      <View style={{ flex: 1 }}>
        <ProfileHeader
          user={user}
          postCount={myPosts.length}
          onOpenEditProfile={() => setIsEditModalVisible(true)}
          onOpenConnections={openConnectionsModal}
          onLogout={logout}
        />

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <View style={styles.tabContentContainer}>
          <ProfileContent
            activeTab={activeTab}
            myPosts={myPosts}
            savedPosts={savedPosts} // 👈 Kirim list postingan tersimpan
            user={user}
            onLikeToggle={handleLikeToggle}
            onSaveToggle={handleSaveToggle} // 👈 Kirim fungsi save toggle
            onCommentPress={(id) => {
              setInteractionPostId(id);
              commentSheetRef.current?.present();
            }}
            onSharePress={(id) => {
              setInteractionPostId(id);
              shareSheetRef.current?.present();
            }}
          />
        </View>
      </View>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        user={user}
        setUser={setUser}
      />

      <ConnectionsModal
        isVisible={isConnectionsModalVisible}
        onClose={() => setIsConnectionsModalVisible(false)}
        type={connectionsType}
        user={user}
        setUser={setUser}
      />

      <CommentBottomSheet ref={commentSheetRef} postId={interactionPostId} />
      <ShareToDMBottomSheet ref={shareSheetRef} postId={interactionPostId} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabContentContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
  },
});