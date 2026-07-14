import { PostRepository } from '@/data/repositories/PostRepository';
import { AuthState, useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'; // 👈 Kita hapus Platform dan Safe Area

interface CommentBottomSheetProps {
  postId: string | null;
}

export const CommentBottomSheet = forwardRef<BottomSheetModal, CommentBottomSheetProps>(
  ({ postId }, ref) => {
    const [commentText, setCommentText] = useState('');
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    const postRepository = useMemo(() => new PostRepository(), []);
    const user = useAuthStore((state: AuthState) => state.user);

    const currentUserId = user?.id ?? '';
    const currentUserUsername = user?.username ?? 'Guest';

    // Simulasi data komentar - Nantinya ini diambil dari API/Firebase berdasarkan postId
    const comments = useMemo(() => [
      { id: '1', user: 'budi', text: 'Keren banget fotonya!' },
      { id: '2', user: 'siti', text: 'Lokasi di mana ini?' },
    ], [postId]);

    const handleSendComment = async () => {
      if (commentText.trim().length === 0) return;

      try {
        // Pastikan Anda sudah punya instance PostRepository
        await postRepository.addComment(
          postId!,
          currentUserId,
          currentUserUsername,
          commentText
        );

        setCommentText(''); // Bersihkan input
        // Opsional: Refresh daftar komentar di sini
      } catch (error) {
        Alert.alert("Gagal", "Tidak dapat mengirim komentar.");
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}

        keyboardBehavior="extend" // 👈 Mengubah ke "extend" memaksa sheet naik ke snap point tertinggi (90%) saat ngetik
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"

        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >

        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>Komentar</Text>

          {/* List Komentar */}
          <BottomSheetFlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.username}>{item.user}</Text>
                <Text>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />

          {/* 2. INPUT CONTAINER ANDROID (Sederhana tanpa Safe Area) 👇 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputContainer}>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Tambahkan komentar..."
              value={commentText}
              onChangeText={setCommentText}
              placeholderTextColor="#999"
            />
              <Pressable onPress={handleSendComment} style={styles.sendButton}>
                <Ionicons name="arrow-up" size={20} color="white" />
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingVertical: 10 },
  listContent: { paddingHorizontal: 20 },
  commentItem: { marginBottom: 15 },
  username: { fontWeight: 'bold', marginRight: 5 },
  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f1f1f1', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10 },
  sendButton: { backgroundColor: '#5C5CFF', borderRadius: 20, padding: 8 }
});