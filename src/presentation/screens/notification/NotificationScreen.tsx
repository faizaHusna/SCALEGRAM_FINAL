import { Colors } from "@/core/theme/colors";
import Screen from "@/presentation/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

// IMPORT STYLES
import { styles } from "@/domain/style/NotificationStyles";

interface SystemNotificationItem {
  id: string;
  type: "welcome" | "security" | "announcement";
  title: string;
  body: string;
  time: string;
  isRead: boolean;
}

const dummySystemNotifications: SystemNotificationItem[] = [
  {
    id: "sn-1",
    type: "security",
    title: "Percobaan Login Terdeteksi",
    body: "Akun Anda baru saja login melalui perangkat Windows - Lenovo pada pukul 13:30. Jika ini bukan Anda, segera periksa pengaturan keamanan Anda.",
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

  // 1. STATE BARU: Menyimpan ID notifikasi yang sedang dibuka (expanded)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getIconName = (type: SystemNotificationItem["type"]) => {
    switch (type) {
      case "security": return "shield-checkmark-outline";
      case "announcement": return "megaphone-outline";
      case "welcome": return "sparkles-outline";
      default: return "information-circle-outline";
    }
  };

  const getIconColor = (type: SystemNotificationItem["type"]) => {
    switch (type) {
      case "security": return "#FF3B30";
      case "announcement": return "#5F4BB6";
      case "welcome": return "#FFCC00";
      default: return "#8E8E93";
    }
  };

  const renderItem = useCallback(({ item }: { item: SystemNotificationItem }) => {
    // Cek apakah item ini adalah item yang sedang diklik/di-expand
    const isExpanded = expandedId === item.id;

    return (
      <Pressable
        style={[styles.card, !item.isRead && styles.unreadCard]}
        // 2. AKSI BARU: Jika ditekan, toggle state expandedId
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        {/* Kiri: Lingkaran Badge Ikon */}
        <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + "15" }]}>
          <Ionicons name={getIconName(item.type)} size={22} color={getIconColor(item.type)} />
        </View>

        {/* Tengah ke Kanan: Konten Teks Pesan */}
        <View style={styles.contentContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.titleText}>{item.title}</Text>
            
            {/* 3. TAMPILAN BARU: Menggabungkan waktu dengan ikon panah (chevron) */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.timeText}>{item.time}</Text>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#8A8A8A" 
                style={{ marginLeft: 4 }} 
              />
            </View>
          </View>
          
          {/* 4. LOGIKA BARU: Jika isExpanded true, hilangkan batasan baris */}
          <Text 
            style={styles.bodyText} 
            numberOfLines={isExpanded ? undefined : 2}
          >
            {item.body}
          </Text>
        </View>

        {/* Titik indikator jika notifikasi belum dibaca */}
        {!item.isRead && <View style={styles.unreadDot} />}
      </Pressable>
    );
  }, [expandedId]); // Pastikan expandedId masuk ke dependency array

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