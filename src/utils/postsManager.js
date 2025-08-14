// Posts Management System using Firebase
import { db } from './firebaseConfig';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

// استيراد مدير المستخدمين للوصول إلى بيانات المستخدم الحالي
import userManager from './userManager';

class PostsManager {
  constructor() {
    this.postsCollectionRef = collection(db, 'posts');
    this.platformPostsCollectionRef = collection(db, 'platformPosts');
  }

  // Utility function to format links in text
  formatTextWithLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-red-500 hover:text-red-600 underline">$1</a>');
  }

  // Create a new post
  // الآن لا تحتاج لتمرير authorId و authorName
  async createPost(content, isPlatformPost = false) {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول لإنشاء منشور' };
    }

    if (!content) {
      return { success: false, message: 'محتوى المنشور مطلوب' };
    }

    if (content.trim().length === 0) {
      return { success: false, message: 'لا يمكن إنشاء منشور فارغ' };
    }

    try {
      const newPost = {
        content: content.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: [],
        replies: [],
        isPlatformPost,
        isVisible: true
      };

      const collectionRef = isPlatformPost ? this.platformPostsCollectionRef : this.postsCollectionRef;
      const docRef = await addDoc(collectionRef, newPost);

      return {
        success: true,
        postId: docRef.id,
        message: 'تم إنشاء المنشور بنجاح'
      };
    } catch (error) {
      console.error("Error creating post:", error);
      return { success: false, message: 'حدث خطأ أثناء إنشاء المنشور' };
    }
  }

  // Get all posts (user posts)
  async getPosts(limitCount = 50) {
    try {
      const q = query(
        this.postsCollectionRef,
        where('isVisible', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const posts = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
          formattedContent: this.formatTextWithLinks(data.content)
        });
      });

      return { success: true, posts };
    } catch (error) {
      console.error("Error getting posts:", error);
      return { success: false, message: 'حدث خطأ أثناء جلب المنشورات', posts: [] };
    }
  }

  // Get platform posts
  async getPlatformPosts(limitCount = 20) {
    try {
      const q = query(
        this.platformPostsCollectionRef,
        where('isVisible', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const posts = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
          formattedContent: this.formatTextWithLinks(data.content)
        });
      });

      return { success: true, posts };
    } catch (error) {
      console.error("Error getting platform posts:", error);
      return { success: false, message: 'حدث خطأ أثناء جلب منشورات المنصة', posts: [] };
    }
  }

  // Add reply to a post
  // الآن لا تحتاج لتمرير authorId و authorName
  async addReply(postId, content, isPlatformPost = false) {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول لإضافة رد' };
    }
    
    if (!content) {
      return { success: false, message: 'محتوى الرد مطلوب' };
    }

    if (content.trim().length === 0) {
      return { success: false, message: 'لا يمكن إضافة رد فارغ' };
    }

    try {
      const reply = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        content: content.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        createdAt: new Date(),
        formattedContent: this.formatTextWithLinks(content.trim())
      };

      const collectionRef = isPlatformPost ? this.platformPostsCollectionRef : this.postsCollectionRef;
      const postRef = doc(collectionRef, postId);

      await updateDoc(postRef, {
        replies: arrayUnion(reply),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        reply,
        message: 'تم إضافة الرد بنجاح'
      };
    } catch (error) {
      console.error("Error adding reply:", error);
      return { success: false, message: 'حدث خطأ أثناء إضافة الرد' };
    }
  }

  // Toggle like on a post
  // الآن لا تحتاج لتمرير userId
  async toggleLike(postId, isPlatformPost = false) {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول للإعجاب' };
    }

    const userId = currentUser.id;

    try {
      const collectionRef = isPlatformPost ? this.platformPostsCollectionRef : this.postsCollectionRef;
      const postRef = doc(collectionRef, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        return { success: false, message: 'المنشور غير موجود' };
      }

      const postData = postSnap.data();
      const likes = postData.likes || [];
      const isLiked = likes.includes(userId);

      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          updatedAt: serverTimestamp()
        });
      }

      return {
        success: true,
        isLiked: !isLiked,
        likesCount: isLiked ? likes.length - 1 : likes.length + 1,
        message: isLiked ? 'تم إلغاء الإعجاب' : 'تم الإعجاب بالمنشور'
      };
    } catch (error) {
      console.error("Error toggling like:", error);
      return { success: false, message: 'حدث خطأ أثناء تحديث الإعجاب' };
    }
  }

  // Delete a post (author or admin only)
  // الآن لا تحتاج لتمرير userId
  async deletePost(postId, isPlatformPost = false) {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول لحذف المنشور' };
    }

    try {
      const collectionRef = isPlatformPost ? this.platformPostsCollectionRef : this.postsCollectionRef;
      const postRef = doc(collectionRef, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        return { success: false, message: 'المنشور غير موجود' };
      }

      const postData = postSnap.data();

      // Check if user is the author or admin
      if (postData.authorId !== currentUser.id && !currentUser.isAdmin) {
        return { success: false, message: 'ليس لديك صلاحية لحذف هذا المنشور' };
      }

      await deleteDoc(postRef);

      return {
        success: true,
        message: 'تم حذف المنشور بنجاح'
      };
    } catch (error) {
      console.error("Error deleting post:", error);
      return { success: false, message: 'حدث خطأ أثناء حذف المنشور' };
    }
  }

  // Hide/Show post (admin function)
  async togglePostVisibility(postId, isPlatformPost = false) {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
      return { success: false, message: 'ليس لديك صلاحية لتعديل حالة المنشور' };
    }

    try {
      const collectionRef = isPlatformPost ? this.platformPostsCollectionRef : this.postsCollectionRef;
      const postRef = doc(collectionRef, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        return { success: false, message: 'المنشور غير موجود' };
      }

      const postData = postSnap.data();
      const newVisibility = !postData.isVisible;

      await updateDoc(postRef, {
        isVisible: newVisibility,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        isVisible: newVisibility,
        message: newVisibility ? 'تم إظهار المنشور' : 'تم إخفاء المنشور'
      };
    } catch (error) {
      console.error("Error toggling post visibility:", error);
      return { success: false, message: 'حدث خطأ أثناء تحديث حالة المنشور' };
    }
  }

  // Get post statistics (admin function)
  async getPostsStats() {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
      return { success: false, message: 'ليس لديك صلاحية لجلب الإحصائيات' };
    }

    try {
      const [userPostsSnapshot, platformPostsSnapshot] = await Promise.all([
        getDocs(this.postsCollectionRef),
        getDocs(this.platformPostsCollectionRef)
      ]);

      const userPosts = userPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const platformPosts = platformPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalUserPosts = userPosts.length;
      const totalPlatformPosts = platformPosts.length;
      const visibleUserPosts = userPosts.filter(post => post.isVisible).length;
      const visiblePlatformPosts = platformPosts.filter(post => post.isVisible).length;

      const totalLikes = [...userPosts, ...platformPosts].reduce((sum, post) => {
        return sum + (post.likes?.length || 0);
      }, 0);

      const totalReplies = [...userPosts, ...platformPosts].reduce((sum, post) => {
        return sum + (post.replies?.length || 0);
      }, 0);

      return {
        success: true,
        stats: {
          totalUserPosts,
          totalPlatformPosts,
          visibleUserPosts,
          visiblePlatformPosts,
          totalLikes,
          totalReplies,
          totalPosts: totalUserPosts + totalPlatformPosts
        }
      };
    } catch (error) {
      console.error("Error getting posts stats:", error);
      return { success: false, message: 'حدث خطأ أثناء جلب الإحصائيات' };
    }
  }

  // Search posts
  async searchPosts(searchTerm, isPlatformPost = false, limitCount = 20) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return { success: false, message: 'يرجى إدخال كلمة البحث', posts: [] };
    }

    try {
      const collectionRef = isPlatformPost ? this.platformPostsCollectionRef : this.postsCollectionRef;
      const querySnapshot = await getDocs(collectionRef);

      const posts = [];
      const searchTermLower = searchTerm.toLowerCase();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isVisible &&
          (data.content.toLowerCase().includes(searchTermLower) ||
            data.authorName.toLowerCase().includes(searchTermLower))) {
          posts.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
            formattedContent: this.formatTextWithLinks(data.content)
          });
        }
      });

      // Sort by creation date (newest first)
      posts.sort((a, b) => b.createdAt - a.createdAt);

      // Limit results
      const limitedPosts = posts.slice(0, limitCount);

      return { success: true, posts: limitedPosts };
    } catch (error) {
      console.error("Error searching posts:", error);
      return { success: false, message: 'حدث خطأ أثناء البحث', posts: [] };
    }
  }
}

// Create singleton instance
const postsManager = new PostsManager();

export default postsManager;

