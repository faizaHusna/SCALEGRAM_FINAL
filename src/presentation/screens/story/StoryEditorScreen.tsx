import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function StoryEditorScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Gambar Story */}
      <Image source={{ uri: imageUri }} style={styles.image} />

      {/* Header Tombol (Batal & Simpan) */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="white" />
        </Pressable>
        <Pressable style={styles.saveButton} onPress={() => console.log("Upload Story!")}>
          <Text style={styles.saveText}>Bagikan</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  image: { flex: 1, width: '100%', height: '100%' },
  header: { 
    position: 'absolute', top: 50, left: 20, right: 20, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' 
  },
  saveButton: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  saveText: { color: 'white', fontWeight: 'bold' }
});