import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { DUMMY_CONNECTIONS } from "@/data/Profile/profileData";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface ConnectionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  type: "followers" | "following";
  user: any;
  setUser: (user: any) => void;
}

export const ConnectionsModal: React.FC<ConnectionsModalProps> = ({ isVisible, onClose, type, user, setUser }) => {
  const [connectionsList, setConnectionsList] = useState(DUMMY_CONNECTIONS);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleConnectionFollow = (id: string) => {
    setConnectionsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isFollowing;
          if (user) {
            setUser({ ...user, followingCount: Math.max(0, user.followingCount + (nextState ? 1 : -1)) });
          }
          return { ...item, isFollowing: nextState };
        }
        return item;
      })
    );
  };

  const filteredConnections = useMemo(() => {
    return connectionsList.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.username.toLowerCase().includes(searchQuery.toLowerCase());
      return type === "followers" ? (matchSearch && item.isFollower) : (matchSearch && item.isFollowing);
    });
  }, [connectionsList, type, searchQuery]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onDismiss={() => setSearchQuery("")}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{type === "followers" ? "Pengikut" : "Diikuti"}</Text>
            <Pressable onPress={onClose} style={styles.closeModalBtn}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </Pressable>
          </View>

          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={16} color="#8E8E93" style={styles.searchIcon} />
            <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Cari nama atau username..." style={styles.searchBarInput} placeholderTextColor="#9C9C9C" />
            {searchQuery !== "" && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={16} color="#8E8E93" />
              </Pressable>
            )}
          </View>

          <FlatList
            data={filteredConnections}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <View style={styles.connectionItemRow}>
                <Image source={{ uri: item.avatar }} style={styles.connectionAvatar} />
                <View style={styles.connectionDetails}>
                  <Text style={styles.connectionName}>{item.name}</Text>
                  <Text style={styles.connectionUsername}>@{item.username}</Text>
                </View>
                <Pressable onPress={() => toggleConnectionFollow(item.id)} style={[styles.connectionFollowBtn, item.isFollowing && styles.connectionFollowingBtn]}>
                  <Text style={[styles.connectionFollowBtnText, item.isFollowing && styles.connectionFollowingBtnText]}>
                    {item.isFollowing ? "Mengikuti" : "Ikuti"}
                  </Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={40} color="#C7C7CC" />
                <Text style={styles.emptyText}>Tidak ada pengguna yang cocok.</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, height: "85%", width: "100%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#EAEAEF" },
  modalTitle: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.light.text },
  closeModalBtn: { padding: 4 },
  searchBarContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#F2F2F7", marginHorizontal: 16, marginVertical: 12, borderRadius: 10, paddingHorizontal: 10, height: 38 },
  searchIcon: { marginRight: 6 },
  searchBarInput: { flex: 1, fontSize: 13.5, fontFamily: Fonts.regular, color: Colors.light.text },
  connectionItemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: "#F2F2F7" },
  connectionAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#EAEAEF" },
  connectionDetails: { flex: 1, paddingHorizontal: 12 },
  connectionName: { fontSize: 14, fontFamily: Fonts.semiBold, color: Colors.light.text },
  connectionUsername: { fontSize: 12, fontFamily: Fonts.regular, color: "#8E8E93", marginTop: 1 },
  connectionFollowBtn: { backgroundColor: Colors.light.primary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, minWidth: 80, alignItems: "center" },
  connectionFollowingBtn: { backgroundColor: "#E5E5EA" },
  connectionFollowBtnText: { color: "#FFF", fontFamily: Fonts.bold, fontSize: 12 },
  connectionFollowingBtnText: { color: Colors.light.text },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 80, paddingHorizontal: 42, gap: 12 },
  emptyText: { textAlign: "center", color: "#8E8E93", fontFamily: Fonts.medium, fontSize: 13 },
});