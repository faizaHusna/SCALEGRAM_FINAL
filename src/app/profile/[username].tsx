// FILE: src/app/profile/[username].tsx
import { useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { TabType } from "@/data/Profile/profileData";
import { ConnectionsBottomSheet } from "@/presentation/components/ConnectionsBottomSheet";
import BaseScreen from "@/presentation/components/Screen";
import { ProfileContent } from "@/presentation/screens/profile/styles/ProfileContent";
import { ProfileHeader } from "@/presentation/screens/profile/styles/ProfileHeader";
import { ProfileTabs } from "@/presentation/screens/profile/styles/ProfileTabs";

interface ConnectionUser {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  followersCount: number;
  isFollowing: boolean;
}

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams();
  const router = useRouter();

  const loggedInUser = useAuthStore((state) => state.user);
  const { posts } = useFeedStore();

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [sheetTitle, setSheetTitle] = useState("");
  const [sheetData, setSheetData] = useState<ConnectionUser[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>("grid");
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isMyProfile = username === loggedInUser?.username;

  useEffect(() => {
    setLoading(true);
    if (isMyProfile) {
      setProfileData(loggedInUser);
    } else {
      // Simulasi mengambil data profil orang lain secara dinamis
      setProfileData({
        id: "target-user-id",
        username: username,
        fullName: `User ${username}`,
        nickname: username,
        bio: `Halo, ini adalah halaman profil resmi dari @${username}!`,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        followersCount: 1500,
        followingCount: 300,
        isFollowing: false // State follow dinamis
      });
    }
    setLoading(false);
  }, [username, isMyProfile, loggedInUser]);



  const userPosts = useMemo(() => {
    return posts.filter((post) => post.userId === profileData?.id);
  }, [posts, profileData]);

  // Aksi Tombol Follow / Ikuti
  // 💡 Mengikuti fungsi ikuti yang dinamis seperti alur aplikasi Anda
  const handleFollowToggle = () => {
    setProfileData((prev: any) => {
      if (!prev) return prev;

      const nextIsFollowing = !prev.isFollowing;
      return {
        ...prev,
        isFollowing: nextIsFollowing,
        // Menambah/mengurangi angka followers secara real-time di UI
        followersCount: nextIsFollowing
          ? (prev.followersCount || 0) + 1
          : Math.max(0, (prev.followersCount || 0) - 1)
      };
    });

    // TODO: Tempatkan pemicu API/Global Store Anda di sini jika ada, contoh:
    // toggleFollowUserAction(profileData.id);
  };

 // ✅ TARUH DI FILE: src/app/profile/[username].tsx
const handleSendMessage = (username: string, initialMessage?: string) => {
  router.push({
    pathname: "/chat/room",
    params: { 
      // 💡 Sekarang sudah sinkron menggunakan 'profileData'
      nickname: profileData?.nickname || profileData?.fullName || username, 
      avatarUrl: profileData?.avatarUrl || "", 
      initialMessage: initialMessage
    }
  } as any);
};


  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#5C5CFF" /></View>;
  if (!profileData) return <View style={styles.center}><Text>Pengguna tidak ditemukan</Text></View>;

  const handleOpenConnections = (type: "followers" | "following") => {
    setSheetTitle(type === "followers" ? "Pengikut" : "Mengikuti");

    // Data dummy simulasi - Nantinya ganti dengan fetch API berdasarkan 'type'
    const dummyData = [
      { id: '1', username: 'johndoe', name: 'John Doe', avatarUrl: '...', followersCount: 1500, isFollowing: true },
      { id: '2', username: 'janedoe', name: 'Jane Doe', avatarUrl: '...', followersCount: 500, isFollowing: false }
    ];

    setSheetData(dummyData);
    setIsSheetVisible(true);
  };

  return (
    <BaseScreen scrollable={false}>
      {/* Head Bar Back Button */}
      {!isMyProfile && (
        <View style={styles.headerBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>{profileData.username}</Text>
          <View style={{ width: 24 }} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <ProfileHeader
          user={profileData}
          postCount={userPosts.length}
          isMyProfile={isMyProfile}
          onOpenEditProfile={() => Alert.alert("Edit Profil", "Membuka halaman edit profil")}
          onOpenConnections={() => handleOpenConnections("followers")}
          onLogout={() => Alert.alert("Keluar", "Proses Logout")}
          // 💡 Teruskan fungsi aksi ke komponen Header
          onFollowPress={handleFollowToggle}
          onMessagePress={handleSendMessage}
        />

        {/* ProfileTabs & ProfileContent */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isMyProfile={isMyProfile} />
        <View style={styles.tabContentContainer}>
          <ProfileContent activeTab={activeTab} myPosts={userPosts} user={profileData}
            onLikeToggle={(id: string) => console.log("Like", id)}
            onCommentPress={(id: string) => console.log("Comment", id)}
            onSharePress={(id: string) => console.log("Share", id)}
          />
        </View>
      </View>

      <ConnectionsBottomSheet 
        visible={isSheetVisible} 
        onClose={() => setIsSheetVisible(false)}
        title={sheetTitle}
        data={sheetData}
      />
    </BaseScreen>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFF'
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  tabContentContainer: { flex: 1, backgroundColor: "#FFF", overflow: "hidden" },
});