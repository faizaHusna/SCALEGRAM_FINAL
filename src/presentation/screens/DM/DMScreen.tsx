import { Colors } from "@/core/theme/colors";
import Screen from "@/presentation/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react"; // Tambahkan useMemo di sini
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native";

// IMPORT STYLES
import { styles } from "@/domain/style/DMStyles";

interface ChatItem {
  id: string;
  username: string;
  nickname: string;
  avatarUrl: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

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

  // Logika pencarian/penyaringan chat
  const filteredChats = useMemo(() => {
    if (!searchQuery) return dummyChats;
    const query = searchQuery.toLowerCase();
    
    return dummyChats.filter(
      (chat) =>
        chat.nickname.toLowerCase().includes(query) ||
        chat.username.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const renderItem = useCallback(({ item }: { item: ChatItem }) => (
    <Pressable
      style={styles.chatCard}
      onPress={() =>
        router.push({
          pathname: "/chat/room" as any,
          params: { nickname: item.nickname, avatarUrl: item.avatarUrl },
        })
      }
    >
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />

      <View style={styles.messageContent}>
        <Text style={styles.nicknameText}>{item.nickname}</Text>
        <Text
          style={[styles.lastMessageText, item.unreadCount > 0 && styles.unreadMessageText]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      <View style={styles.rightInfo}>
        <Text style={[styles.timeText, item.unreadCount > 0 && styles.unreadTimeText]}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  ), [router]);

  return (
    <Screen scrollable={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Direct Messages</Text>
        <Pressable
          onPress={() => router.push("/chat/new-chat" as any)} style={styles.composeButton}>          
          <Ionicons name="create-outline" size={24} color={Colors.light.text} />
        </Pressable>
      </View>

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

      <FlatList
        data={filteredChats} // Gunakan filteredChats di sini, bukan dummyChats lagi
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Tidak ada pesan yang cocok.</Text>
          </View>
        }
      />
    </Screen>
  );
}