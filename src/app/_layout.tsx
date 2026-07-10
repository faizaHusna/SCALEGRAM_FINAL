// FILE: src/app/_layout.tsx (FIXED - TERINTEGRASI DENGAN BOTTOM SHEET MODAL GLOBAL)
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'; // 🚀 TAMBAHKAN INI
import { Stack, router } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts
} from "@expo-google-fonts/plus-jakarta-sans";
import { Sora_700Bold } from "@expo-google-fonts/sora";

import { InjectionProvider } from "@/core/di/InjectionContext";
import { DIContainer } from "@/core/di/container";
import { useAuthStore } from "@/store/authStore";

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user } = useAuthStore();

  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
    Sora_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        ExpoSplashScreen.hideAsync();
        if (!user) {
          router.replace("/login");
        } else {
          router.replace("/(tabs)/feed");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, user]);

  if (!fontsLoaded) return null;

  return (
    <InjectionProvider container={DIContainer}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          {/* 🚀 BUNGKUS DENGAN BOTTOMSHEETMODALPROVIDER DI SINI! 
              Ini memastikan BottomSheetModal dapat dibuka dari mana saja,
              termasuk rute di luar tabs seperti post/[id].tsx */}
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(auth)/register" />
              <Stack.Screen name="(auth)/forgot-password" />
              <Stack.Screen name="(tabs)" />
             
              {/* stack screen post/[id] dengan animasi terkontrol */}
              <Stack.Screen
                name="post/[id]"
                options={{
                  animation: 'slide_from_right', // Sekarang bisa menggunakan animasi default yang halus
                  gestureEnabled: true,
                }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </InjectionProvider>
  );
}