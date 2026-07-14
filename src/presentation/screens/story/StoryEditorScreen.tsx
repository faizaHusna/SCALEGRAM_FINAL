import { Colors } from "@/core/theme/colors";
import { Fonts } from '@/core/theme/fonts';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from "@gorhom/bottom-sheet"; // 👈 Ditambahkan untuk modal stiker
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList // 👈 Ditambahkan untuk grid emoji
  ,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StoryRepositoryImpl } from "@/data/repositories/StoryRepositoryImpl";
import { UploadStoryUseCase } from "@/domain/usecases/UploadStoryUseCase";
import { useAuthStore } from "@/store/authStore";

// DAFTAR STIKER EMOJI
const EMOJI_LIST = ['😀', '😂', '🥰', '😍', '🔥', '👏', '🙌', '🎉', '✨', '💯', '❤️', '👑', '🚀', '🍕', '💩', '👻'];

export default function StoryEditorScreen() {
  const router = useRouter();
  const { mediaUri } = useLocalSearchParams();
  const [isUploading, setIsUploading] = useState(false);

  const [storyText, setStoryText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // STATE DAN REF UNTUK STIKER EMOJI (Sudah dipindahkan ke kamar yang benar)
  const emojiBottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const snapPoints = useMemo(() => ['40%'], []);

  const { user } = useAuthStore();

  const storyRepository = new StoryRepositoryImpl();
  const uploadStoryUseCase = new UploadStoryUseCase(storyRepository);

  const handleUploadStory = async () => {
    setIsUploading(true);
    try {
      await uploadStoryUseCase.execute(
        mediaUri as string,
        user?.id || "my_uid",
        "Your Story",
        user?.avatarUrl || "https://i.pravatar.cc/100",
        storyText 
      );

      alert("Story berhasil diunggah!");
      router.dismissAll();
    } catch (error) {
      console.error(error);
      alert("Gagal mengunggah story.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image / Video */}
      <Image source={{ uri: mediaUri as string }} style={styles.previewImage} />

      {/* Top Controls */}
      <View style={styles.topControls}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="close" size={32} color="#FFF" />
        </Pressable>
        <View style={styles.rightIcons}>
          <Pressable onPress={() => setIsTyping(true)} style={styles.iconBtn}>
            <Ionicons name="text" size={28} color={isTyping ? Colors.light.primary : "#FFF"} />
          </Pressable>
          <Pressable onPress={() => emojiBottomSheetRef.current?.present()} style={styles.iconBtn}>
            <Ionicons name="happy-outline" size={28} color="#FFF" />
          </Pressable>
        </View>
      </View>

      {/* Menampilkan Stiker Emoji Melayang di Atas Gambar */}
      {selectedEmoji && !isTyping && (
        <View style={styles.emojiOverlayContainer}>
          <Text style={styles.floatingEmoji}>{selectedEmoji}</Text>
        </View>
      )}

      {/* Menampilkan Teks Hasil Ketikan di Tengah Layar */}
      {storyText.length > 0 && !isTyping && (
        <View style={styles.textOverlayContainer}>
          <Text style={styles.storyTextDisplay}>{storyText}</Text>
        </View>
      )}

      {/* Inputan Asli yang muncul saat mau mengetik */}
      {isTyping && (
        <View style={styles.typingOverlay}>
          <TextInput
            value={storyText}
            onChangeText={setStoryText}
            placeholder="Ketik sesuatu..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.mainTextInput}
            autoFocus={true}
            onSubmitEditing={() => setIsTyping(false)}
            onBlur={() => setIsTyping(false)}
          />
        </View>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <Pressable style={styles.bottomBtn} onPress={handleUploadStory} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Image source={{ uri: user?.avatarUrl || 'https://i.pravatar.cc/100' }} style={styles.smallAvatar} />
              <Text style={styles.btnText}>Your Story</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Bottom Sheet Menu Pilihan Emoji */}
      <BottomSheetModal
        ref={emojiBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: '#1C1C1E' }}
        handleIndicatorStyle={{ backgroundColor: '#FFFFFF' }}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Pilih Stiker</Text>
          <FlatList
            data={EMOJI_LIST}
            numColumns={4}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.emojiItem}
                onPress={() => {
                  setSelectedEmoji(item);
                  emojiBottomSheetRef.current?.dismiss();
                }}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  previewImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 16 },
  topControls: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, zIndex: 20 },
  rightIcons: { flexDirection: 'row', gap: 16 },
  iconBtn: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 4, elevation: 5 },
  bottomControls: { position: 'absolute', bottom: 30, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', zIndex: 20 },
  bottomBtn: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, width: 140, justifyContent: 'center' },
  smallAvatar: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  btnText: { fontFamily: Fonts.semiBold, color: '#000', fontSize: 14 },
  sendBtn: { backgroundColor: '#FFF', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  
  // STYLES BARU UNTUK OVERLAY EMOJI MELAYANG
  emojiOverlayContainer: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  floatingEmoji: {
    fontSize: 85,
  },

  textOverlayContainer: {
    position: 'absolute',
    top: '45%',
    left: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  storyTextDisplay: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Fonts.medium,
  },
  typingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 30,
  },
  mainTextInput: {
    width: '100%',
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    fontFamily: Fonts.medium,
  },

  // STYLES BARU UNTUK BOTTOM SHEET MENU GRID
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  emojiItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 4,
  },
  emojiText: {
    fontSize: 42,
  },
});