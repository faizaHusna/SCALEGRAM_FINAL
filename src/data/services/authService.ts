import {
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

export async function login(
  email: string,
  password: string
): Promise<User> {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
}

export const getCurrentUser = () => {
  return auth.currentUser;
};

export async function register(
  username: string,
  email: string,
  password: string
): Promise<User> {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  await updateProfile(userCredential.user, {
    displayName: username,
  });

  return userCredential.user;
}

export async function resetPassword(
  email: string
): Promise<void> {
  await sendPasswordResetEmail(
    auth,
    email
  );
}

export async function logout(): Promise<void> {
  await signOut(auth);
}