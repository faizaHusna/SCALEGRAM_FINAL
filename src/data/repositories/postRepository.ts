import { Post } from '@/domain/entities/Post';
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import app from '../firebase/firebaseConfig';
import { uploadImage } from '../services/CloudinaryService';

const db = getFirestore(app);

export class PostRepository implements IPostRepository {
  
  // 1. Ambil data single post berdasarkan ID
  async getPostById(postId: string): Promise<Post> {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId || '',
          username: data.username || 'Anonymous',
          caption: data.caption || '',
          imageUrl: data.imageUrl || data.url || '',
          likes: Array.isArray(data.likes) ? data.likes : [],
          comments: typeof data.comments === 'number' ? data.comments : 0,
          createdAt: data.createdAt ?? Date.now(),
          mediaType: data.mediaType || 'image',
          savedBy: Array.isArray(data.savedBy) ? data.savedBy : [] // 👈 AMBIL DATA SAVED BY DARI FIRESTORE
        };
      } else {
        throw new Error("Post not found");
      }
    } catch (error) {
      console.error("Gagal mengambil single post dari Firestore:", error);
      throw error;
    }
  }

  // 2. Ambil data posts asli dari Firestore
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
          comments: typeof data.comments === 'number' ? data.comments : 0,
          createdAt: data.createdAt ?? Date.now(),
          mediaType: data.mediaType || 'image',
          savedBy: Array.isArray(data.savedBy) ? data.savedBy : [] // 👈 AMBIL DATA SAVED BY DARI FIRESTORE
        };
      });
      
      return posts;
    } catch (error) {
      console.error("Gagal mengambil data dari Firestore:", error);
      throw error;
    }
  }

  // 3. Buat post baru ke Firestore
  async createPost(post: Omit<Post, "id">): Promise<void> {
    try {
      let finalImageUrl = post.imageUrl;
      
      if (post.imageUrl && (post.imageUrl.startsWith("file:") || post.imageUrl.startsWith("ph:") || post.imageUrl.startsWith("content:"))) {
        console.log("Mendeteksi file lokal, memulai upload ke Cloudinary...");
        
        const cloudinaryResponse: any = await uploadImage(post.imageUrl, post.mediaType || 'image');
        
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
        comments: typeof post.comments === 'number' ? post.comments : 0,
        createdAt: post.createdAt ?? Date.now(),
        mediaType: post.mediaType || 'image',
        savedBy: [], // 👈 INISIALISASI ARRAY KOSONG UNTUK SIMPAN/BOOKMARK DI FIRESTORE
      });
      
    } catch (error) {
      console.error("Gagal menyimpan post ke Firestore:", error);
      throw error;
    }
  }

  async toggleLike(postId: string, userId: string, isCurrentlyLiked: boolean): Promise<void> {
    try {
      const docRef = doc(db, "posts", postId);
      await updateDoc(docRef, {
        likes: isCurrentlyLiked ? arrayRemove(userId) : arrayUnion(userId)
      });
      console.log(`Berhasil ${isCurrentlyLiked ? 'unlike' : 'like'} postingan: ${postId}`);
    } catch (error) {
      console.error("Gagal melakukan toggle like:", error);
      throw error;
    }
  }

  async addComment(postId: string, userId: string, username: string, text: string): Promise<void> {
    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        userId,
        username,
        text,
        createdAt: Date.now()
      });

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: increment(1)
      });

      console.log("Komentar berhasil ditambahkan.");
    } catch (error) {
      console.error("Gagal menambah komentar:", error);
      throw error;
    }
  }

  async updatePost(postId: string, caption: string): Promise<void> {
    try {
      const docRef = doc(db, "posts", postId);
      await updateDoc(docRef, { caption: caption });
      console.log(`Postingan dengan ID: ${postId} berhasil diperbarui di Firebase.`);
    } catch (error) {
      console.error("Gagal memperbarui postingan di Firestore:", error);
      throw error;
    }
  }

  // 👇 5. FUNGSI BARU UNTUK SYNC BOOKMARK KE CLOUD DATABASE (FIRESTORE)
  async toggleSavePost(postId: string, userId: string, isCurrentlySaved: boolean): Promise<void> {
    try {
      const docRef = doc(db, "posts", postId);
      
      // Jika isCurrentlySaved TRUE -> Hapus user dari list bookmark (unsave)
      // Jika isCurrentlySaved FALSE -> Tambah user ke list bookmark (save)
      await updateDoc(docRef, {
        savedBy: isCurrentlySaved ? arrayRemove(userId) : arrayUnion(userId)
      });
      
      console.log(`Berhasil ${isCurrentlySaved ? 'batal simpan' : 'menyimpan'} postingan: ${postId}`);
    } catch (error) {
      console.error("Gagal melakukan toggle save post ke Firestore:", error);
      throw error;
    }
  }
}