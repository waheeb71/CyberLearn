import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * زيادة عدد الزوار عند كل زيارة
 */
export async function trackVisitor() {
  try {
    const ref = doc(db, "stats", "visitors"); // وثيقة ثابتة داخل collection stats
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // أول مرة
      await setDoc(ref, { count: 1 });
      return 1;
    } else {
      // زيادة
      await updateDoc(ref, { count: increment(1) });
      const updated = await getDoc(ref);
      return updated.data().count;
    }
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return 0;
  }
}

/**
 * إرجاع العدد الحالي للزوار
 */
export async function getVisitorsCount() {
  try {
    const ref = doc(db, "stats", "visitors");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().count : 0;
  } catch (error) {
    console.error("Error getting visitors count:", error);
    return 0;
  }
}
