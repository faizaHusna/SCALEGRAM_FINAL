import { useAuthStore } from "@/store/authStore"; // Pastikan path store benar
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function UserProfile() {
  const { username } = useLocalSearchParams();
  const router = useRouter();
  
  // Mengambil user yang sedang login dari store
  const loggedInUser = useAuthStore((state) => state.user);

  // LOGIKA: Jika username di URL sama dengan username user yang login, 
  // berarti ini profil saya.
  const isMyProfile = username === loggedInUser?.username;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil: {username}</Text>
      
      {isMyProfile ? (
        <View style={styles.buttonContainer}>
          <Text style={styles.info}>Ini adalah profil Anda sendiri.</Text>
          <Pressable style={styles.button} onPress={() => console.log("Edit Profil")}>
            <Text style={styles.buttonText}>Edit Profil</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Text style={styles.info}>Ini profil orang lain.</Text>
          <Pressable style={[styles.button, { backgroundColor: '#4F46E5' }]} onPress={() => console.log("Follow")}>
            <Text style={styles.buttonText}>Follow</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 10, color: '#666' },
  buttonContainer: { alignItems: 'center' },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#eee' },
  buttonText: { fontSize: 16, fontWeight: '600' }
});