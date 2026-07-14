import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Shadows } from "@/core/theme/shadows";
import { Post } from "@/domain/entities/Post";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { Menu } from 'react-native-paper';



interface Props {
  post: Post;
  currentUserId?: string;
  isActive?: boolean;
  onLikeToggle?: (postId: string) => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onEditPress?: (postId: string) => void;
  onDeletePress?: (postId: string) => void;
  onReportPress?: (postId: string) => Promise<void>;
}

export const POST_CARD_HEIGHT = 480;

// Sub-komponen Video Player (Sudah benar di luar komponen utama)
const PostVideoPlayer = ({ videoUri, isActive }: { videoUri: string; isActive: boolean }) => {
  const player = useVideoPlayer(videoUri, (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.muted = false;
  });

  const { status } = useEvent(player, "statusChange", { status: player.status });

  useEffect(() => {
    if (!player) return;

    if (isActive && status === "readyToPlay") {
      player.play();
    } else if (!isActive) {
      player.pause();
    }
  }, [status, isActive, player]);

  const isLoading = status === "loading";

  return (
    <View style={styles.videoContainer}>
      <VideoView
        style={styles.image}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls={true}
      />
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="small" color="#5C5CFF" />
        </View>
      )}
    </View>
  );
};

// Komponen Utama (Diexport sebagai PostCard agar cocok dengan FeedContent)
const PostCardComponent = ({
  post,
  currentUserId,
  isActive = false,
  onLikeToggle,
  onCommentPress,
  onSharePress,
  onEditPress,
  onDeletePress,
  onReportPress,
}: Props) => {
  if (!post) return null;

  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const isOwnPost = currentUserId === post.userId;

  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const [likesCountLocal, setLikesCountLocal] = useState(0);
  const [isSavedLocal, setIsSavedLocal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const lastTap = useRef<number>(0);

  // =========================================================================
  // 💡 FUNGSI-FUNGSI MENU SEKARANG DI SINI (Bisa akses state & props)
  // =========================================================================
  const handleSaveToGallery = async () => {
    if (!post.imageUrl) {
      Alert.alert("Gagal", "Tidak ada media yang bisa disimpan.");
      return;
    }

    try {
      // 1. Minta izin akses ke galeri pengguna
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Izin Ditolak", "Aplikasi membutuhkan akses galeri untuk menyimpan gambar/video.");
        return;
      }

      setIsDownloading(true);

      // 2. Tentukan ekstensi file berdasarkan url asli
      const urlPath = post.imageUrl.split('?')[0];
      const fileExtension = urlPath.split('.').pop() || 'jpg';
      const filename = `ScaleGram_${post.id || Date.now()}.${fileExtension}`;

      // Jalur penyimpanan sementara internal aplikasi
      const localFileUri = `${(FileSystem as any).documentDirectory}${filename}`;

      // 3. Proses unduh dari internet ke penyimpanan lokal sementara
      const downloadResult = await (FileSystem as any).downloadAsync(post.imageUrl, localFileUri);

      if (downloadResult.status === 200) {
        // 4. Masukkan file lokal sementara tersebut ke Galeri Foto HP resmi
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        Alert.alert("Berhasil", "Media telah disimpan ke galeri ponsel Anda!");
      } else {
        throw new Error("Gagal mengunduh file.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal Menyimpan", "Terjadi kendala saat mengunduh media.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareLinkMenu = async () => {
    try {
      await Share.share({
        message: `Lihat postingan dari @${post.username || 'user'} di ScaleGram:\n"${post.caption || ''}"\n\nLink: ${post.imageUrl || ''}`,
      });
    } catch (error) {
      console.log("Gagal membagikan tautan:", error);
    }
  };

  const handleReportPostMenu = () => {
    Alert.alert(
      "Laporkan Postingan",
      "Apakah Anda yakin ingin melaporkan postingan ini karena melanggar panduan komunitas?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Laporkan",
          style: "destructive",
          onPress: async () => {
            try {
              if (onReportPress) {
                await onReportPress(post.id);
              }
              Alert.alert("Laporan Diterima", "Terima kasih, kami akan meninjau postingan ini dalam 24 jam.");
            } catch (error) {
              Alert.alert("Gagal", "Gagal mengirim laporan. Silakan coba lagi nanti.");
            }
          }
        }
      ]
    );
  };
  // =========================================================================

  useEffect(() => {
    const isLiked = !!(currentUserId && Array.isArray(post.likes) && post.likes.includes(currentUserId));
    const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;

    setIsLikedLocal(isLiked);
    setLikesCountLocal(likesCount);
  }, [post.likes, currentUserId]);

  const handleLike = useCallback(async () => {
  const previousStatus = isLikedLocal;
  const newStatus = !previousStatus;

  // 1. Optimistic Update (Update UI dulu agar terasa instan)
  setIsLikedLocal(newStatus);
  setLikesCountLocal((prev) => (newStatus ? prev + 1 : prev - 1));

  try {
    // 2. Panggil fungsi API/Repository (yang bersifat async)
    if (onLikeToggle) {
      await onLikeToggle(post.id);
    }
  } catch (error) {
    // 3. Rollback jika API gagal (User tidak akan merasa UI bohong)
    console.error("Gagal melakukan like:", error);
    setIsLikedLocal(previousStatus);
    setLikesCountLocal((prev) => (previousStatus ? prev + 1 : prev - 1));
  }
}, [isLikedLocal, post.id, onLikeToggle]);

  const handleDoubleTap = useCallback(() => {
  const now = Date.now();
  const DOUBLE_PRESS_DELAY = 300;

  if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
    // Double tap terdeteksi!
    
    // Hanya Like jika status saat ini belum di-like
    if (!isLikedLocal) {
      handleLike();
    }
    
    // Tampilkan animasi hati besar
    setShowBigHeart(true);
    
    // Gunakan clearTimeout jika ada timer yang berjalan agar tidak tumpang tindih
    setTimeout(() => {
      setShowBigHeart(false);
    }, 800);
    
    // Reset lastTap agar tidak terhitung lagi dalam waktu singkat
    lastTap.current = 0; 
  } else {
    lastTap.current = now;
  }
}, [isLikedLocal, handleLike]);

  const navigateToProfile = useCallback(() => {
    if (post.username) {
      router.push(`/profile/${post.username}` as any);
    }
  }, [post.username, router]);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.user} onPress={navigateToProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.username?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <View>
            <Text style={styles.username}>{post.username || "Anonymous"}</Text>
            <Text style={styles.time}>Just now</Text>
          </View>
        </Pressable>

        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Pressable onPress={() => setVisible(true)} style={{ padding: 4 }}>
              <Ionicons name="ellipsis-horizontal" size={22} color="#8B8B8B" />
            </Pressable>
          }
          contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: 16 }}
        >
          <Menu.Item
            onPress={() => { setVisible(false); handleSaveToGallery(); }}
            title={isDownloading ? "Mengunduh..." : "Simpan ke Galeri"}
            disabled={isDownloading}
            titleStyle={styles.menuItemText}
          />
          <Menu.Item
            onPress={() => { setVisible(false); handleShareLinkMenu(); }}
            title="Bagikan Tautan"
            titleStyle={styles.menuItemText}
          />

          {isOwnPost ? (
            <>
              <Menu.Item onPress={() => { setVisible(false); onEditPress?.(post.id); }} title="Edit Postingan" titleStyle={styles.menuItemText} />
              <Menu.Item onPress={() => { setVisible(false); onDeletePress?.(post.id); }} title="Hapus Postingan" titleStyle={[styles.menuItemText, { color: '#FF3B30' }]} />
            </>
          ) : (
            <Menu.Item
              onPress={() => { setVisible(false); handleReportPostMenu(); }}
              title="Laporkan"
              titleStyle={[styles.menuItemText, { color: '#FF3B30' }]}
            />
          )}
        </Menu>
      </View>

      {/* AREA MEDIA */}
      {post.imageUrl ? (
        post.mediaType === 'video' ||
          post.imageUrl.endsWith('.mp4') ||
          post.imageUrl.endsWith('.mov') ||
          post.imageUrl.endsWith('.webm') ? (

          <PostVideoPlayer videoUri={post.imageUrl} isActive={isActive} />

        ) : (
          <Pressable onPress={handleDoubleTap} style={styles.mediaContainer}>
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.image}
              contentFit="cover"
              placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
              cachePolicy="memory-disk"
              transition={200}
            />
            {showBigHeart && (
              <View style={styles.heartOverlay}>
                <Ionicons name="heart" size={80} color="rgba(255, 255, 255, 0.9)" />
              </View>
            )}
          </Pressable>
        )
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={55} color="#BDBDBD" />
          <Text style={styles.placeholder}>No Image</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable onPress={handleLike} style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name={isLikedLocal ? "heart" : "heart-outline"} size={24} color={isLikedLocal ? "#FF3B30" : "#222"} />
        </Pressable>
        <Pressable onPress={onCommentPress} style={({ pressed }) => [styles.actionButton, styles.actionGap, { opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name="chatbubble-outline" size={23} color="#222" />
        </Pressable>
        <Pressable onPress={onSharePress} style={({ pressed }) => [styles.actionButton, styles.actionGap, { opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name="paper-plane-outline" size={23} color="#222" />
        </Pressable>
        <View style={styles.flexSpacer} />
        <Pressable onPress={() => setIsSavedLocal(!isSavedLocal)} style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name={isSavedLocal ? "bookmark" : "bookmark-outline"} size={23} color={isSavedLocal ? "#000" : "#222"} />
        </Pressable>
      </View>

      <Text style={styles.likes}>{likesCountLocal} Likes</Text>
      <Text style={styles.caption}>
        <Text style={styles.captionUser}>{post.username || "Anonymous"}</Text> {post.caption || ""}
      </Text>
    </View>
  );
};

export const PostCard = memo(PostCardComponent);

export default memo(PostCardComponent, (prev, next) => {
  return (
    prev.post.id === next.post.id &&
    prev.isActive === next.isActive &&
    prev.post.likes?.length === next.post.likes?.length &&
    prev.post.imageUrl === next.post.imageUrl &&
    prev.post.username === next.post.username &&
    prev.currentUserId === next.currentUserId &&
    prev.onCommentPress === next.onCommentPress &&
    prev.onSharePress === next.onSharePress &&
    prev.onEditPress === next.onEditPress &&
    prev.onDeletePress === next.onDeletePress &&
    prev.onReportPress === next.onReportPress
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 18,
    marginBottom: 24,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EFE8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.primary,
  },
  username: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.light.text,
  },
  time: {
    marginTop: 2,
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: "#999",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 22,
    marginBottom: 18,
  },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    borderRadius: 22,
    backgroundColor: "#F4F5F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  placeholder: {
    marginTop: 10,
    fontFamily: Fonts.medium,
    color: "#9A9A9A",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  actionButton: {
    padding: 4,
  },
  actionGap: {
    marginLeft: 11,
  },
  flexSpacer: {
    flex: 1,
  },
  likes: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 8,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 22,
  },
  captionUser: {
    fontFamily: Fonts.bold,
  },
  menuItemText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#222'
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
  },
  heartOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  videoContainer: {
    width: '100%',
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});