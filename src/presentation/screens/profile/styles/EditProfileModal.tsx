import { Colors } from "@/core/theme/colors";
import { Fonts } from "@/core/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker"; // 💡 1. Impor Image Picker dari Expo
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  user: any;
  setUser: (user: any) => void;
}

// 💡 2. Daftar avatar default baru dengan kombinasi warna pastel yang estetik
const PASTEL_AVATARS = [
  "https://ui-avatars.com/api/?name=SG&background=c0aede&color=fff&size=128&bold=true", // Lavender
  "https://ui-avatars.com/api/?name=SG&background=b6e3f4&color=fff&size=128&bold=true", // Mint Blue
  "https://ui-avatars.com/api/?name=SG&background=f3d5b5&color=fff&size=128&bold=true", // Peach Muted
  "https://ui-avatars.com/api/?name=SG&background=e8aeae&color=fff&size=128&bold=true", // Pastel Rose
  "https://ui-avatars.com/api/?name=SG&background=b5c7f3&color=fff&size=128&bold=true", // Soft Denim
  "https://ui-avatars.com/api/?name=SG&background=d1e4e3&color=fff&size=128&bold=true", // Sage Pastel
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isVisible, onClose, user, setUser }) => {
  const [editNickname, setEditNickname] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // Sinkronisasi data awal saat modal terbuka
  useEffect(() => {
    if (isVisible) {
      setEditNickname(user?.nickname || "");
      setEditUsername(user?.username || "");
      setEditBio(user?.bio || "Digital Creator | Photography Enthusiast ✨");
      setEditAvatar(user?.avatarUrl || PASTEL_AVATARS[0]);
    }
  }, [isVisible, user]);

  // 💡 3. Fungsi untuk membuka galeri handphone pengguna
  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Izin Ditolak", "Aplikasi membutuhkan akses galeri untuk mengubah foto profil.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Mengunci rasio kotak/persegi agar pas saat dijadikan lingkaran
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditAvatar(result.assets[0].uri); // Simpan path URI lokal dari galeri
    }
  };

  const handleSave = () => {
    if (!editNickname.trim() || !editUsername.trim()) {
      Alert.alert("Error", "Nama panggilan dan username tidak boleh kosong.");
      return;
    }
    if (user) {
      setUser({
        ...user,
        nickname: editNickname.trim(),
        username: editUsername.trim().replace(/\s+/g, "_").toLowerCase(),
        bio: editBio.trim(),
        avatarUrl: editAvatar,
      });
      onClose();
      Alert.alert("Sukses", "Profil Anda berhasil diperbarui!");
    }
  };

  // Cek apakah avatar saat ini berasal dari galeri luar (bukan dari daftar preset pastel)
  const isCustomGalleryAvatar = !PASTEL_AVATARS.includes(editAvatar);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalBackdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profil</Text>
            <Pressable onPress={onClose} style={styles.closeModalBtn}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.inputSectionLabel}>Pilih Foto Profil Kreatif</Text>

            <View style={styles.presetAvatarsContainer}>
              {/* 💡 4. TOMBOL GALERI KUSTOM (Berada di deretan pertama lingkaran) */}
              <Pressable
                onPress={pickImageFromGallery}
                style={[
                  styles.presetAvatarWrapper,
                  styles.galleryPickButton,
                  isCustomGalleryAvatar && styles.presetAvatarWrapperActive
                ]}
              >
                {isCustomGalleryAvatar ? (
                  <Image source={{ uri: editAvatar }} style={styles.presetAvatarImage} />
                ) : (
                  <Ionicons name="image-outline" size={22} color="#666" />
                )}

                {isCustomGalleryAvatar && (
                  <View style={styles.avatarCheckedBadge}>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.light.primary} />
                  </View>
                )}
              </Pressable>

              {PASTEL_AVATARS.map((av, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setEditAvatar(av)}
                  style={[styles.presetAvatarWrapper, editAvatar === av && styles.presetAvatarWrapperActive]}
                >
                  {/* 💡 Tambahkan contentFit="cover" di sini */}
                  <Image source={{ uri: av }} style={styles.presetAvatarImage} contentFit="cover" />

                  {editAvatar === av && (
                    <View style={styles.avatarCheckedBadge}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.light.primary} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nama Lengkap / Nickname</Text>
              <TextInput value={editNickname} onChangeText={setEditNickname} style={styles.textInput} placeholder="Masukkan nama panggilan..." placeholderTextColor="#9C9C9C" />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Username Unik</Text>
              <TextInput value={editUsername} onChangeText={setEditUsername} style={styles.textInput} placeholder="Masukkan username..." placeholderTextColor="#9C9C9C" autoCapitalize="none" autoCorrect={false} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bio Singkat</Text>
              <TextInput value={editBio} onChangeText={setEditBio} style={[styles.textInput, styles.textArea]} placeholder="Tulis bio profil Anda di sini..." placeholderTextColor="#9C9C9C" multiline={true} numberOfLines={3} />
            </View>

            <Pressable style={styles.saveChangesButton} onPress={handleSave}>
              <Text style={styles.saveChangesButtonText}>Simpan Perubahan</Text>
            </Pressable>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, height: "85%", width: "100%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#EAEAEF" },
  modalTitle: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.light.text },
  closeModalBtn: { padding: 4 },
  modalScroll: { flex: 1 },
  inputSectionLabel: { fontSize: 14, fontFamily: Fonts.bold, color: Colors.light.text, paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },
  presetAvatarsContainer: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 12, marginBottom: 20 },
  presetAvatarWrapper: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: "transparent", position: "relative" },
  presetAvatarWrapperActive: { borderColor: Colors.light.primary },
  presetAvatarImage: { width: "100%", height: "100%", borderRadius: 27 }, // Disesuaikan agar lingkaran sempurna dengan pembungkusnya
  galleryPickButton: { backgroundColor: "#F2F2F7", justifyContent: "center", alignItems: "center", borderStyle: "dashed", borderWidth: 1.5, borderColor: "#B5B5BE" },
  avatarCheckedBadge: { position: "absolute", bottom: -4, right: -4, backgroundColor: "#FFF", borderRadius: 10 },
  formGroup: { paddingHorizontal: 16, marginBottom: 16 },
  formLabel: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.light.text, marginBottom: 6 },
  textInput: { backgroundColor: "#F2F2F7", borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, fontFamily: Fonts.regular, color: Colors.light.text },
  textArea: { height: 80, paddingTop: 10, textAlignVertical: "top" },
  saveChangesButton: { backgroundColor: Colors.light.primary, marginHorizontal: 16, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 12 },
  saveChangesButtonText: { color: "#FFF", fontFamily: Fonts.bold, fontSize: 15 },
});