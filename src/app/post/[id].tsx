// FILE: src/app/post/[id].tsx (FIXED - CLEAN ARCHITECTURE & HIGH PERFORMANCE)
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler"; //  Solusi jitu untuk Android
import { SafeAreaView } from "react-native-safe-area-context";


import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { CommentBottomSheet } from "@/presentation/components/CommentBottomSheet"; // Sesuaikan dengan BottomSheetModal di dalamnya
import PostCard from "@/presentation/components/PostCard";
import { ShareToDMBottomSheet } from "@/presentation/components/ShareToDMBottomSheet";

// Import Custom Hook Clean Architecture (Pilihan terbaik untuk performa nyata)
import { useGetPostById } from "@/hooks/post/useGetPostById";

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // 1. Menggunakan BottomSheetModal untuk menghindari kalkulasi layout saat transisi navigasi
    const commentSheetRef = useRef<BottomSheetModal>(null);
    const shareSheetRef = useRef<BottomSheetModal>(null);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // 2. Gunakan Custom Hook untuk mengambil data real via Clean Architecture
    // Jika data tidak ada, kita bisa fallback ke local/cache data dummy secara aman
    const { post, isLoading, error } = useGetPostById(id);

    // 3. Menghindari pembuatan objek baru pada setiap render dengan useMemo (Penyebab re-render & lagging)
    const fallbackPostData = useMemo(() => {
        return {
            id: id || "",
            userId: "user_explore_123",
            username: "explore_user",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500", // Default fallback
            caption: "Loading post...",
            likes: ["user1"],
            comments: 0,
            createdAt: 1719999999000, // Timestamp konstan untuk mencegah instabilitas referensial
        };
    }, [id]);

    const activePostData = post || fallbackPostData;

    // 4. Mencegah re-instantiation callbacks dengan useCallback
    const handleCommentPress = useCallback(() => {
        if (!id) return;
        setSelectedPostId(id);
        // Membuka BottomSheetModal dengan present() jauh lebih aman & tidak memicu layout loop di awal navigasi
        commentSheetRef.current?.present();
    }, [id]);

    const handleSharePress = useCallback(() => {
        if (!id) return;
        setSelectedPostId(id);
        shareSheetRef.current?.present();
    }, [id]);

    const handleLikeToggle = useCallback((postId: string) => {
        console.log("Post liked in detail screen:", postId);
        // Panggil usecase / store Anda di sini
    }, []);

    return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#222" />
                        </Pressable>
                        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>Explore Post</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.light.primary} />
                            <Text style={styles.loadingText}>Loading post details...</Text>
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <PostCard
                                post={activePostData}
                                currentUserId="my_current_user_id"
                                onLikeToggle={handleLikeToggle}
                                onCommentPress={handleCommentPress}
                                onSharePress={handleSharePress}
                            />
                        </ScrollView>
                    )}
                </SafeAreaView>

                {/* BottomSheetModal dipasang di root BottomSheetModalProvider */}
                <CommentBottomSheet ref={commentSheetRef} postId={selectedPostId} />
                <ShareToDMBottomSheet ref={shareSheetRef} postId={selectedPostId} />
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "#EFEFEF",
    },
    backButton: {
        padding: 2,
    },
    headerTitle: {
        fontSize: 16,
        color: "#222",
    },
    scrollContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontFamily: Fonts.medium,
        color: "#666",
        fontSize: 14,
    }
});