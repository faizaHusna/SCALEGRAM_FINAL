// FILE: src/presentation/components/ConnectionsBottomSheet.tsx
import { Fonts } from "@/core/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AccountListItem } from './AccountListItem';

export const ConnectionsBottomSheet = ({ 
  visible, 
  onClose, 
  title, 
  data 
}: any) => {
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header Sheet */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          {/* List Akun menggunakan AccountListItem */}
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <AccountListItem
                item={item}
                // 👇 HUBUNGAN KE [username].tsx TERJADI DI SINI
                onPress={() => {
                  onClose(); // Tutup sheet terlebih dahulu
                  router.push(`/profile/${item.username}`); // Pindah ke UserProfile view
                }}
                onToggleFollow={() => {
                  // TODO: Panggil fungsi API/Store untuk toggle follow
                  console.log("Toggle follow untuk", item.username);
                }}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'
  },
  sheetContainer: {
    backgroundColor: '#FFF', height: '70%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 12
  },
  title: {
    fontSize: 18, fontFamily: Fonts.semiBold
  },
  closeBtn: {
    padding: 4
  },
  listContent: {
    paddingBottom: 20
  }
});