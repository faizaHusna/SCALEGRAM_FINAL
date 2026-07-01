import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

export async function login(
  email: string,
  password: string
) {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function register(
  username: string,
  email: string,
  password: string
) {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  await updateProfile(userCredential.user, {
    displayName: username,
  });

  return userCredential;
}

export async function resetPassword(
  email: string
) {
  return await sendPasswordResetEmail(
    auth,
    email
  );
}

export async function logout() {
  return await signOut(auth);
}