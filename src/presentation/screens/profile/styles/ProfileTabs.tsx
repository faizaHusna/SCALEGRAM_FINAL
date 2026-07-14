import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { TabType } from "@/data/Profile/profileData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isMyProfile?: boolean; // 💡 Tambahkan prop ini
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab, isMyProfile = true }) => {
  return (
    <View style={styles.tabSelectorBar}>
      <Pressable onPress={() => setActiveTab("grid")} style={[styles.tabButton, activeTab === "grid" && styles.tabButtonActive]}>
        <Ionicons name={activeTab === "grid" ? "grid" : "grid-outline"} size={22} color={activeTab === "grid" ? Colors.light.primary : "#8E8E93"} />
        <Text style={[styles.tabLabel, activeTab === "grid" && styles.tabLabelActive]}>Grid</Text>
      </Pressable>

      <Pressable onPress={() => setActiveTab("list")} style={[styles.tabButton, activeTab === "list" && styles.tabButtonActive]}>
        <Ionicons name={activeTab === "list" ? "list" : "list-outline"} size={22} color={activeTab === "list" ? Colors.light.primary : "#8E8E93"} />
        <Text style={[styles.tabLabel, activeTab === "list" && styles.tabLabelActive]}>Aliran</Text>
      </Pressable>

      
    {/* 💡 Sembunyikan tab Saved jika bukan profil sendiri */}
      {isMyProfile && (
        <Pressable onPress={() => setActiveTab("saved")} style={[styles.tabButton, activeTab === "saved" && styles.tabButtonActive]}>
          <Ionicons name={activeTab === "saved" ? "bookmark" : "bookmark-outline"} size={22} color={activeTab === "saved" ? Colors.light.primary : "#8E8E93"} />
          <Text style={[styles.tabLabel, activeTab === "saved" && styles.tabLabelActive]}>Simpan</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabSelectorBar: { flexDirection: "row", backgroundColor: "#FFF", paddingVertical: 6, borderRadius: 16, marginBottom: 8, borderWidth: 0.5, borderColor: "#F2F2F7" },
  tabButton: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 8, gap: 2 },
  tabButtonActive: { borderBottomWidth: 2, borderBottomColor: Colors.light.primary },
  tabLabel: { fontSize: 11, fontFamily: Fonts.medium, color: "#8E8E93" },
  tabLabelActive: { color: Colors.light.primary, fontFamily: Fonts.bold },
});