import { Fonts } from "@/core/theme/fonts"; // 💡 Sinkronisasi Font bawaan proyek Anda
import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetView
} from '@gorhom/bottom-sheet';
import { Image } from 'expo-image'; // 💡 Menggunakan expo-image untuk performa foto profil lebih baik
import React, { forwardRef, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Impor Komponen Anda (Sesuaikan Path-nya) ---
import { SearchBar } from '../components/SearchBar';

interface ShareProps {
    postId: string | null;
}

interface FriendItem {
    id: string;
    name: string;
    avatarUrl?: string;
    username: string;
}

// Simulasi Data Teman dengan Fallback Gambar Kosong
const initialFriendsList: FriendItem[] = [
    { id: '1', name: 'Buzzer Official', username: 'buzzer24', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
    { id: '2', name: 'Alex Doe', username: 'alex_d', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
    { id: '3', name: 'Sarah Connor', username: 'sarah_c', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
];

export const ShareToDMBottomSheet = forwardRef<BottomSheetModal, ShareProps>(
    ({ postId }, ref) => {
        const [searchQuery, setSearchQuery] = useState('');
       
        // State untuk melacak user mana saja yang postingannya sudah berhasil terkirim
        const [sentUsers, setSentUsers] = useState<Record<string, 'sending' | 'sent'>>({});

        const snapPoints = useMemo(() => ['65%', '90%'], []);

        // FITUR INTERAKTIF 1: Filter Teman secara Real-time
        const filteredFriends = useMemo(() => {
            if (!searchQuery.trim()) return initialFriendsList;
            return initialFriendsList.filter(friend =>
                friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                friend.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }, [searchQuery]);

        // FITUR INTERAKTIF 2: Aksi Kirim Tanpa Kolom Pesan
        const handleSendPost = (pId: string | null, uId: string) => {
            if (sentUsers[uId] === 'sent') return;

            setSentUsers(prev => ({ ...prev, [uId]: 'sending' }));

            // Simulasi proses pengiriman ke server/database
            setTimeout(() => {
                setSentUsers(prev => ({ ...prev, [uId]: 'sent' }));
                console.log(`Berhasil membagikan Post ID [${pId}] ke User ID [${uId}]`);
            }, 600);
        };

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                enablePanDownToClose={true}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
                )}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={styles.title}>Kirim ke...</Text>
                   
                    {/* Search Bar */}
                    <SearchBar
                        placeholder="Cari teman..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    {/* List Teman Teradaptasi dari AccountListItem */}
                    <BottomSheetFlatList
                        data={filteredFriends}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const status = sentUsers[item.id];
                            return (
                                <View style={styles.accountItemRow}>
                                    {/* Komponen Foto Profil Interaktif */}
                                    <Image 
                                        source={{ uri: item.avatarUrl || "https://via.placeholder.com/150" }} 
                                        style={styles.accountAvatar} 
                                        cachePolicy="memory-disk" 
                                    />
                                   
                                    {/* Detail Identitas Teman */}
                                    <View style={styles.accountDetails}>
                                        <Text style={styles.accountName}>{item.name}</Text>
                                        <Text style={styles.accountUsername}>@{item.username}</Text>
                                    </View>

                                    {/* Tombol Aksi Sisi Kanan (Kirim / Terkirim) */}
                                    <TouchableOpacity
                                        style={[
                                            styles.sendButton,
                                            status === 'sent' && styles.sentButton,
                                            status === 'sending' && styles.sendingButton
                                        ]}
                                        onPress={() => handleSendPost(postId, item.id)}
                                        disabled={status === 'sending'}
                                    >
                                        {status === 'sending' ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : status === 'sent' ? (
                                            <Text style={styles.sentButtonText}>Terkirim</Text>
                                        ) : (
                                            <Text style={styles.sendButtonText}>Kirim</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Teman tidak ditemukan</Text>
                            </View>
                        }
                    />
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    contentContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1A', textAlign: 'center' },
    listContent: { paddingVertical: 10, paddingBottom: 20 },
    
    // Adaptasi Layout & Style dari AccountListItem
    accountItemRow: {
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 16, 
        paddingVertical: 4,
    },
    accountAvatar: {
        width: 50, 
        height: 50, 
        borderRadius: 25,
        backgroundColor: '#F0F0F0'
    },
    accountDetails: {
        flex: 1, 
        marginLeft: 12
    },
    accountName: {
        fontSize: 14,     
        fontFamily: Fonts.semiBold, 
        color: "#000"
    },
    accountUsername: {
        fontSize: 12,     
        fontFamily: Fonts.medium, 
        color: "#8A8A8A", 
        marginTop: 2
    },

    // Styling Tombol Aksi Kanan (Premium State)
    sendButton: {
        backgroundColor: '#5C5CFF', // Menyamakan warna biru tema ScaleGram Anda
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendingButton: {
        backgroundColor: '#8C8CFF',
    },
    sentButton: {
        backgroundColor: '#E5E5EA', // Abu-abu tanda terkirim pasif
    },
    sendButtonText: { 
        color: '#FFF', 
        fontFamily: Fonts.semiBold, 
        fontSize: 13 
    },
    sentButtonText: { 
        color: '#000', 
        fontFamily: Fonts.semiBold, 
        fontSize: 13 
    },

    // Empty state
    emptyContainer: { alignItems: 'center', marginTop: 40 },
    emptyText: { color: '#8A8A8A', fontSize: 14 }
});