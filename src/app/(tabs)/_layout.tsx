import { useUploadStore } from "@/store/uploadStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useCallback } from "react";
import { Alert, BackHandler, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Impor useFocusEffect untuk mendeteksi kapan tab aktif/tidak aktif
import { useFocusEffect } from "expo-router";

export default function TabsLayout() {
  const insets = useSafeAreaInsets(); // Ambil data jarak aman bawah screen ponsel

  // Fungsi popup konfirmasi (Reusable function agar kode tidak duplikat)
  const showCancelAlert = (onConfirm: () => void) => {
    Alert.alert(
      "Batal Mengedit?",
      "Apakah Anda yakin ingin berhenti mengedit? Ini akan menghapus draf postingan dan foto Anda untuk menghemat memori.",
      [
        { text: "Lanjutkan Mengedit", style: "cancel" },
        {
          text: "Hapus Draf",
          style: "destructive",
          onPress: () => {
            useUploadStore.getState().clear();
            onConfirm();
          },
        },
      ]
    );
  };

  // 1. LISTENER UNTUK KLIK TAB BAWAH
  const createTabListener = (navigation: any, tabName: string) => ({
    tabPress: (e: any) => {
      if (useUploadStore.getState().hasChanges()) {
        e.preventDefault();
        showCancelAlert(() => {
          navigation.navigate(tabName);
        });
      }
    },
  });

  // 2. LISTENER UNTUK TOMBOL BACK FISIK/BAWAAN HP (KHUSUS ANDROID)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (useUploadStore.getState().hasChanges()) {
          showCancelAlert(() => {
            BackHandler.exitApp();
          });
          return true;
        }
        return false;
      };

      // Simpan objek subscription saat mendaftarkan listener
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Gunakan subscription.remove() untuk membersihkannya (Menghilangkan error TS2339)
      return () => {
        subscription.remove();
      };
    }, [])
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          height: Platform.OS === "ios" ? 88 : 64 + (insets.bottom > 0 ? insets.bottom : 0),
          paddingBottom: Platform.OS === "ios" ? 30 : (insets.bottom > 0 ? insets.bottom : 0),
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: "#5F4BB6",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      {/* Urutan 1: HOME/FEED */}
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
        listeners={({ navigation }) => createTabListener(navigation, "feed")}
      />

      {/* Urutan 2: SEARCH */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={26} color={color} />
          ),
        }}
        listeners={({ navigation }) => createTabListener(navigation, "search")}
      />

      {/* Urutan 3: TOMBOL UNGGUR TENGAH (UPLOAD) */}
      <Tabs.Screen
        name="upload"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.uploadButtonContainer}>
              <View style={[styles.uploadButton, focused && styles.uploadButtonActive]}>
                <Ionicons name="add" size={28} color="#ffffff" />
              </View>
            </View>
          ),
        }}
      />

      {/* Urutan 4: NOTIFIKASI SCREEN DENGAN IKON HATI */}
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={26} color={color} />
          ),
        }}
        listeners={({ navigation }) => createTabListener(navigation, "activity")}
      />

      {/* Urutan 5: PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
          ),
        }}
        listeners={({ navigation }) => createTabListener(navigation, "profile")}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  uploadButtonContainer: { justifyContent: "center", alignItems: "center", height: "100%", width: 60 },
  uploadButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#5F4BB6", justifyContent: "center", alignItems: "center", elevation: 3, shadowColor: "#5F4BB6", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3 },
  uploadButtonActive: { backgroundColor: "#4A37A0", transform: [{ scale: 1.05 }] },
});