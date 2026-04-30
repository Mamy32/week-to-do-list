import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export const signIn = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    alert(error.message);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    alert(error.message);
  }
};