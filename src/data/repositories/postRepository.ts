import { Post } from '@/domain/entities/Post';
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { addDoc, collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import app from '../firebase/firebaseConfig';
import { uploadImage } from '../services/CloudinaryService';

const db = getFirestore(app);

export class PostRepository implements IPostRepository {
  
  // 1. Ambil data posts asli dari Firestore
  async getPosts(): Promise<Post[]> {
    try {
      const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(postsQuery);
      
      const posts: Post[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || '',
          username: data.username || 'Anonymous',
          caption: data.caption || '',
          imageUrl: data.imageUrl || data.url || '',
          likes: Array.isArray(data.likes) ? data.likes : [], 
          // ✅ PERBAIKAN 1: Kembalikan ke tipe 'number' sesuai kontrak entitas Post kelompok Anda
          comments: typeof data.comments === 'number' ? data.comments : 0,
          createdAt: data.createdAt ?? Date.now()
        };
      });
      
      return posts;
    } catch (error) {
      console.error("Gagal mengambil data dari Firestore:", error);
      throw error;
    }
  }

  // 2. Buat post baru ke Firestore
  async createPost(post: Omit<Post, "id">): Promise<void> {
    try {
      let finalImageUrl = post.imageUrl;
      
      if (post.imageUrl && (post.imageUrl.startsWith("file:") || post.imageUrl.startsWith("ph:") || post.imageUrl.startsWith("content:"))) {
        console.log("Mendeteksi file lokal, memulai upload ke Cloudinary...");
        
        // ✅ PERBAIKAN 2: Berikan asersi tipe data 'any' sementara pada respons Cloudinary 
        // agar TypeScript tidak membacanya sebagai tipe 'never'
        const cloudinaryResponse: any = await uploadImage(post.imageUrl);
        
        if (cloudinaryResponse && typeof cloudinaryResponse === 'object') {
          finalImageUrl = cloudinaryResponse.secure_url || cloudinaryResponse.url || post.imageUrl;
        } else if (typeof cloudinaryResponse === 'string') {
          finalImageUrl = cloudinaryResponse;
        }
      }

      await addDoc(collection(db, "posts"), {
        userId: post.userId || 'temp-user',
        username: post.username || 'Guest', 
        caption: post.caption,
        imageUrl: finalImageUrl,
        likes: Array.isArray(post.likes) ? post.likes : [], 
        // ✅ PERBAIKAN 3: Samakan nilai default simpanan sebagai number (0)
        comments: typeof post.comments === 'number' ? post.comments : 0,
        createdAt: post.createdAt ?? Date.now(),
      });
      
    } catch (error) {
      console.error("Gagal menyimpan post ke Firestore:", error);
      throw error;
    }
  }
}