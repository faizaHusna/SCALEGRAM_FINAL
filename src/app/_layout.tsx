import { ActivityProvider } from '@/context/ActivityContext';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts
} from "@expo-google-fonts/plus-jakarta-sans";
import { Sora_700Bold } from "@expo-google-fonts/sora";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack, router } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import { InjectionProvider } from "@/core/di/InjectionContext";
import { DIContainer } from "@/core/di/container";
import { AuthState, useAuthStore } from '@/store/authStore'; // Pastikan path benar
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
const user = useAuthStore((state: AuthState) => state.user);


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
          <BottomSheetModalProvider>
            {/* Navigasi sekarang hanya fokus pada rute yang benar-benar ada */}
            <ActivityProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(auth)/register" />
              <Stack.Screen name="(auth)/forgot-password" />
              <Stack.Screen name="(tabs)" />
              {/* Rute post/[id] dihapus karena sudah di-handle inline di Search & Feed */}
            </Stack>
            </ActivityProvider>
          </BottomSheetModalProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </InjectionProvider>
  );
}