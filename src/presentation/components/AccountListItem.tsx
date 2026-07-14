// FILE: src/presentation/components/AccountListItem.tsx
import { Fonts } from "@/core/theme/fonts";
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export const AccountListItem = ({ item, onPress, onToggleFollow }: any) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.accountItemRow,
        { backgroundColor: pressed ? "#F9F9FB" : "transparent" }
      ]}
    >
      <Image source={{ uri: item.avatarUrl }} style={styles.accountAvatar} cachePolicy="memory-disk" />
      
      <View style={styles.accountDetails}>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountUsername}>@{item.username}</Text>
        <Text style={styles.accountMeta}>
          {/* Angka warna biru sesuai gambar */}
          <Text style={styles.followersNumber}>
            {item.followersCount >= 1000 ? `${(item.followersCount / 1000).toFixed(1)}k` : item.followersCount}
          </Text> <Text style={[{ fontFamily: Fonts.medium }]}>pengikut</Text> 
          </Text>
      </View>

      <Pressable
        onPress={onToggleFollow}
        style={[styles.followBtn, item.isFollowing && styles.followingBtn]}
      >
        <Text style={[styles.followBtnText, item.isFollowing && styles.followingBtnText]}>
          {item.isFollowing ? "Diikuti" : "Ikuti"}
        </Text>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  accountItemRow: { 
    flexDirection: "row", alignItems: "center", marginBottom: 16, padding: 8, borderRadius: 8 
  },
  accountAvatar: { 
    width: 50, height: 50, borderRadius: 25 
  },
  accountDetails: { 
    flex: 1, marginLeft: 12 
  },
  accountName: { 
    fontSize: 14,     fontFamily: Fonts.semiBold, color: "#000" 
  },
  accountUsername: { 
    fontSize: 12,     fontFamily: Fonts.medium, color: "#8A8A8A", marginTop: 2 
  },
  accountMeta: { 
    fontSize: 12, color: "#8A8A8A", fontFamily: Fonts.medium, marginTop: 2 
  },
  followersNumber: { 
    color: "#5C5CFF", fontWeight: "600" // Warna biru seperti di desain
  },
  followBtn: { 
    backgroundColor: "#5C5CFF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, minWidth: 90, alignItems: 'center'
  },
  followingBtn: { 
    backgroundColor: "#E5E5EA" 
  },
  followBtnText: { 
    color: "#fff", fontFamily: Fonts.semiBold, fontSize: 13 
  },
  followingBtnText: { 
    color: "#000", fontFamily: Fonts.semiBold, fontSize: 13
  },
});