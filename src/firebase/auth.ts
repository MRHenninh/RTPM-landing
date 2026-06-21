import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./config";

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred;
}

export function signOut() {
  return fbSignOut(auth);
}

export function watchAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
