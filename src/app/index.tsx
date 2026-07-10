import SplashScreen from '@/presentation/screens/SplashScreen';
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function IndexPage() {
  // Gunakan state 'loading' dan 'user' dari store
  const { user, loading } = useAuthStore();

  // Jika masih loading (memeriksa sesi), tampilkan SplashScreen
  if (loading) {
    return <SplashScreen />;
  }

  // Jika sudah tidak loading, arahkan ke tab atau login
  return user ? (
    <Redirect href="/(tabs)/feed" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}