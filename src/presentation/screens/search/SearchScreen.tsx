import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import Screen from "@/presentation/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// --- 1. Definisi Tipe Data ---
interface ExplorePost {
    id: string;
    imageUrl: string;
    tags: string[]; // Tambahkan tags agar search berfungsi
}

const { width } = Dimensions.get("window");
const GRID_SIZE = width / 3;

// Data dummy dengan tags agar bisa difilter
const dummyExplorePosts: ExplorePost[] = [
    { id: "1", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300", tags: ["beach", "sea"] },
    { id: "2", imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300", tags: ["nature", "forest"] },
    { id: "3", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", tags: ["portrait", "fashion"] },
    { id: "4", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300", tags: ["portrait"] },
    { id: "5", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", tags: ["men", "nature"] },
    { id: "6", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300", tags: ["portrait"] },
];

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    // --- 2. Logika Pencarian ---
    const filteredPosts = useMemo(() => {
        if (!searchQuery) return dummyExplorePosts;
        return dummyExplorePosts.filter((post) =>
            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const renderGridItem = useCallback(({ item }: { item: ExplorePost }) => (
        <Pressable
            style={styles.gridItem}
            onPress={() => router.push(`/post/${item.id}` as any)}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
        </Pressable>
    ), [router]);

    return (
        <Screen scrollable={false}>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#8A8A8A" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search tags (e.g. 'beach', 'nature')..."
                        placeholderTextColor="#8A8A8A"
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery("")} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={18} color="#8A8A8A" />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Grid */}
            <FlatList
                data={filteredPosts}
                renderItem={renderGridItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.gridContent}
                // Menjaga agar item rapi di dalam baris
                columnWrapperStyle={styles.columnWrapper} 
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyText}>No results found.</Text>
                    </View>
                }
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    searchBarContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff" },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: { marginRight: 8 },
    input: { flex: 1, height: "100%", fontSize: 15, fontFamily: Fonts.regular, color: Colors.light.text },
    clearButton: { padding: 4 },
    gridContent: { paddingHorizontal: 2 },
    columnWrapper: { justifyContent: "flex-start" }, // Menjaga grid rata kiri
    gridItem: {
        width: GRID_SIZE - 4, // Sedikit lebih kecil agar ada ruang antar kolom
        height: GRID_SIZE - 4,
        margin: 1,
        backgroundColor: "#eee",
    },
    gridImage: { width: "100%", height: "100%" },
    emptyContainer: { marginTop: 80, alignItems: "center" },
    emptyText: { marginTop: 12, fontFamily: Fonts.medium, color: "#8e8e93" },
});