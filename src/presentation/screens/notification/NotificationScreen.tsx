import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import Screen from "@/presentation/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

// 1. Blueprint Struktur Data Notifikasi Sistem & Teknis
interface SystemNotificationItem {
  id: string;
  type: "welcome" | "security" | "announcement";
  title: string;
  body: string;
  time: string;
  isRead: boolean;
}

// 2. Data Dummy Khusus Informasi Teknis Aplikasi & Akun
const dummySystemNotifications: SystemNotificationItem[] = [
  {
    id: "sn-1",
    type: "security",
    title: "Percobaan Login Terdeteksi",
    body: "Akun Anda baru saja login melalui perangkat Windows - Lenovo pada pukul 13:30.",
    time: "5m yang lalu",
    isRead: false,
  },
  {
    id: "sn-2",
    type: "announcement",
    title: "Fitur Unggah Foto (Upload) Aktif!",
    body: "Tim developer ScaleGram baru saja memperbarui sistem. Sekarang Anda sudah bisa mencoba mengunggah foto terbaik Anda ke feed.",
    time: "2j yang lalu",
    isRead: false,
  },
  {
    id: "sn-3",
    type: "welcome",
    title: "Selamat Datang di ScaleGram!",
    body: "Yuk, lengkapi profil Anda! Ketuk di sini untuk menambahkan foto profil unik dan bio keren agar teman-teman mudah mengenali Anda.",
    time: "1d yang lalu",
    isRead: true,
  },
];

export default function NotificationScreen() {
  const router = useRouter();

  // Helper untuk menentukan ikon berdasarkan tipe notifikasi teknis
  const getIconName = (type: SystemNotificationItem["type"]) => {
    switch (type) {
      case "security":
        return "shield-checkmark-outline";
      case "announcement":
        return "megaphone-outline";
      case "welcome":
        return "sparkles-outline";
      default:
        return "information-circle-outline";
    }
  };

  // Helper untuk menentukan warna ikon background lingkaran kecil
  const getIconColor = (type: SystemNotificationItem["type"]) => {
    switch (type) {
      case "security":
        return "#FF3B30"; 
      case "announcement":
        return "#5F4BB6"; 
      case "welcome":
        return "#FFCC00"; 
      default:
        return "#8E8E93";
    }
  };

  const renderItem = useCallback(({ item }: { item: SystemNotificationItem }) => {
    // Menentukan style container dinamis berdasarkan status dibaca
    const cardStyle: ViewStyle[] = [styles.card];
    if (!item.isRead) {
      cardStyle.push(styles.unreadCard);
    }

    return (
      <Pressable 
        style={cardStyle}
        onPress={() => alert(`Detail Notifikasi: ${item.title}`)}
      >
        {/* Kiri: Lingkaran Badge Ikon */}
        <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + "15" }]}>
          <Ionicons name={getIconName(item.type)} size={22} color={getIconColor(item.type)} />
        </View>

        {/* Tengah ke Kanan: Konten Teks Pesan */}
        <View style={styles.contentContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.bodyText} numberOfLines={2}>
            {item.body}
          </Text>
        </View>

        {/* Titik indikator jika notifikasi belum dibaca */}
        {!item.isRead && <View style={styles.unreadDot} />}
      </Pressable>
    );
  }, []);

  return (
    <Screen scrollable={false}>
      {/* Header Halaman dengan Tombol Back */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifikasi Sistem</Text>
        <View style={styles.headerSpacer} /> 
      </View>

      {/* List Daftar Info Sistem */}
      <FlatList
        data={dummySystemNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Kotak masuk notifikasi Anda kosong.</Text>
          </View>
        }
      />
    </Screen>
  );
}

// Mendefinisikan tipe objek StyleSheet secara eksplisit agar aman dari penyeberangan tipe style
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
  } as ViewStyle,
  backButton: {
    padding: 2,
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  } as TextStyle,
  headerSpacer: {
    width: 24,
  } as ViewStyle,
  listContent: {
    paddingVertical: 8,
  } as ViewStyle,
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f9f9f9",
    backgroundColor: "#fff",
  } as ViewStyle,
  unreadCard: {
    backgroundColor: "#F9F8FF", 
  } as ViewStyle,
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  contentContainer: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 8,
  } as ViewStyle,
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between", // Fixed: Diubah dari "between" menjadi "space-between"
    alignItems: "center",
    marginBottom: 4,
  } as ViewStyle,
  titleText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
  } as TextStyle,
  timeText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: "#8e8e93",
    marginLeft: 6,
  } as TextStyle,
  bodyText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "#666",
    lineHeight: 18,
  } as TextStyle,
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5F4BB6", 
    marginLeft: 4,
  } as ViewStyle,
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  emptyText: {
    marginTop: 12,
    fontFamily: Fonts.medium,
    color: "#8e8e93",
  } as TextStyle,
});