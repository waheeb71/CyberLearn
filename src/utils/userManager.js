// UserManager.js
import { db } from './firebaseConfig'; // استيراد قاعدة البيانات من ملف الإعداد
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

class UserManager {
  constructor() {
    this.usersCollectionRef = collection(db, 'users');
    this.currentUserKey = 'cyberlearn_current_user_id';
  }

  // تهيئة بيانات المسارات الافتراضية
  getDefaultPathProgress(pathName) {
    const pathStructures = {
      cybersecurity: {
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
      },
      ai: {
        basics: { completed: false, score: 0, completedAt: null },
        machineLearning: { completed: false, score: 0, completedAt: null },
        practicalProjects: { completed: false, score: 0, completedAt: null },
        continuousLearning: { completed: false, score: 0, completedAt: null }
      }
    };

    return {
      totalPoints: 0,
      level: 1,
      completedSections: 0,
      progress: pathStructures[pathName] || {}
    };
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

      // إنشاء مستخدم جديد في Firestore مع الهيكل الجديد
      const newUser = {
        id: email, // استخدام البريد الإلكتروني كمعرف فريد
        name,
        email,
        password, 
        registrationDate: new Date().toISOString(),
        level: 1,
        totalPoints: 0,
        isAdmin: email === 'waheebamoonh@gmail.com',
        
        // المسارات المشترك بها (فارغة في البداية)
        enrolledPaths: [],
        
        // تقدم كل مسار بشكل منفصل
        pathsProgress: {},
        
        // الحفاظ على البيانات القديمة للتوافق مع النظام الحالي
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

      // ترحيل البيانات القديمة إذا لم تكن موجودة
      let updatedUserData = userData;
      if (!userData.enrolledPaths || !userData.pathsProgress) {
        updatedUserData = await this.migrateUserData(userData);
      }

      // حفظ معرف المستخدم في localStorage لتتبع الجلسة
      localStorage.setItem(this.currentUserKey, updatedUserData.id);
      
      return { success: true, user: updatedUserData };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  }

  // ترحيل البيانات القديمة للمستخدمين الحاليين
  async migrateUserData(userData) {
    try {
      const userRef = doc(this.usersCollectionRef, userData.id);
      
      const updatedData = {
        ...userData,
        enrolledPaths: userData.enrolledPaths || ['cybersecurity'], // إضافة مسار الأمن السيبراني للمستخدمين الحاليين
        pathsProgress: userData.pathsProgress || {
          cybersecurity: {
            totalPoints: userData.totalPoints || 0,
            level: userData.level || 1,
            completedSections: Object.values(userData.progress || {}).filter(p => p.completed).length,
            progress: userData.progress || this.getDefaultPathProgress('cybersecurity').progress
          }
        }
      };

      await updateDoc(userRef, updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error migrating user data:", error);
      return userData;
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
    
    try {
      // جلب بيانات المستخدم من Firestore
      const userRef = doc(this.usersCollectionRef, currentUserId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        // ترحيل البيانات إذا لم تكن موجودة
        if (!userData.enrolledPaths || !userData.pathsProgress) {
          return await this.migrateUserData(userData);
        }
        
        return userData;
      } else {
        this.logout();
        return null;
      }
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // الاشتراك في مسار تعلم جديد
  async enrollInPath(pathName) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    // التحقق من أن المستخدم غير مشترك في المسار بالفعل
    if (currentUser.enrolledPaths && currentUser.enrolledPaths.includes(pathName)) {
      return { success: false, message: 'أنت مشترك في هذا المسار بالفعل' };
    }

    try {
      const userRef = doc(this.usersCollectionRef, currentUser.id);
      
      const updatedEnrolledPaths = [...(currentUser.enrolledPaths || []), pathName];
      const updatedPathsProgress = {
        ...currentUser.pathsProgress,
        [pathName]: this.getDefaultPathProgress(pathName)
      };

      await updateDoc(userRef, {
        enrolledPaths: updatedEnrolledPaths,
        pathsProgress: updatedPathsProgress
      });

      // جلب البيانات المحدثة
      const updatedUser = await this.getCurrentUser();
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Error enrolling in path:", error);
      return { success: false, message: 'حدث خطأ أثناء الاشتراك في المسار' };
    }
  }

  // تحديث تقدم مسار محدد
  async updatePathProgress(pathName, sectionKey, completed, score) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    // التحقق من أن المستخدم مشترك في المسار
    if (!currentUser.enrolledPaths || !currentUser.enrolledPaths.includes(pathName)) {
      return { success: false, message: 'أنت غير مشترك في هذا المسار' };
    }

    try {
      const userRef = doc(this.usersCollectionRef, currentUser.id);
      
      // تحديث تقدم المسار المحدد
      const pathProgress = currentUser.pathsProgress[pathName] || this.getDefaultPathProgress(pathName);
      const newProgress = { ...pathProgress.progress };
      
      newProgress[sectionKey] = {
        completed,
        score: completed ? score : 0,
        completedAt: completed ? new Date().toISOString() : null
      };

      // حساب النقاط والمستوى للمسار
      const completedSections = Object.values(newProgress).filter(p => p.completed).length;
      const totalPoints = Object.values(newProgress)
        .filter(p => p.completed)
        .reduce((total, p) => total + p.score, 0);
      const level = Math.floor(totalPoints / 50) + 1;

      const updatedPathProgress = {
        ...pathProgress,
        progress: newProgress,
        totalPoints,
        level,
        completedSections
      };

      // حساب النقاط الإجمالية لجميع المسارات
      const allPathsProgress = {
        ...currentUser.pathsProgress,
        [pathName]: updatedPathProgress
      };

      const overallTotalPoints = Object.values(allPathsProgress)
        .reduce((total, path) => total + (path.totalPoints || 0), 0);
      const overallLevel = Math.floor(overallTotalPoints / 50) + 1;

      // تحديث البيانات في Firestore
      const updateData = {
        pathsProgress: allPathsProgress,
        totalPoints: overallTotalPoints,
        level: overallLevel
      };

      // إذا كان المسار هو الأمن السيبراني، حديث البيانات القديمة أيضاً للتوافق
      if (pathName === 'cybersecurity') {
        updateData.progress = newProgress;
      }

      await updateDoc(userRef, updateData);

      // جلب البيانات المحدثة
      const updatedUser = await this.getCurrentUser();
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Error updating path progress:", error);
      return { success: false, message: 'حدث خطأ أثناء تحديث التقدم' };
    }
  }

  // الحصول على تقدم مسار محدد
  async getPathProgress(pathName) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    if (!currentUser.enrolledPaths || !currentUser.enrolledPaths.includes(pathName)) {
      return { success: false, message: 'أنت غير مشترك في هذا المسار' };
    }

    const pathProgress = currentUser.pathsProgress[pathName] || this.getDefaultPathProgress(pathName);
    return { success: true, progress: pathProgress };
  }

  // إلغاء الاشتراك من مسار (اختياري)
  async unenrollFromPath(pathName) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    if (!currentUser.enrolledPaths || !currentUser.enrolledPaths.includes(pathName)) {
      return { success: false, message: 'أنت غير مشترك في هذا المسار' };
    }

    try {
      const userRef = doc(this.usersCollectionRef, currentUser.id);
      
      const updatedEnrolledPaths = currentUser.enrolledPaths.filter(path => path !== pathName);
      const updatedPathsProgress = { ...currentUser.pathsProgress };
      delete updatedPathsProgress[pathName];

      // إعادة حساب النقاط الإجمالية
      const overallTotalPoints = Object.values(updatedPathsProgress)
        .reduce((total, path) => total + (path.totalPoints || 0), 0);
     
       const overallLevel = Math.floor(overallTotalPoints / 50) + 1;

      await updateDoc(userRef, {
        enrolledPaths: updatedEnrolledPaths,
        pathsProgress: updatedPathsProgress,
        totalPoints: overallTotalPoints,
        level: overallLevel
      });

      const updatedUser = await this.getCurrentUser();
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Error unenrolling from path:", error);
      return { success: false, message: 'حدث خطأ أثناء إلغاء الاشتراك من المسار' };
    }
  }

  // الوظيفة القديمة للتوافق مع النظام الحالي
  async updateUserProgress(sectionKey, completed, score) {
    // استخدام مسار الأمن السيبراني كافتراضي للتوافق مع النظام القديم
    return await this.updatePathProgress('cybersecurity', sectionKey, completed, score);
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
