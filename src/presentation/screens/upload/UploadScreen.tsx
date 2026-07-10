import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Shadows } from "@/core/theme/shadows";
import { useCreatePost } from "@/hooks/post/useCreatePost";
import Button from "@/presentation/components/Button";
import Screen from "@/presentation/components/Screen";
// 1. TAMBAHKAN IMPOR STORE AUTH DI SINI
import { useAuthStore } from "@/store/authStore";

const UploadContext = createContext<any>(null);

function UploadContent() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const { createPost, loading } = useContext(UploadContext);
  
  // 2. AMBIL DATA USER YANG SEDANG LOGIN SAAT INI
  const user = useAuthStore((state) => state.user);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "We need camera roll permissions.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Oops", "Please choose an image first.");
      return;
    }

    try {
      // 3. SUNTIKKAN DATA USER SECARA LENGKAP
      await createPost({
        userId: user?.id || 'temp-id',
        username: user?.username || user?.nickname || 'My Account', // Mengganti Guest jadi nama akun asli
        imageUrl: image, 
        caption: caption,
        likes: [],
        comments: 0,
        createdAt: Date.now()
      });

      Alert.alert("Success", "Your post has been uploaded!");
      setImage(null);
      setCaption("");
      router.replace("/feed");
    } catch (error) {
      Alert.alert("Upload Failed", "Something went wrong.");
    }
  };

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Create Post</Text>

      <Pressable
        onPress={pickImage}
        disabled={loading}
        style={({ pressed }) => [
    styles.imagePicker, // Style asli Anda
    { opacity: pressed ? 0.8 : 1 } // 🌟 Efek redup saat ditekan di Android & Web
  ]}

      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <>
            <Ionicons name="image-outline" size={70} color="#B7B7B7" />
            <Text style={styles.pickText}>Tap to choose image</Text>
          </>
        )}
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.label}>Caption</Text>
        <TextInput
          multiline
          maxLength={300}
          placeholder="Share your thoughts..."
          placeholderTextColor="#A6A6A6"
          style={styles.input}
          value={caption}
          onChangeText={setCaption}
          editable={!loading}
        />
        <Text style={styles.counter}>{caption.length}/300</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Uploading to Cloudinary & Firestore...</Text>
        </View>
      ) : (
        <Button title="Upload Post" onPress={handleUpload} />
      )}
    </View>
  );
}

export default function UploadScreen() {
  const createPostUseCase = useCreatePost();

  return (
    <Screen>
      <UploadContext.Provider value={createPostUseCase}>
        <UploadContent />
      </UploadContext.Provider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 30, fontFamily: Fonts.bold, color: Colors.light.text, marginBottom: 24 },
  imagePicker: { height: 320, borderRadius: 24, backgroundColor: "#F5F5F7", justifyContent: "center", alignItems: "center", marginBottom: 20, ...Shadows.card },
  image: { width: "100%", height: "100%", borderRadius: 24 },
  pickText: { marginTop: 14, fontFamily: Fonts.medium, color: "#8A8A8A", fontSize: 16 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18, marginBottom: 24, ...Shadows.card },
  label: { fontFamily: Fonts.semiBold, color: Colors.light.text, marginBottom: 10, fontSize: 16 },
  input: { minHeight: 110, textAlignVertical: "top", fontFamily: Fonts.regular, fontSize: 15, color: Colors.light.text },
  counter: { alignSelf: "flex-end", marginTop: 10, fontFamily: Fonts.medium, color: "#9C9C9C" },
  loadingWrapper: { alignItems: "center", marginVertical: 10 },
  loadingText: { marginTop: 8, fontFamily: Fonts.medium, color: "#666" }
});