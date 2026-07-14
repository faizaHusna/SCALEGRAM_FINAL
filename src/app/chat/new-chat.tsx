// Path: src/app/chat/new-chat.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react"; // Tambahkan useMemo dan useState
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native"; // Tambahkan TextInput

const dummyFriends = [
  { id: "f1", name: "Ahmad Dani", username: "dani_ahmad", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { id: "f2", name: "Siti Rahma", username: "rahma_siti", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: "f3", name: "Zack Lee", username: "zack_lee", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
];

export default function NewChatScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(""); // State untuk teks pencarian

  // Logika pencarian teman berdasarkan nama atau username
  const filteredFriends = useMemo(() => {
    if (!searchQuery) return dummyFriends;
    const query = searchQuery.toLowerCase();

    return dummyFriends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(query) ||
        friend.username.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Pesan Baru</Text>
      </View>

      {/* Kolom Pencarian */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8A8A8A" style={styles.searchIcon} />
          <TextInput
            placeholder="Cari teman..."
            placeholderTextColor="#8A8A8A"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* List Teman */}
      <FlatList
        data={filteredFriends} // Gunakan data hasil filter di sini
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.friendCard}
            onPress={() => {
              // Buka room chat dan kirim parameter nama teman yang dipilih
              router.replace({
                pathname: "/chat/room" as any,
                params: { nickname: item.name, avatarUrl: item.avatarUrl }
              });
            }}
          >
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.username}>@{item.username}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Teman tidak ditemukan.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingTop: 50, 
    paddingBottom: 12, 
    paddingHorizontal: 16, 
    borderBottomWidth: 0.5, 
    borderBottomColor: "#E5E5E5" 
  },
  backButton: { paddingRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  
  // Style Tambahan untuk Kolom Pencarian
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  
  friendCard: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  name: { fontSize: 15, fontWeight: "600" },
  username: { fontSize: 13, color: "#8A8A8A" },

  // Style untuk tampilan jika hasil pencarian kosong
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    marginTop: 8,
    color: "#8A8A8A",
    fontSize: 14,
  }
});