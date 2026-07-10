import { getApp, getApps, initializeApp } from "firebase/app";
// 💡 Hanya impor initializeAuth saja dari entrypoint utama
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FirebaseAuth from "firebase/auth"; // Impor seluruh modul sebagai objek
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOcm82xMGhKm-CyLBUfepfXa-24tgS0ek",
  authDomain: "scalegram-65e92.firebaseapp.com",
  projectId: "scalegram-65e92",
  storageBucket: "scalegram-65e92.firebasestorage.app",
  messagingSenderId: "64994097285",
  appId: "1:64994097285:web:2f7b76666e1f0c877511ec",
};

// 1. Inisialisasi Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 2. Ambil fungsi persistensi secara dinamis untuk mengelabui strict-type compiler
const getReactNativePersistence = (FirebaseAuth as any)._getReactNativePersistence || (FirebaseAuth as any).getReactNativePersistence;

let firebaseAuth;

if (getApps().length > 0) {
  firebaseAuth = initializeAuth(app, {});
} else {
  firebaseAuth = initializeAuth(app, {
    // 💡 Jalankan fungsi persistensi yang berhasil diekstrak
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const auth = firebaseAuth;
export default app;