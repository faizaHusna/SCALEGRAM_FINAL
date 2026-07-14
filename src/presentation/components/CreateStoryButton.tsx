import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export const CreateStoryButton = () => {
  const router = useRouter();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin Ditolak", "Akses galeri diperlukan!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [9, 16], // Rasio Story
      quality: 0.8,
    });
    if (!result.canceled) {
      router.push({ pathname: '/story/editor', params: { mediaUri: result.assets[0].uri } });
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin Ditolak", "Akses kamera diperlukan!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });
    if (!result.canceled) {
      router.push({ pathname: '/story/editor', params: { mediaUri: result.assets[0].uri } });
    }
  };

  const handlePress = () => {
    Alert.alert(
      "Tambah Story",
      "Pilih sumber media:",
      [
        { text: "Kamera", onPress: takePhoto },
        { text: "Galeri", onPress: pickImage },
        { text: "Batal", style: "cancel" }
      ]
    );
  };

  return (
    <Pressable onPress={handlePress} style={styles.storyContainer}>
      <View style={styles.createStoryRing}>
        <Ionicons name="add" size={24} color={Colors.light.primary} />
      </View>
      <Text style={styles.username}>You</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  storyContainer: { alignItems: "center", marginRight: 18, width: 74 },
  createStoryRing: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#E5E5E5', justifyContent: "center", alignItems: "center" },
  username: { marginTop: 8, fontSize: 13, color: Colors.light.text, fontFamily: Fonts.medium },
});