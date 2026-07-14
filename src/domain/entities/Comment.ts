export interface Comment {
  id: string;          // ID unik untuk setiap dokumen komentar di Firestore
  postId: string;      // ID postingan tempat komentar ini berada (merujuk ke Post.id)
  userId: string;      // ID user yang menulis komentar (merujuk ke User.id)
  username: string;    // Nickname pembuat komentar (misal: budi_scale) untuk render instan tanpa fetch ulang
  avatarUrl?: string;  // Foto profil pembuat komentar (opsional) agar bisa langsung muncul di sebelah teks
  text: string;        // Isi teks komentar dari user
  createdAt: number;   // Waktu komentar dibuat (gunakan format 'number' agar sinkron dengan Post.ts)
}