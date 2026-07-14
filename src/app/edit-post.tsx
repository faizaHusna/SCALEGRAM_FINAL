import { useAutoRefresh } from '@/context/ActivityContext'; // 💡 1. Impor hook jalan pintas
import { Colors } from '@/core/theme/colors';
import { Fonts } from '@/core/theme/fonts';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostRepository } from "@/data/repositories/PostRepository";

export default function EditPostScreen() {
    const refreshProps = useAutoRefresh(); // 💡 2. Panggil hook-nya
    const router = useRouter();
    const { postId } = useLocalSearchParams();


    const [caption, setCaption] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);


    const postRepository = new PostRepository();

    // 1. Ambil data lama postingan berdasarkan postId saat halaman dibuka
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                setIsLoading(true);

                // CONTOH: Ambil data dari repository Anda
                // const post = await postRepository.getPostById(postId as string);
                // setCaption(post.caption || "");
                // setMediaUrl(post.imageUrl || "");

                // Dummy data untuk simulasi biar tidak error saat dicoba:
                setCaption("Ini caption lama yang mau diedit...");
                setMediaUrl("https://picsum.photos/400/400");

            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Gagal mengambil data postingan lama.");
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        if (postId) fetchPostDetails();
    }, [postId]);

    // 2. Fungsi untuk menyimpan perubahan caption ke server/database
    const handleUpdatePost = async () => {
        if (!caption.trim()) {
            Alert.alert("Peringatan", "Caption tidak boleh kosong!");
            return;
        }

        try {
            setIsUpdating(true);

            // Kirim ke database/API via UseCase
            await postRepository.updatePost(postId as string, caption);

            Alert.alert("Berhasil", "Postingan Anda telah diperbarui!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Gagal", "Gagal memperbarui postingan. Silakan coba lagi.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Memuat data...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Edit Postingan</Text>
                <Pressable onPress={handleUpdatePost} disabled={isUpdating}>
                    {isUpdating ? (
                        <ActivityIndicator size="small" color={Colors.light.primary} />
                    ) : (
                        <Text style={styles.saveBtnText}>Simpan</Text>
                    )}
                </Pressable>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Preview Media yang mau diedit */}
                    {mediaUrl ? (
                        <Image source={{ uri: mediaUrl }} style={styles.previewImage} contentFit="cover" />
                    ) : null}

                    {/* Bagian Input Teks Caption Baru */}
                    <Text style={styles.inputLabel}>Caption</Text>
                    <TextInput
                        style={styles.captionInput}
                        value={caption}
                        onChangeText={setCaption}
                        placeholder="Tulis caption baru Anda di sini..."
                        multiline
                        maxLength={2200}
                        textAlignVertical="top"

                        {...refreshProps}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
    loadingText: { marginTop: 10, fontFamily: Fonts.medium, color: '#666' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0'
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 16, fontFamily: Fonts.bold, color: '#000' },
    saveBtnText: { fontSize: 16, fontFamily: Fonts.semiBold, color: Colors.light.primary || '#208AEF' },
    scrollContent: { padding: 16, alignItems: 'center' },
    previewImage: { width: 120, height: 120, borderRadius: 8, marginBottom: 20 },
    inputLabel: { alignSelf: 'flex-start', fontSize: 14, fontFamily: Fonts.semiBold, color: '#333', marginBottom: 8 },
    captionInput: {
        width: '100%',
        height: 120,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: '#222',
        backgroundColor: '#FAFAFA'
    },
});