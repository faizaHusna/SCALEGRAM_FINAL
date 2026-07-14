import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
} from "firebase/firestore";

import { Post } from "@/domain/entities/Post";
import { db } from "../firebase/firebaseConfig";

console.log("db =", db);
console.log("collection =", collection);

const postCollection = collection(db, "posts");

export async function createPost(
  post: Omit<Post, "id">
) {
  return await addDoc(postCollection, post);
}

export async function getPosts() {
  const q = query(
    postCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
}