import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { createContext, useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";

import { Colors } from "@/core/theme/colors";
import { useCreatePost } from "@/hooks/post/useCreatePost";
import Button from "@/presentation/components/Button";
import Screen from "@/presentation/components/Screen";
import { useAuthStore } from "@/store/authStore";
import { useUploadStore } from "@/store/uploadStore";

// IMPORT STYLING DARI FILE TERPISAH
import { styles } from "@/domain/style/UploadStyles";

const UploadContext = createContext<any>(null);

function UploadContent() {
  const { image, mediaType, setImage, caption, setCaption, clear } = useUploadStore();
  const { createPost, loading } = useContext(UploadContext);
  const user = useAuthStore((state) => state.user);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "We need camera roll permissions.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const isVideoType = asset.type === 'video' || asset.uri.endsWith('.mp4') || asset.uri.endsWith('.mov') || asset.uri.endsWith('.webm');
      setImage(asset.uri, isVideoType ? 'video' : 'image');
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "We need camera permissions to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri, 'image');
    }
  }

  async function recordVideo() {
    const permissionCamera = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionCamera.granted) {
      Alert.alert("Permission Denied", "We need camera permission to record video.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri, 'video');
    }
  }

  function handleSelectImageOptions() {
    Alert.alert(
      "Pilih Media",
      "Pilih sumber media untuk membuat postingan Anda.",
      [
        {
          text: "Kamera",
          onPress: () => {
            Alert.alert(
              "Mode Kamera",
              "Mau ambil foto atau rekam video?",
              [
                { text: "Ambil Foto", onPress: takePhoto },
                { text: "Rekam Video", onPress: recordVideo },
                { text: "Batal", style: "cancel" },
              ]
            );
          },
        },
        {
          text: "Dari Galeri",
          onPress: pickImage, 
        },
        {
          text: "Batal",
          style: "cancel",
        },
      ]
    );
  }

  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Oops", "Please choose an image first.");
      return;
    }

    try {
      await createPost({
        userId: user?.id || 'temp-id',
        username: user?.username || user?.nickname || 'My Account',
        imageUrl: image,
        caption: caption,
        likes: [],
        comments: 0,
        savedBy: [], // 👈 INTI PERBAIKAN: Buat array kosong untuk menampung bookmark
        createdAt: Date.now(),
        mediaType: mediaType || 'image',
      });

      Alert.alert("Success", "Your post has been uploaded!");
      clear();
      router.replace("/feed");
    } catch (error) {
      Alert.alert("Upload Failed", "Something went wrong.");
    }
  };

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Create Post</Text>

      <Pressable
        onPress={handleSelectImageOptions}
        disabled={loading}
        style={({ pressed }) => [
          styles.imagePicker,
          { opacity: pressed ? 0.8 : 1 }
        ]}
      >
        {image ? (
          <View style={styles.imageContainer}>
            {mediaType === 'video' || image.endsWith('.mp4') || image.endsWith('.mov') || image.endsWith('.webm') ? (
              <Video
                source={{ uri: image }}
                style={styles.videoStyle}
                resizeMode={ResizeMode.COVER}
                useNativeControls
                isMuted
                isLooping
                shouldPlay
              />
            ) : (
              <Image source={{ uri: image }} style={styles.image} />
            )}
            <Pressable style={styles.clearButton} onPress={() => setImage(null, null)}>
              <Ionicons name="close" size={20} color="white" />
            </Pressable>
          </View>
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