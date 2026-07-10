export interface User {
  id: string;             // ID unik user dari Firebase Auth
  username: string;       // Nickname unik (misal: budi_scale)
  nickname: string;       // Nama tampilan/panggilan (misal: Budi Budiman)
  email: string;          // Alamat email aktif
  avatarUrl?: string;     // URL foto profil (opsional)
  bio?: string;           // Deskripsi singkat profil (opsional)
  followersCount: number; // Jumlah pengikut
  followingCount: number; // Jumlah yang diikuti
  createdAt: string;      // Waktu akun dibuat (ISO String format)
}