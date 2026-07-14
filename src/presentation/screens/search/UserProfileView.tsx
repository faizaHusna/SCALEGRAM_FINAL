// FILE: src/presentation/components/UserProfileView.tsx
import { Fonts } from "@/core/theme/fonts";
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from "expo-router"; // 💡 Tambahkan ini
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface UserProfileViewProps {
  user: any;
  onClose: () => void;
  onSendMessage: (username: string, initialMessage?: string) => void;
  onToggleFollow?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ user, onClose, onSendMessage, onToggleFollow }) => {
  const router = useRouter(); // 💡 Inisialisasi router

  const handleMessagePress = () => {
    const templateText = user.isFollowing ? "" : "Halo 😼";
    onSendMessage(user.username, templateText);
  };

  const goToFullProfile = () => {
    onClose(); // Tutup bottom sheet
    // 💡 Diperbaiki agar mengarah ke folder /profile/
    router.push(`/profile/${user.username}` as any); 
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backBtn}>
          <Ionicons name="arrow-down" size={24} color="#000" />
        </Pressable>
        <Text style={styles.username}>@{user.username}</Text>
        <Pressable onPress={handleMessagePress} style={styles.backBtn}>
          <Ionicons name="paper-plane-outline" size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Info Profil */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} cachePolicy="memory-disk" />
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user.posts?.length || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user.followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user.followingCount || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.name}>{user.fullName || user.name}</Text>
          <Text style={styles.bio}>{user.bio || "Belum ada bio."}</Text>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.actionRow}>
          <Pressable onPress={onToggleFollow} style={[styles.followBtn, user.isFollowing && styles.followingBtn]}>
            <Text style={[styles.followText, user.isFollowing && styles.followingText]}>
              {user.isFollowing ? "Diikuti" : "Ikuti"}
            </Text>
          </Pressable>
          <Pressable onPress={handleMessagePress} style={styles.msgBtn}>
            <Text style={styles.msgText}>Kirim Pesan</Text>
          </Pressable>
        </View>

        <Text style={styles.recent}>Kiriman Terbaru</Text>

        {/* 💡 Grid Postingan Preview (Dibatasi 6 foto saja) */}
        <View style={styles.grid}>
          {user.posts?.slice(0, 6).map((p: any) => (
            <Image key={p.id} source={{ uri: p.imageUrl }} style={styles.postImg} cachePolicy="memory-disk" />
          ))}
        </View>

        {/* 💡 Tombol Lihat Profil Lengkap */}
        <Pressable style={styles.fullProfileBtn} onPress={goToFullProfile}>
            <Text style={styles.fullProfileBtnText}>Lihat Profil Lengkap</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullProfileBtn: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  fullProfileBtnText: {
    color: '#5C5CFF',
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  backBtn: {
    padding: 4,
  },
  username: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#5C5CFF', // Outline biru elegan sesuai SearchScreen
  },
  stats: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#8E8E93',
    marginTop: 2,
  },
  bioContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  bio: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333',
    marginTop: 4,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  followBtn: {
    flex: 1,
    backgroundColor: '#5C5CFF', // Tombol biru serasi dengan list account
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingBtn: {
    backgroundColor: '#E5E5EA',
  },
  followText: {
    color: '#fff',
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  followingText: {
    fontFamily: Fonts.bold,
    color: '#000',
  },
  msgBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgText: {
    color: '#333',
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  recent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8A8A',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    gap: 4,
  },
  postImg: {
    width: (width - 36) / 3, // Otomatis membagi layar jadi 3 kolom presisi
    aspectRatio: 1,
    borderRadius: 4,
  },
});