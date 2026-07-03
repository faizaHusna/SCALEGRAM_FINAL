import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOcm82xMGhKm-CyLBUfepfXa-24tgS0ek",
  authDomain: "scalegram-65e92.firebaseapp.com",
  projectId: "scalegram-65e92",
  storageBucket: "scalegram-65e92.firebasestorage.app",
  messagingSenderId: "64994097285",
  appId: "1:64994097285:web:2f7b76666e1f0c877511ec",
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("app =", app);
console.log("db =", db);

export default app;