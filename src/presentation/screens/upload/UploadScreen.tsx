import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
} from "react-native";

import { router } from "expo-router";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import Screen from "@/presentation/components/Screen";
import Button from "@/presentation/components/Button";

import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Shadows } from "@/core/theme/shadows";
import { uploadPost } from "@/data/services/uploadService";

export default function UploadScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  async function pickImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>
        Create Post
      </Text>

      <TouchableOpacity
        style={styles.imagePicker}
        activeOpacity={0.9}
        onPress={pickImage}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        ) : (
          <>
            <Ionicons
              name="image-outline"
              size={70}
              color="#B7B7B7"
            />

            <Text style={styles.pickText}>
              Tap to choose image
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>
          Caption
        </Text>

        <TextInput
          multiline
          maxLength={300}
          placeholder="Share your thoughts..."
          placeholderTextColor="#A6A6A6"
          style={styles.input}
          value={caption}
          onChangeText={setCaption}
        />

        <Text style={styles.counter}>
          {caption.length}/300
        </Text>
      </View>

      <Button
  title="Upload Post"
  onPress={async () => {
    if (!image) {
      Alert.alert("Oops", "Please choose an image first.");
      return;
    }

    try {
      await uploadPost(image, caption);

      Alert.alert(
        "Success",
        "Your post has been uploaded!"
      );

      setImage(null);
      setCaption("");

      router.replace("/feed");
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Upload Failed",
        "Something went wrong."
      );
    }
  }}
/>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontFamily: Fonts.bold,
    color: Colors.light.text,
    marginBottom: 24,
  },

  imagePicker: {
    height: 320,
    borderRadius: 24,

    backgroundColor: "#F5F5F7",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,

    ...Shadows.card,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },

  pickText: {
    marginTop: 14,

    fontFamily: Fonts.medium,
    color: "#8A8A8A",

    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 22,

    padding: 18,

    marginBottom: 24,

    ...Shadows.card,
  },

  label: {
    fontFamily: Fonts.semiBold,
    color: Colors.light.text,

    marginBottom: 10,

    fontSize: 16,
  },

  input: {
    minHeight: 110,

    textAlignVertical: "top",

    fontFamily: Fonts.regular,

    fontSize: 15,

    color: Colors.light.text,
  },

  counter: {
    alignSelf: "flex-end",

    marginTop: 10,

    fontFamily: Fonts.medium,

    color: "#9C9C9C",
  },
});