import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Shadows } from "@/core/theme/shadows";
import { PRESET_AVATARS } from "@/data/Profile/profileData";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProfileHeaderProps {
    user: any;
    postCount: number;
    isMyProfile?: boolean; // 💡 Tambahkan prop ini
    onOpenEditProfile: () => void;
    onOpenConnections: (type: "followers" | "following") => void;
    onLogout: () => void;
    onFollowPress?: () => void;
    onMessagePress?: (username: string, initialMessage?: string) => void; // 💡 Aksi tombol pesan
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    postCount,
    isMyProfile = true,
    onOpenEditProfile,
    onOpenConnections,
    onLogout,
    onFollowPress,
    onMessagePress,
}) => {

    const handleMessagePress = () => {
        if (onMessagePress) {
            const templateText = user.isFollowing ? "" : "Halo 😼";
            onMessagePress(user.username, templateText);
        }
    };

    return (
        <View style={styles.header}>
            <View style={styles.avatarRow}>
                <Pressable
                    onPress={onOpenEditProfile}
                    disabled={!isMyProfile}
                    style={styles.avatarWrapper}
                >
                    <Image
                        source={{ uri: user?.avatarUrl || PRESET_AVATARS[0] }}
                        style={styles.avatar}
                        cachePolicy="memory-disk"
                    />

                    {isMyProfile && (
                        <View style={styles.avatarEditOverlay}>
                            <Ionicons name="camera" size={14} color="#FFF" />
                        </View>
                    )}
                </Pressable>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{postCount}</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>

                    <Pressable onPress={() => onOpenConnections("followers")} style={styles.statBox}>
                        <Text style={styles.statNumber}>{user?.followersCount ?? 5}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </Pressable>

                    <Pressable onPress={() => onOpenConnections("following")} style={styles.statBox}>
                        <Text style={styles.statNumber}>{user?.followingCount ?? 3}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </Pressable>

                </View>
            </View>

            <Text style={styles.nickname}>{user?.nickname || "ScaleGram User"}</Text>
            <Text style={styles.username}>@{user?.username || "user_scalegram"}</Text>
            <Text style={styles.bioText}>{user?.bio || "Digital Creator | Photography Enthusiast ✨"}</Text>
            <Text style={styles.emailText}><Ionicons name="mail-outline" size={12} /> {user?.email}</Text>

            <View style={styles.actionsRow}>
                {isMyProfile ? (
                    <>
                        {/* Tampilan tombol profil sendiri */}
                        <Pressable style={styles.editButton} onPress={onOpenEditProfile}>
                            <Ionicons name="create-outline" size={16} color={Colors.light.primary} />
                            <Text style={styles.editButtonText}>Edit Profil</Text>
                        </Pressable>
                        <Pressable style={styles.logoutButton} onPress={onLogout}>
                            <Ionicons name="log-out-outline" size={16} color="#FF3B30" />
                            <Text style={styles.logoutText}>Keluar</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        {/* 💡 Tombol Ikuti dengan logika style dinamis mengikuti UserProfileView */}
                        <Pressable
                            style={[
                                styles.followBtnBase,
                                user.isFollowing ? styles.followingBtnActive : styles.followBtnActive
                            ]}
                            onPress={onFollowPress}
                        >
                            <Text style={[
                                styles.followTextBase,
                                user.isFollowing ? styles.followingTextActive : styles.followTextActive
                            ]}>
                                {user.isFollowing ? "Diikuti" : "Ikuti"}
                            </Text>
                        </Pressable>

                        <Pressable style={styles.msgBtnBase} onPress={handleMessagePress}>
                            <Text style={styles.msgTextBase}>Kirim Pesan</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        backgroundColor: "#FFF",
        borderRadius: 24,
        marginBottom: 16,
        ...Shadows.card,
    },
    avatarRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
    avatarWrapper: { position: "relative" },
    avatar: { width: 86, height: 86, borderRadius: 43, borderWidth: 2, borderColor: Colors.light.primary },
    avatarEditOverlay: { position: "absolute", bottom: 0, right: 0, backgroundColor: Colors.light.primary, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#FFF" },
    statsContainer: { flexDirection: "row", flex: 1, justifyContent: "space-around", marginLeft: 20 },
    statBox: { alignItems: "center", paddingVertical: 4 },
    statNumber: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.light.text },
    statLabel: { fontSize: 12, fontFamily: Fonts.regular, color: "#8A8A8A", marginTop: 2 },
    nickname: { fontSize: 22, fontFamily: Fonts.semiBold, color: Colors.light.text },
    username: { fontSize: 15, fontFamily: Fonts.medium, color: "#66666", marginTop: 2, marginBottom: 4 },
    bioText: { fontSize: 13.5, fontFamily: Fonts.regular, color: "#4F4F4F", lineHeight: 18, marginBottom: 6 },
    emailText: { fontSize: 12, fontFamily: Fonts.regular, color: Colors.light.subText, marginBottom: 14 },
    editButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#F4F1FE", paddingVertical: 10, borderRadius: 12, gap: 6 },
    editButtonText: { color: Colors.light.primary, fontFamily: Fonts.semiBold, fontSize: 14 },
    logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF1F0", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, gap: 6 },
    logoutText: { color: "#FF3B30", fontFamily: Fonts.semiBold, fontSize: 14 },
    actionsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 12, },
    followBtnBase: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', },
    followBtnActive: { backgroundColor: '#5C5CFF', },
    followingBtnActive: { backgroundColor: '#E5E5EA', },
    followTextBase: { fontFamily: Fonts.bold, fontSize: 14, },
    followTextActive: { color: '#fff', },
    followingTextActive: { color: '#000', },
    msgBtnBase: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA', paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', },
    msgTextBase: { color: '#333', fontFamily: Fonts.bold, fontSize: 14, },
});