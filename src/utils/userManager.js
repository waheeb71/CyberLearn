// UserManager.js
import { db } from './firebaseConfig'; // استيراد قاعدة البيانات من ملف الإعداد
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
class UserManager {
  constructor() {
    this.usersCollectionRef = collection(db, 'users');
    this.currentUserKey = 'cyberlearn_current_user_id';
  }
  

  async register(userData) {
    const { name, email, password } = userData;
    
    if (!name || !email || !password) {
      return { success: false, message: 'جميع الحقول مطلوبة' };
    }

    if (password.length < 6) {
      return { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }

    try {
      // التحقق من وجود المستخدم مسبقًا
      const userRef = doc(this.usersCollectionRef, email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { success: false, message: 'المستخدم موجود بالفعل' };
      }

      // إنشاء مستخدم جديد في Firestore
      const newUser = {
        id: email, // استخدام البريد الإلكتروني كمعرف فريد
        name,
        email,
        password, // تذكير: يجب استخدام Firebase Auth لحفظ كلمات المرور بشكل آمن
        registrationDate: new Date().toISOString(),
        level: 1,
        totalPoints: 0,
        isAdmin: email === 'waheebamoonh@gmail.com',
        progress: {
      
        basics: { completed: false, score: 0, completedAt: null },
        fundamentals: { completed: false, score: 0, completedAt: null },
        specialization: { completed: false, score: 0, completedAt: null },
        practicalExperience: { completed: false, score: 0, completedAt: null },
        continuousLearning: { completed: false, score: 0, completedAt: null },
        youtubeChannels: { completed: false, score: 0, completedAt: null },
        jobRoles: { completed: false, score: 0, completedAt: null },
        certifications: { completed: false, score: 0, completedAt: null },
        roadmap: { completed: false, score: 0, completedAt: null },
        additionalResources: { completed: false, score: 0, completedAt: null }
        }
      };

      await setDoc(userRef, newUser);
      
   
      localStorage.setItem(this.currentUserKey, newUser.id);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, message: 'حدث خطأ أثناء التسجيل' };
    }
  }
  
  async login(email, password) {
    if (!email || !password) {
      return { success: false, message: 'البريد الإلكتروني وكلمة المرور مطلوبان' };
    }

    try {
      const userRef = doc(this.usersCollectionRef, email);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return { success: false, message: 'المستخدم غير موجود' };
      }

      const userData = userSnap.data();
      
      if (userData.password !== password) {
        return { success: false, message: 'كلمة المرور غير صحيحة' };
      }

      // حفظ معرف المستخدم في localStorage لتتبع الجلسة
      localStorage.setItem(this.currentUserKey, userData.id);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
    return { success: true };
  }

  async getCurrentUser() {
  const currentUserId = localStorage.getItem(this.currentUserKey);
  if (!currentUserId) {
    return null;
  }
  // جلب بيانات المستخدم من Firestore
  const userRef = doc(this.usersCollectionRef, currentUserId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    this.logout();
    return null;
  }
}


  async updateUserProgress(sectionKey, completed, score) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    try {
      const userRef = doc(this.usersCollectionRef, currentUser.id);
      
      // تحديث البيانات في Firestore
      const newProgress = { ...currentUser.progress };
      newProgress[sectionKey] = {
        completed,
        score: completed ? score : 0,
        completedAt: completed ? new Date().toISOString() : null
      };

      const totalPoints = Object.values(newProgress)
        .filter(p => p.completed)
        .reduce((total, p) => total + p.score, 0);

      const newLevel = Math.floor(totalPoints / 50) + 1;

      await updateDoc(userRef, {
        progress: newProgress,
        totalPoints,
        level: newLevel
      });

      // جلب البيانات المحدثة
      const updatedUser = await this.getCurrentUser();
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Error updating progress:", error);
      return { success: false, message: 'حدث خطأ أثناء تحديث التقدم' };
    }
  }

  async deleteAccount() {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    try {
      await deleteDoc(doc(this.usersCollectionRef, currentUser.id));
      this.logout();
      return { success: true };
    } catch (error) {
      console.error("Error deleting account:", error);
      return { success: false, message: 'حدث خطأ أثناء حذف الحساب' };
    }
  }
}

const userManager = new UserManager();

export default userManager;