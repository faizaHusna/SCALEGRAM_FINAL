// FILE: src/app/post/[id].tsx (FIXED - CLEAN ARCHITECTURE & HIGH PERFORMANCE)
import { useAutoRefresh } from '@/context/ActivityContext'; // 💡 1. Impor hook jalan pintas
import { Ionicons } from "@expo/vector-icons"; // ✅ FIX 1: Pastikan pakai Expo Vector Icons
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { CommentBottomSheet } from "@/presentation/components/CommentBottomSheet";
import PostCard from "@/presentation/components/PostCard";
import { ShareToDMBottomSheet } from "@/presentation/components/ShareToDMBottomSheet";

// Import hook dan dependencies Clean Architecture
import { PostRepository } from "@/data/repositories/PostRepository"; // ✅ Tambahan untuk FIX 3
import { GetPostByIdUseCase } from "@/domain/usecases/getPostByIdUseCase"; // ✅ Tambahan untuk FIX 3
import { useGetPostById } from "@/hooks/post/useGetPostById";

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const refreshProps = useAutoRefresh(); // 💡 2. Panggil hook-nya

    const commentSheetRef = useRef<BottomSheetModal>(null);
    const shareSheetRef = useRef<BottomSheetModal>(null);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // ✅ FIX 3: Buat instance Repository & Use Case untuk disuplai ke dalam Hook
    const postRepository = useMemo(() => new PostRepository(), []);
    const getPostByIdUseCase = useMemo(() => new GetPostByIdUseCase(postRepository), [postRepository]);

    // ✅ FIX 2: Ubah 'isLoading' menjadi 'loading' agar sinkron dengan return type dari Hook asli Anda
    const { post, loading, error } = useGetPostById(getPostByIdUseCase, id);

    // Menghindari pembuatan objek baru pada setiap render dengan useMemo
    const fallbackPostData = useMemo(() => {
        return {
            id: id || "",
            userId: "user_explore_123",
            username: "explore_user",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500", 
            caption: "Loading post...",
            likes: ["user1"],
            comments: 0,
            createdAt: 1719999999000, 
        };
    }, [id]);

    const activePostData = post || fallbackPostData;

    const handleCommentPress = useCallback(() => {
        if (!id) return;
        setSelectedPostId(id);
        commentSheetRef.current?.present();
    }, [id]);

    const handleSharePress = useCallback(() => {
        if (!id) return;
        setSelectedPostId(id);
        shareSheetRef.current?.present();
    }, [id]);

    const handleLikeToggle = useCallback((postId: string) => {
        console.log("Post liked in detail screen:", postId);
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

                {/* ✅ FIX 2: Sesuaikan pengecekan kondisi loading menggunakan 'loading' */}
                {loading ? (
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