import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
// Untuk menghitung tinggi navigasi bawaan HP secara real-time
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets(); // Ambil data jarak aman bawah screen ponsel

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          // TINGGI DINAMIS: Menyesuaikan navigation bar bawaan HP agar tidak terhalang
          height: Platform.OS === "ios" ? 88 : 64 + (insets.bottom > 0 ? insets.bottom : 0),
          paddingBottom: Platform.OS === "ios" ? 30 : (insets.bottom > 0 ? insets.bottom : 0),
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: "#5F4BB6", // Warna ungu aktif aplikasi Anda
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
      />
      
      {/* Urutan 2: SEARCH */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={26} color={color} />
          ),
        }}
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
      {/* 💡 Diubah ke 'notification' agar warning hilang, tapi visualnya tetap hati */}
      <Tabs.Screen
        name="activity" 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={26} color={color} />
          ),
        }}
      />

      {/* Urutan 5: PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  uploadButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%", 
    width: 60,
  },
  uploadButton: {
    width: 48,
    height: 48,
    borderRadius: 24, 
    backgroundColor: "#5F4BB6", 
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#5F4BB6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  uploadButtonActive: {
    backgroundColor: "#4A37A0", 
    transform: [{ scale: 1.05 }],
  },
});