import { User as DomainUser } from '@/domain/entities/User';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  User as FirebaseAuthUser,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword as updatePasswordFirebase,
  updateProfile
} from 'firebase/auth';
// ✅ PERBAIKAN 1: Tambahkan 'getDoc' ke dalam impor firestore
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig';

const db = getFirestore();

export class AuthRepository implements IAuthRepository {

  // Fungsi pembantu untuk memetakan data ke entitas Clean Architecture Anda
  private mapToDomainUser(firebaseUser: FirebaseAuthUser, username?: string, nickname?: string): DomainUser {
    return {
      id: firebaseUser.uid || 'mock_id',
      email: firebaseUser.email || '',
      // ✅ Sekarang username & nickname dijamin mendapatkan data asli dari Firestore
      username: username || 'user_scalegram',
      nickname: nickname || firebaseUser.displayName || 'Nama Pengguna', 
      avatarUrl: 'https://picsum.photos/200',
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  // ✅ 1. Login dengan sinkronisasi data Firestore
  async login(email: string, password: string): Promise<DomainUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Tarik data profil asli dari Firestore berdasarkan UID
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      // Petakan dengan username dan nickname asli dari database
      return this.mapToDomainUser(firebaseUser, userData.username, userData.nickname);
    }

    return this.mapToDomainUser(firebaseUser);
  }

  // 2. Register Baru (Sudah Aman)
  async register(nickname: string, username: string, email: string, password: string): Promise<DomainUser> {
    const cleanUsername = username.toLowerCase().trim();
    const cleanNickname = nickname.trim();

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", cleanUsername));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error("Username sudah digunakan oleh orang lain! Silakan pilih nama lain.");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, {
      displayName: cleanNickname
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: email,
      nickname: cleanNickname, 
      username: cleanUsername, 
      createdAt: new Date().toISOString()
    });

    return this.mapToDomainUser(userCredential.user, cleanUsername, cleanNickname);
  }

  // 3. Logout Asli Firebase
  async logout(): Promise<void> {
    await signOut(auth);
    console.log('User berhasil logout dari Firebase Auth.');
  }

  // 4. Reset Password Asli Firebase
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
    console.log(`Email reset password terkirim via Firebase.`);
  }

  // ✅ 5. Cek Sesi Aktif dengan sinkronisasi data Firestore
  async getCurrentUser(): Promise<DomainUser | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    // Pastikan saat aplikasi dibuka kembali, data username tidak hilang
    const userDocRef = doc(db, "users", currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return this.mapToDomainUser(currentUser, userData.username, userData.nickname);
    }

    return this.mapToDomainUser(currentUser);
  }

  // 6. Update/Ganti Password Aman dengan Re-autentikasi
  async updatePassword(passwordLama: string, passwordBaru: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error("Sesi pengguna tidak ditemukan. Silakan login kembali.");
    }
    if (passwordLama === passwordBaru) {
      throw new Error("Password baru tidak boleh sama dengan password Anda saat ini!");
    }
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, passwordLama);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePasswordFirebase(currentUser, passwordBaru);
    } catch (error: any) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        throw new Error("Password lama yang Anda masukkan salah.");
      } else {
        throw new Error(error.message || "Gagal memperbarui password.");
      }
    }
  }
}