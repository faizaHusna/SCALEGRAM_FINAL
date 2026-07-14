import { Colors } from "@/core/theme/colors";
import Screen from "@/presentation/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";

// 💡 IMPORT BARU: Untuk fitur salin teks ke clipboard sistem
import * as Clipboard from 'expo-clipboard';

// IMPORT EXPO-VIDEO
import { useVideoPlayer, VideoView } from 'expo-video';

// IMPORT STYLES
import { styles } from "@/domain/style/ChatRoomStyles";

interface MessageItem {
  id: string;
  sender: "me" | "them";
  text?: string; 
  mediaUrl?: string; 
  mediaType?: "image" | "video";
  time: string;
}

// KOMPONEN VIDEO
const ChatVideoBubble = ({ videoUri }: { videoUri: string }) => {
  const player = useVideoPlayer(videoUri, (playerInstance) => {
    playerInstance.loop = false; 
    playerInstance.muted = false;
  });

  return (
    <VideoView
      style={{ width: 220, height: 160, borderRadius: 14 }}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
    />
  );
};

export default function ChatRoomScreen() {
  
  const router = useRouter();
  
  const { nickname, avatarUrl, initialMessage } = useLocalSearchParams<{ 
    nickname: string; 
    avatarUrl: string; 
    initialMessage?: string; 
  }>();
 
  const [messages, setMessages] = useState<MessageItem[]>([
    { id: "m1", sender: "them", text: "Halo bro!", time: "10:00" },
    { id: "m2", sender: "them", text: "P, besok kumpul kelompok jam berapa ya?", time: "10:01" },
    { id: "m3", sender: "me", text: "Halo juga! Jam 10 pagi di perpus gimana?", time: "10:03" },
  ]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // STATE MANAGEMENT GALERI & AKSI CHAT
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // 💡 STATE BARU: Menyimpan chat aktif yang sedang ditekan lama untuk dimanipulasi
  const [menuTargetMessage, setMenuTargetMessage] = useState<MessageItem | null>(null);

  useEffect(() => {
    if (initialMessage) {
      setInputText(initialMessage);
    }
  }, [initialMessage]);

  const appendMessage = (payload: Partial<MessageItem>) => {
    const newMessage: MessageItem = {
      id: `m-${Date.now()}`,
      sender: "me",
      time: "Sekarang",
      ...payload,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;
    appendMessage({ text: inputText });
    setInputText("");
  };

  // 💡 FUNGSI AKSI MANAJEMEN CHAT
  const handleCopyText = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setMenuTargetMessage(null);
    Alert.alert("Berhasil", "Pesan teks disalin ke papan klip.");
  };

  const handleDeleteMessage = (id: string) => {
    Alert.alert("Hapus Pesan", "Apakah kamu yakin ingin menghapus pesan ini?", [
      { text: "Batal", style: "cancel" },
      { 
        text: "Hapus", 
        style: "destructive", 
        onPress: () => {
          setMessages((prev) => prev.filter((msg) => msg.id !== id));
          setMenuTargetMessage(null);
        }
      }
    ]);
  };

  const handleForwardMessage = (item: MessageItem) => {
  setMenuTargetMessage(null);
  
  // 💡 Navigasi ke halaman pilih kontak dengan melempar data pesan sebagai parameter
  router.push({
    pathname: "/chat/forward-select", // 👈 Sesuaikan dengan jalur folder router Anda
    params: {
      forwardText: item.text || "",
      forwardMediaUrl: item.mediaUrl || "",
      forwardMediaType: item.mediaType || "",
    }
  });
};
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Izin Ditolak", "Aplikasi memerlukan izin kamera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      appendMessage({
        mediaUrl: asset.uri,
        mediaType: asset.type === "video" ? "video" : "image",
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      appendMessage({
        mediaUrl: asset.uri,
        mediaType: asset.type === "video" ? "video" : "image",
      });
    }
  };

  const renderItem = useCallback(({ item }: { item: MessageItem }) => {
    const isMe = item.sender === "me";
    const hasMedia = !!item.mediaUrl;

    return (
      // 💡 PERBAIKAN: Setiap baris chat dibungkus Pressable dengan onLongPress agar memicu menu pilihan aksi
      <Pressable 
        onLongPress={() => setMenuTargetMessage(item)}
        delayLongPress={250} // Kecepatan respons durasi tekan lama
        style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}
      >
        {hasMedia ? (
          item.mediaType === "image" ? (
            <Pressable 
              onPress={() => setSelectedImage(item.mediaUrl || null)}
              onLongPress={() => setMenuTargetMessage(item)}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }, styles.mediaMessageWrapper]}
            >
              <Image 
                source={{ uri: item.mediaUrl }} 
                style={styles.chatMediaDisplay}
                contentFit="cover"
              />
            </Pressable>
          ) : (
            <View style={styles.mediaMessageWrapper}>
              <ChatVideoBubble videoUri={item.mediaUrl!} />
            </View>
          )
        ) : (
          <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
            <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
              {item.text}
            </Text>
          </View>
        )}
      </Pressable>
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} 
    >
      <Screen scrollable={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </Pressable>
           
          {avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
          <Text style={styles.headerTitle}>{nickname || "Teman Chat"}</Text>
        </View>

        {/* Daftar Chat */}
        <FlatList
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Kolom Input Bar */}
        <View style={styles.inputContainer}>
          <Pressable onPress={takePhoto} style={{ marginRight: 8, padding: 4 }}>
            <Ionicons name="camera-outline" size={24} color="#8A8A8A" />
          </Pressable>

          <Pressable onPress={pickImage} style={{ marginRight: 10, padding: 4 }}>
            <Ionicons name="image-outline" size={24} color="#8A8A8A" />
          </Pressable>

          <TextInput
            placeholder="Ketik pesan..."
            placeholderTextColor="#8A8A8A"
            style={[styles.textInput, { flex: 1 }]}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
            
          <Pressable style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={16} color="#fff" />
          </Pressable>
        </View>
      </Screen>

      {/* MODAL 1: Pratinjau Gambar Full Screen */}
      <Modal visible={!!selectedImage} transparent={true} animationType="fade" onRequestClose={() => setSelectedImage(null)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.95)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectedImage(null)}>
          <Pressable style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 }} onPress={() => setSelectedImage(null)}>
            <Ionicons name="close-circle" size={36} color="#ffffff" />
          </Pressable>
          {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '80%' }} contentFit="contain" />}
        </Pressable>
      </Modal>

      {/* 💡 MODAL 2 BARU: Contextual Action Menu (Muncul Saat Chat Ditekan Lama) */}
      <Modal
        visible={!!menuTargetMessage}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuTargetMessage(null)}
      >
        <Pressable 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }} 
          onPress={() => setMenuTargetMessage(null)}
        >
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}>
            <Text style={{ fontSize: 14, color: '#8A8A8A', textAlign: 'center', marginBottom: 15 }}>Pilih Aksi Pesan</Text>
            
            {/* Opsi Salin: Hanya tampil jika pesan memiliki komponen teks */}
            {menuTargetMessage?.text && (
              <Pressable 
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' }}
                onPress={() => handleCopyText(menuTargetMessage.text!)}
              >
                <Ionicons name="copy-outline" size={22} color="#333" style={{ marginRight: 15 }} />
                <Text style={{ fontSize: 16, color: '#333' }}>Salin Teks</Text>
              </Pressable>
            )}

            {/* Opsi Kirim ke Yang Lain / Teruskan */}
            <Pressable 
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' }}
              onPress={() => handleForwardMessage(menuTargetMessage!)}
            >
              <Ionicons name="arrow-redo-outline" size={22} color="#333" style={{ marginRight: 15 }} />
              <Text style={{ fontSize: 16, color: '#333' }}>Teruskan Pesan</Text>
            </Pressable>

            {/* Opsi Hapus */}
            <Pressable 
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}
              onPress={() => handleDeleteMessage(menuTargetMessage!.id)}
            >
              <Ionicons name="trash-outline" size={22} color="#FF3B30" style={{ marginRight: 15 }} />
              <Text style={{ fontSize: 16, color: '#FF3B30', fontWeight: '600' }}>Hapus Pesan</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}