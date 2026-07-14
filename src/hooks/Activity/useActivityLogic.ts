import { initialActivityData } from "@/data/Activity/mockActivityData";
import { ActivityItem, ActivityTab } from "@/domain/entities/Activity";
import { useState } from "react";
import { Alert } from "react-native";

export const useActivityLogic = () => {
  // 💡 useRouter sudah dihapus dari sini karena navigasi sepenuhnya diatur oleh Screen
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivityData);
  const [activeTab, setActiveTab] = useState<ActivityTab>("semua");
  const [refreshing, setRefreshing] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [interactionPostId, setInteractionPostId] = useState<string | null>(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const newActivity: ActivityItem = {
        id: String(Date.now()),
        type: "like",
        username: "rachel_cia",
        userAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
        time: "Baru saja",
        postImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=150",
        isUnread: true,
        postCaption: "Cafe estetik terbaru di sudut kota Jakarta ☕🌿 Suasananya cozy banget!",
        likesCount: 129,
        commentsCount: 14,
        postId: "2",
      };

      setActivities((prev) => {
        if (prev.some((act) => act.username === "rachel_cia")) return prev;
        return [newActivity, ...prev];
      });
      setRefreshing(false);
    }, 1200);
  };

  const markAllAsRead = () => {
    if (!activities.some((act) => act.isUnread)) {
      Alert.alert("Info", "Semua aktivitas Anda sudah ditandai sebagai dibaca.");
      return;
    }
    Alert.alert(
      "Tandai Dibaca",
      "Apakah Anda yakin ingin menandai semua aktivitas sebagai sudah dibaca?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Tandai", onPress: () => setActivities((prev) => prev.map((item) => ({ ...item, isUnread: false }))) },
      ]
    );
  };

  const clearAllActivities = () => {
    if (activities.length === 0) {
      Alert.alert("Info", "Aliran aktivitas Anda sudah bersih.");
      return;
    }
    Alert.alert(
      "Bersihkan Aktivitas",
      "Apakah Anda ingin membersihkan seluruh daftar aktivitas hari ini? Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Bersihkan", style: "destructive", onPress: () => setActivities([]) },
      ]
    );
  };

  const toggleFollow = (username: string) => {
    setFollowedUsers((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  };

  const handleItemPress = (item: ActivityItem) => {
    // 1. Ubah status notifikasi menjadi sudah dibaca
    if (item.isUnread) {
      setActivities((prev) =>
        prev.map((act) => (act.id === item.id ? { ...act, isUnread: false } : act))
      );
    }

    // 2. Simpan ID postingan ke dalam state global/hook agar Bottom Sheet tahu postingan mana yang aktif
    if (item.postId) {
      setInteractionPostId(item.postId);
    } else if (item.postImage) {
      setInteractionPostId(item.id);
    }
    
    // ✅ Logika navigasi double push sudah dihapus total dari sini!
  };

  const filteredActivities = activities.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "suka") return item.type === "like";
    if (activeTab === "komentar") return item.type === "comment" || item.type === "mention";
    if (activeTab === "mengikuti") return item.type === "follow";
    return true;
  });

  return {
    activities, activeTab, setActiveTab, refreshing, followedUsers, interactionPostId,
    setInteractionPostId, handleRefresh, markAllAsRead, clearAllActivities,
    toggleFollow, handleItemPress, filteredActivities
  };
};