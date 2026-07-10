import { Colors } from "@/core/theme/colors";
import React, { ReactNode } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean; // 💡 Properti baru untuk kontrol ScrollView
}

export default function Screen({
  children,
  scrollable = true, // Default tetap true agar halaman lain tidak rusak
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />

      {scrollable ? (
        // Gunakan ScrollView jika halaman butuh scrolling statis (Form, Detail, dll)
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {children}
        </ScrollView>
      ) : (
        // Gunakan View biasa jika di dalamnya sudah ada FlatList/Grid (Feed, Profile)
        <View style={styles.nonScrollableContent}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  nonScrollableContent: {
    flex: 1,
    paddingHorizontal: 20, // Tetap menjaga kerapian margin kiri-kanan aplikasi
  },
});