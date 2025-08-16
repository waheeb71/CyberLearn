import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * إرجاع عدد المستخدمين من Firestore
 */
export async function getUsersCount() {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.size; // عدد المستخدمين
  } catch (error) {
    console.error("Error getting users count:", error);
    return 0;
  }
}
