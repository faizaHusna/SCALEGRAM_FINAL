// SearchScreen.tsx

import { useAutoRefresh } from '@/context/ActivityContext'; // 💡 1. Impor hook jalan pintas
import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import Screen from "@/presentation/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View
} from "react-native";

import { AccountListItem } from "@/presentation/components/AccountListItem";
import { UserProfileView } from "@/presentation/screens/search/UserProfileView";
import { useRouter } from "expo-router";

// 💡 IMPORT FILE STYLING YANG BARU DIBUAT
import { styles } from "@/domain/style/SearchStyles";

interface ExplorePost {
    id: string;
    imageUrl: string;
    tags: string[];
}

export interface ExploreAccount {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    bio: string;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
    posts: Array<{
        id: string;
        imageUrl: string;
        likes: number;
        caption: string;
    }>;
}

const dummyExplorePosts: ExplorePost[] = [
    { id: "1", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", tags: ["beach", "sea"] },
    { id: "2", imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", tags: ["nature", "forest"] },
    { id: "3", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", tags: ["portrait", "fashion"] },
    { id: "4", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", tags: ["portrait"] },
    { id: "5", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", tags: ["men", "nature"] },
    { id: "6", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", tags: ["portrait"] },
];

const TRENDING_TAGS = [
    { name: "beach", icon: "water-outline", fontfamily: Fonts.semiBold, label: "Pantai" },
    { name: "nature", icon: "leaf-outline", fontfamily: Fonts.semiBold, label: "Alam" },
    { name: "portrait", icon: "person-outline", fontfamily: Fonts.semiBold, label: "Potret" },
    { name: "forest", icon: "ribbon-outline", fontfamily: Fonts.semiBold, label: "Hutan" },
    { name: "fashion", icon: "shirt-outline", fontfamily: Fonts.semiBold, label: "Fashion" },
    { name: "men", icon: "people-outline", fontfamily: Fonts.semiBold, label: "Pria" },
];

const initialDummyAccounts: ExploreAccount[] = [
    {
        id: "user1",
        name: "Syifa Adinda",
        username: "syifaaa._",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        bio: "Life is a beautiful ride 🌸 | Coffee Lover",
        followersCount: 1250,
        followingCount: 420,
        isFollowing: false,
        posts: [
            { id: "u1_p1", imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400", likes: 142, caption: "Beautiful weekend getaway! ☀️🌱 #nature #green" },
            { id: "u1_p2", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", likes: 89, caption: "Sunny days and cold drinks 🥤✨" },
            { id: "u1_p3", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400", likes: 210, caption: "Keep smiling through everything." },
        ],
    },
];

export default function SearchScreen() {
    const refreshProps = useAutoRefresh(); // 💡 2. Panggil hook-nya
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"posts" | "accounts">("posts");
    const [accounts, setAccounts] = useState<ExploreAccount[]>(initialDummyAccounts);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const [interactionPostId, setInteractionPostId] = useState<string | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<ExploreAccount | null>(null);

    const commentSheetRef = useRef<BottomSheetModal>(null);
    const shareSheetRef = useRef<BottomSheetModal>(null);
    const router = useRouter(); // Pastikan router expo-router aktif

    const filteredPosts = useMemo(() => {
        if (!searchQuery) return dummyExplorePosts;
        return dummyExplorePosts.filter((post) =>
            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const filteredAccounts = useMemo(() => {
        if (!searchQuery) return accounts;
        return accounts.filter(
            (acc) =>
                acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                acc.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, accounts]);

    const handleSelectPost = useCallback((postId: string) => {
        const isDummyId = dummyExplorePosts.some(post => post.id === postId);

        if (isDummyId) {
            Alert.alert(
                "Informasi Data Dummy",
                `Postingan ini menggunakan ID dummy (${postId}). Halaman detail akan menampilkan data fallback bawaan.`,
                [
                    {
                        text: "Tetap Buka",
                        onPress: () => router.push({
                            pathname: "/explore/scroll-feed",
                            params: { clickedPostId: postId }
                        })
                    },
                    {
                        text: "Batal",
                        style: "cancel"
                    }
                ]
            );
            return;
        }

        router.push({
            pathname: "/explore/scroll-feed",
            params: { clickedPostId: postId }
        });
    }, [router]);

    const handleCommentPress = useCallback((id: string) => {
        setInteractionPostId(id);
        commentSheetRef.current?.present();
    }, []);

    const handleSharePress = useCallback((id: string) => {
        setInteractionPostId(id);
        shareSheetRef.current?.present();
    }, []);

    const handleToggleFollow = useCallback((accountId: string) => {
        setAccounts((prev) =>
            prev.map((acc) => {
                if (acc.id === accountId) {
                    const nextState = !acc.isFollowing;
                    return { ...acc, isFollowing: nextState, followersCount: acc.followersCount + (nextState ? 1 : -1) };
                }
                return acc;
            })
        );
        setSelectedAccount((prev) => {
            if (prev && prev.id === accountId) {
                const nextState = !prev.isFollowing;
                return { ...prev, isFollowing: nextState, followersCount: prev.followersCount + (nextState ? 1 : -1) };
            }
            return prev;
        });
    }, []);

    // 💡 PERBAIKAN 1: Mengubah handleSendMessage agar mengarah ke ChatRoomScreen membawa parameter template
    const handleSendMessage = useCallback((username: string, initialMessage?: string) => {
        // 1. Tutup modal profil terlebih dahulu agar tidak menumpuk di belakang layar chat
        setSelectedAccount(null);
        
        // 2. Arahkan langsung ke chat room Anda dengan membawa data username dan template pesan jika belum follow
        router.push({
            pathname: "/chat/room", // 👈 Sesuaikan dengan path file ChatRoomScreen Anda (misal: /dm/[username] atau /chat/room)
            params: { 
                username: username, 
                initialMessage: initialMessage || "" 
            }
        });
    }, [router]);

    const renderGridItem = useCallback(
        ({ item }: { item: ExplorePost }) => (
            <Pressable
                style={({ pressed }) => [styles.gridItemPressable, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                onPress={() => handleSelectPost(item.id)}
            >
                <Image source={{ uri: item.imageUrl }} style={styles.gridImage} contentFit="cover" transition={150} />
                {item.tags && item.tags.length > 0 && (
                    <View style={styles.tagBadge}>
                        <Text style={styles.tagBadgeText}>#{item.tags[0]}</Text>
                    </View>
                )}
            </Pressable>
        ),
        [handleSelectPost]
    );

    return (
        <Screen scrollable={false}>
            <View style={styles.mainContainer}>
                {/* Bagian Search Bar */}
                <View style={styles.searchBarContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search-outline" size={20} color="#8A8A8A" style={styles.searchIcon} />
                        <TextInput
                            placeholder={activeTab === "posts" ? "Cari tag (contoh: 'beach', 'nature')..." : "Cari nama atau username..."}
                            placeholderTextColor="#8A8A8A"
                            style={[styles.input, { fontSize: 12, fontFamily: Fonts.medium }]}
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

                {/* Bagian Tabs */}
                <View style={styles.searchTabsContainer}>
                    <Pressable
                        onPress={() => setActiveTab("posts")}
                        style={[styles.searchTabButton, activeTab === "posts" && styles.searchTabButtonActive]}
                    >
                        <Ionicons name="images-outline" size={16} color={activeTab === "posts" ? Colors.light.primary : "#8A8A8A"} />
                        <Text style={[styles.searchTabLabel, activeTab === "posts" && styles.searchTabLabelActive]}>Postingan</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setActiveTab("accounts")}
                        style={[styles.searchTabButton, activeTab === "accounts" && styles.searchTabButtonActive]}
                    >
                        <Ionicons name="people-outline" size={16} color={activeTab === "accounts" ? Colors.light.primary : "#8A8A8A"} />
                        <Text style={[styles.searchTabLabel, activeTab === "accounts" && styles.searchTabLabelActive]}>Akun</Text>
                    </Pressable>
                </View>

                {activeTab === "posts" ? (
                    <View style={{ flex: 1 }}>
                        {!searchQuery && (
                            <View style={styles.trendingContainer}>
                                <View style={styles.trendingHeader}>
                                    <Ionicons name="trending-up" size={18} color={Colors.light.primary} />
                                    <Text style={styles.trendingTitle}>Tag Populer</Text>
                                </View>
                                <View style={styles.tagsRow}>
                                    {TRENDING_TAGS.map((tag) => (
                                        <Pressable key={tag.name} onPress={() => setSearchQuery(tag.name)} style={styles.tagChip}>
                                            <Ionicons name={tag.icon as any} size={14} color={Colors.light.primary} />
                                            <Text style={styles.tagChipText}>{tag.label}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}
                        <FlatList
                            data={filteredPosts}
                            renderItem={renderGridItem}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.gridContainer}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="search-outline" size={48} color="#ccc" />
                                    <Text style={styles.emptyText}>Tidak ada postingan yang cocok.</Text>
                                </View>
                            }
                        {...refreshProps} 
                        
                        />
                    </View>
                ) : (
                    <FlatList
                        data={filteredAccounts}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.accountsList}
                        renderItem={({ item }) => (
                            <AccountListItem
                                item={item}
                                onPress={() => setSelectedAccount(item)}
                                onToggleFollow={() => handleToggleFollow(item.id)}
                            />
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={48} color="#ccc" />
                                <Text style={styles.emptyText}>Tidak ada akun yang cocok.</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* Modal Detail Profil Akun */}
            <Modal visible={!!selectedAccount} animationType="slide" transparent={false}>
                {selectedAccount && (
                    <UserProfileView
                        user={selectedAccount}
                        onClose={() => setSelectedAccount(null)}
                        onSendMessage={handleSendMessage}
                        // 💡 PERBAIKAN 2: Pasang props onToggleFollow agar tombol follow di dalam modal interaktif ke data utama
                        onToggleFollow={() => handleToggleFollow(selectedAccount.id)} 
                    />
                )}
            </Modal>
        </Screen>
    );
}