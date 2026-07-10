import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Shadows } from "@/core/theme/shadows";
import Screen from "@/presentation/components/Screen";
import { useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { posts } = useFeedStore();

  // Saring kiriman milik pengguna ini saja secara efisien menggunakan useMemo
  const myPosts = useMemo(() => {
    return posts.filter((post) => post.userId === user?.id);
  }, [posts, user]);

  function handleLogout() {
    logout(); // Mematikan sesi global otomatis memicu redirection Guard di _layout.tsx
  }

  return (
    <Screen scrollable={false}>
      {/* Header Profil */}
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <Image
            source={{ uri: user?.avatarUrl || "https://picsum.photos/200" }}
            style={styles.avatar}
            cachePolicy="memory-disk"
          />
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{myPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user?.followersCount ?? 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user?.followingCount ?? 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* 💡 PERUBAHAN DI SINI: Menyusun visual hierarki Nickname & Username */}
        {/* 1. Menampilkan Nickname / Nama Asli sebagai nama utama (Tebal) */}
        <Text style={styles.nickname}>
          {user?.nickname || "ScaleGram User"}
        </Text>

        {/* 2. Menampilkan Username unik dengan prefix '@' di bawah Nickname */}
        <Text style={styles.username}>
          @{user?.username || "user_scalegram"}
        </Text>

        {/* 3. Menampilkan Email */}
        <Text style={styles.email}>{user?.email}</Text>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>

      {/* Grid Postingan Pribadi */}
      <FlatList
        data={myPosts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.gridImage}
            cachePolicy="memory-disk"
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>You haven't posted anything yet.</Text>}
        contentContainerStyle={styles.gridContainer}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, backgroundColor: "#FFF", borderRadius: 24, marginBottom: 16, ...Shadows.card },
  avatarRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  avatar: { width: 86, height: 86, borderRadius: 43, borderWidth: 2, borderColor: Colors.light.primary },
  statsContainer: { flexDirection: "row", flex: 1, justifyContent: "space-around", marginLeft: 20 },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.light.text },
  statLabel: { fontSize: 12, fontFamily: Fonts.regular, color: "#8A8A8A", marginTop: 2 },

  // 💡 GAYA BARU SINKRONISASI PROFIL:
  nickname: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.light.text
  },
  username: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: "#666666", // Warna abu-abu redup agar estetik kontras dengan nickname
    marginTop: 2,
    marginBottom: 4
  },
  email: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.light.subText
  },

  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF1F0", paddingVertical: 10, borderRadius: 12, marginTop: 16, gap: 6 },
  logoutText: { color: "#FF3B30", fontFamily: Fonts.semiBold, fontSize: 14 },
  gridContainer: { paddingHorizontal: 2 },
  gridImage: { flex: 1 / 3, aspectRatio: 1, margin: 2, borderRadius: 8, backgroundColor: "#F4F5F7" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999", fontFamily: Fonts.medium },
});