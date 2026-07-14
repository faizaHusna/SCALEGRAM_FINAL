import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  username: string;
  avatarUrl?: string; // Tambahkan URL gambar
  isSeen?: boolean;   // Status apakah story sudah dilihat
  onPress?: () => void; // 2. Tambahkan properti fungsi klik di sini
}

export default function StoryItem({ username, avatarUrl, isSeen, onPress }: Props) {
  // Jika sudah dilihat, ring berwarna abu-abu. Jika belum, gradient.
const ringColors = isSeen 
  ? (["#E5E5E5", "#E5E5E5"] as const) 
  : (["#8B5CF6", "#6D5DF6", "#A855F7"] as const);

  return (
    // 3. Ubah View paling luar menjadi Pressable dan sambungkan ke fungsi onPress
    <Pressable onPress={onPress} style={styles.container}>
      <LinearGradient colors={ringColors} style={styles.storyRing}>
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.initial}>{username.charAt(0).toUpperCase()}</Text>
          )}
        </View>
      </LinearGradient>

      <Text numberOfLines={1} style={styles.username}>{username}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginRight: 18, width: 74 },
  storyRing: { width: 72, height: 72, borderRadius: 36, justifyContent: "center", alignItems: "center" },
  avatarContainer: { width: 66, height: 66, borderRadius: 33, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  initial: { fontSize: 24, fontFamily: Fonts.bold, color: Colors.light.primary },
  username: { marginTop: 8, fontSize: 13, fontFamily: Fonts.medium, color: Colors.light.text },
});