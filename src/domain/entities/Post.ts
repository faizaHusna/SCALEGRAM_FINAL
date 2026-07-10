export interface Post {
  id: string;
  userId: string;
  username: string;
  caption: string;
  imageUrl: string;
  likes: string[];    // 💡 Diubah jadi array string berisi ID User yang nge-like (Sangat krusial untuk logika UI tombol hati)
  comments: number;   // Jumlah total komentar
  createdAt: number;  // Timestamp format milidetik / detik
}