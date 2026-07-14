import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router"; // 👈 1. IMPORT ROUTER
import React, { useRef } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Colors } from "@/core/theme/colors";
import { ActivityItem } from "@/domain/entities/Activity";
import { CommentBottomSheet } from "@/presentation/components/CommentBottomSheet";
import Screen from "@/presentation/components/Screen";
import { ShareToDMBottomSheet } from "@/presentation/components/ShareToDMBottomSheet";

import { styles } from "@/domain/style/ActivityStyles";
import { useActivityLogic } from "@/hooks/Activity/useActivityLogic";

import { ActivityListItem } from "@/presentation/components/ActivityListItem";

export default function ActivityScreen() {
  const router = useRouter(); // 👈 2. INISIALISASI ROUTER
  // ERROR SEBELUMNYA KARENA KATA 'const' DI BAWAH INI HILANG ATAU TERHAPUS
  const {
    activeTab,
    setActiveTab,
    refreshing,
    followedUsers,
    interactionPostId,
    handleRefresh,
    markAllAsRead,
    clearAllActivities,
    toggleFollow,
    handleItemPress,
    filteredActivities
  } = useActivityLogic();

  const commentSheetRef = useRef<BottomSheetModal>(null);
  const shareSheetRef = useRef<BottomSheetModal>(null);

  const onRowPress = (item: ActivityItem) => {
    // Jalankan logic internal hook dulu (misal: mengubah status isUnread menjadi false, atau set interactionPostId)
    handleItemPress(item);

    // Cek tipenya untuk menentukan respon UI
    switch (item.type) {
      case "comment":
        // 💬 Tipe Komentar: Buka Bottom Sheet komentar langsung di tempat! (UX Keren ala IG asli)
        commentSheetRef.current?.present();
        break;

      case "follow":
        // 👤 Tipe Follow: Terbang langsung ke halaman profil orang tersebut
        router.push(`/profile/${item.username}`);
        break;

      case "like":
      case "mention":
        // ❤️ / 🏷️ Tipe Like & Mention: Buka halaman detail postingan yang bersangkutan
        if (item.postId) {
          router.push(`/post/${item.postId}`);
        }
        break;

      default:
        console.log("Tipe aktivitas tidak dikenali");
    }
  };

  // Filter Tabs Render
  const renderTab = (title: string, id: any, iconName?: any, color?: string) => {
    const isActive = activeTab === id;
    return (
      <Pressable onPress={() => setActiveTab(id)} style={[styles.tabCapsule, isActive && styles.tabCapsuleActive]}>
        {iconName && <Ionicons name={iconName} size={11} color={isActive ? "#FFF" : color} style={{ marginRight: 4 }} />}
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{title}</Text>
      </Pressable>
    );
  };

  return (
    <Screen scrollable={false}>
      <Animated.View entering={FadeIn.duration(200)} style={styles.mainContainer}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <Text style={styles.headerTitle}>Aktivitas</Text>
            <View style={styles.headerActions}>
              <Pressable onPress={markAllAsRead} style={({ pressed }) => [styles.headerButton, { opacity: pressed ? 0.6 : 1 }]}>
                <Ionicons name="checkmark-done" size={20} color={Colors.light.primary} />
              </Pressable>
              <Pressable onPress={clearAllActivities} style={({ pressed }) => [styles.headerButton, { opacity: pressed ? 0.6 : 1 }]}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </Pressable>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={{ height: 44 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
              {renderTab("Semua", "semua")}
              {renderTab("Suka", "suka", "heart", "#FF2D55")}
              {renderTab("Komentar", "komentar", "chatbubble", "#34C759")}
              {renderTab("Mengikuti", "mengikuti", "person-add", "#007AFF")}
            </ScrollView>
          </View>
        </View>

        {/* Activity List */}
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <ActivityListItem
              item={item}
              isFollowing={followedUsers.includes(item.username)}
              onPress={() => onRowPress(item)} // 👈 4. GANTI DENGAN FUNGSI WRAPPER BARU KITA
              onToggleFollow={toggleFollow}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="notifications-off-outline" size={48} color="#C7C7CC" />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Aktivitas</Text>
              <Text style={styles.emptyText}>
                {activeTab === "semua" ? "Interaksi baru dari pengikut Anda akan muncul di sini." : `Tidak ada aktivitas kategori "${activeTab}" saat ini.`}
              </Text>
            </View>
          }
        />
      </Animated.View>

      {/* Bottom Sheets */}
      <CommentBottomSheet ref={commentSheetRef} postId={interactionPostId} />
      <ShareToDMBottomSheet ref={shareSheetRef} postId={interactionPostId} />
    </Screen>
  );
}