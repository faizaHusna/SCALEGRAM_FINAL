import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import Screen from "@/presentation/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// 1. Blueprint Model Data Chat / DM List
interface ChatItem {
  id: string;
  username: string;
  nickname: string;
  avatarUrl: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

// 2. Data Dummy Obrolan Masuk
const dummyChats: ChatItem[] = [
  {
    id: "ch-1",
    username: "syifaaa._",
    nickname: "Syifa Amalia",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    lastMessage: "P, besok kumpul kelompok jam berapa ya?",
    time: "5m",
    unreadCount: 2,
  },
  {
    id: "ch-2",
    username: "budi_scale",
    nickname: "Budi Budiman",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    lastMessage: "File uploadService.ts udah gw benerin erornya bro.",
    time: "2j",
    unreadCount: 0,
  },
  {
    id: "ch-3",
    username: "kevin.san",
    nickname: "Kevin Sanjaya",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    lastMessage: "Okee siap, mantap!",
    time: "1d",
    unreadCount: 0,
  },
];

export default function DMScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const renderItem = useCallback(({ item }: { item: ChatItem }) => (
    <Pressable 
      style={styles.chatCard}
      onPress={() => alert(`Membuka ruang obrolan dengan: @${item.username}`)}
    >
      {/* Kiri: Foto Profil Teman */}
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />

      {/* Tengah: Nama Akun & Cuplikan Teks Pesan */}
      <View style={styles.messageContent}>
        <Text style={styles.nicknameText}>{item.nickname}</Text>
        <Text 
          style={[styles.lastMessageText, item.unreadCount > 0 && styles.unreadMessageText]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Kanan: Info Waktu & Jumlah Pesan Belum Dibaca */}
      <View style={styles.rightInfo}>
        <Text style={[styles.timeText, item.unreadCount > 0 && styles.unreadTimeText]}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  ), []);

  return (
    <Screen scrollable={false}>
      {/* 1. Header Navigation DM */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Direct Messages</Text>
        <Pressable onPress={() => alert("Mulai chat baru")} style={styles.composeButton}>
          <Ionicons name="create-outline" size={24} color={Colors.light.text} />
        </Pressable>
      </View>

      {/* 2. Kotak Search Bar Pesan */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8A8A8A" style={styles.searchIcon} />
          <TextInput
            placeholder="Cari pesan atau teman..."
            placeholderTextColor="#8A8A8A"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* 3. List Kontak Chat */}
      <FlatList
        data={dummyChats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada obrolan dimulai.</Text>
          </View>
        }
      />
    </Screen>
  );
}

// 4. Struktur Stylesheet Pintar (Otomatis Mendeteksi Tipe)
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  },
  composeButton: {
    padding: 2,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.light.text,
  },
  listContent: {
    paddingVertical: 4,
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eee",
  },
  messageContent: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 8,
  },
  nicknameText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.light.text,
    marginBottom: 3,
  },
  lastMessageText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "#8e8e93",
  },
  unreadMessageText: {
    fontFamily: Fonts.bold,
    color: "#000",
  },
  rightInfo: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: "#8e8e93",
    marginBottom: 6,
  },
  unreadTimeText: {
    fontFamily: Fonts.bold,
    color: "#5F4BB6",
  },
  badgeContainer: {
    backgroundColor: "#5F4BB6",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontFamily: Fonts.medium,
    color: "#8e8e93",
  },
});