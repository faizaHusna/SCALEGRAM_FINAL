import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

// Mock data akun/kontak lain yang ada di aplikasi Anda
const MOCK_CONTACTS = [
  { id: "u1", name: "Andi Wijaya", avatar: "https://picsum.photos/100" },
  { id: "u2", name: "Siti Rahma", avatar: "https://picsum.photos/101" },
  { id: "u3", name: "Budi Santoso", avatar: "https://picsum.photos/102" },
];

export default function ForwardSelectScreen() {
  const router = useRouter();
  
  // 💡 Tangkap data pesan yang diteruskan dari ChatRoomScreen
  const { forwardText, forwardMediaUrl, forwardMediaType } = useLocalSearchParams<{
    forwardText?: string;
    forwardMediaUrl?: string;
    forwardMediaType?: "image" | "video";
  }>();

  const handleSelectContact = (contactName: string) => {
    // Di sini nanti Anda tinggal menyelipkan logika integrasi ke Database/API Anda (misal Firebase / Supabase)
    // Contoh: database.sendMessage(contactId, { text: forwardText, media: forwardMediaUrl })

    Alert.alert(
      "Pesan Diteruskan",
      `Berhasil meneruskan pesan ke ${contactName}`,
      [
        {
          text: "OK",
          onPress: () => {
            // Setelah sukses, kembali ke halaman sebelumnya atau langsung lompat ke chat room tujuan
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Teruskan ke...</Text>
      </View>

      {/* DAFTAR KONTAK */}
      <FlatList
        data={MOCK_CONTACTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.contactItem} onPress={() => handleSelectContact(item.name)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.contactName}>{item.name}</Text>
            <Ionicons name="paper-plane-outline" size={18} color="#5C5CFF" style={styles.sendIcon} />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: "#E5E5EA", paddingTop: 50 },
  backButton: { padding: 5, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  contactItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 0.5, borderBottomColor: "#F2F2F7" },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 15 },
  contactName: { fontSize: 16, fontWeight: "500", color: "#333", flex: 1 },
  sendIcon: { paddingHorizontal: 10 }
});