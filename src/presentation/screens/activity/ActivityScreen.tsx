import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import Screen from "@/presentation/components/Screen";
import React, { useCallback } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";

// 1. Struktur Data Multi-Aktivitas Sosial
interface ActivityItem {
  id: string;
  type: "like" | "comment" | "mention" | "follow";
  username: string;
  userAvatar: string; 
  time: string;
  postImage?: string; // Foto milik kita (untuk tipe like, comment, mention)
}

// 2. Data Dummy yang Diperluas Sesuai Skema Baru
const dummyActivityData: ActivityItem[] = [
  {
    id: "1",
    type: "like",
    username: "syifaaa._",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    time: "2m",
    postImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150",
  },
  {
    id: "2",
    type: "comment",
    username: "kevin.san",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    time: "15m",
    postImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150",
  },
  {
    id: "3",
    type: "follow",
    username: "hanifah_iz",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    time: "2h",
  },
  {
    id: "4",
    type: "mention",
    username: "faiza_luna",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    time: "1d",
    postImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=150",
  },
];

export default function ActivityScreen() {
  
  // Fungsi pembantu untuk membedakan string aksi teks di UI
  const renderActivityText = (type: ActivityItem["type"]) => {
    switch (type) {
      case "like":
        return " menyukai foto Anda. ";
      case "comment":
        return " mengomentari postingan Anda. ";
      case "mention":
        return " menyebut Anda dalam sebuah komentar. ";
      case "follow":
        return " mulai mengikuti Anda. ";
      default:
        return " berinteraksi dengan Anda. ";
    }
  };

  const renderItem = useCallback(({ item }: { item: ActivityItem }) => (
    <View style={styles.activityCard}>
      {/* Kiri: Avatar orang yang memicu interaksi */}
      <Image source={{ uri: item.userAvatar }} style={styles.avatar} />

      {/* Tengah: Gabungan Teks Nama + Jenis Aksi + Waktu */}
      <View style={styles.textContainer}>
        <Text style={styles.activityText}>
          <Text style={styles.username}>{item.username}</Text>
          {renderActivityText(item.type)}
          <Text style={styles.timeText}>{item.time}</Text>
        </Text>
      </View>

      {/* Kanan: Thumbnail Konten (Jika interaksi konten) ATAU Tombol Follow */}
      <View style={styles.rightAction}>
        {item.type === "follow" ? (
          <Pressable style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </Pressable>
        ) : (
          item.postImage && <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
        )}
      </View>
    </View>
  ), []);

  return (
    <Screen scrollable={false}>
      {/* Header Halaman */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aktivitas</Text>
      </View>

      {/* List Aliran Aktivitas Akun */}
      <FlatList
        data={dummyActivityData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  activityText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.light.text,
    lineHeight: 18,
  },
  username: {
    fontFamily: Fonts.bold,
  },
  timeText: {
    color: "#8e8e93",
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 65,
  },
  postThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  followButton: {
    backgroundColor: "#5F4BB6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
});