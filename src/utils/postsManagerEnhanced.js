// Enhanced Posts Management System with Edit/Delete functionality
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

class EnhancedPostsManager {
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

  // Edit a post
  async editPost(postId, newContent, isPlatformPost = false) {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول لتعديل المنشور' };
    }

    if (!newContent || newContent.trim().length === 0) {
      return { success: false, message: 'لا يمكن حفظ منشور فارغ' };
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
        return { success: false, message: 'ليس لديك صلاحية لتعديل هذا المنشور' };
      }

      // Check time limit for editing (24 hours for regular users, unlimited for admins)
      if (!currentUser.isAdmin) {
        const postDate = postData.createdAt?.toDate?.() || new Date(postData.createdAt);
        const now = new Date();
        const hoursDiff = (now - postDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
          return { success: false, message: 'انتهت مدة التعديل المسموحة (24 ساعة)' };
        }
      }

      await updateDoc(postRef, {
        content: newContent.trim(),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'تم تحديث المنشور بنجاح'
      };
    } catch (error) {
      console.error("Error editing post:", error);
      return { success: false, message: 'حدث خطأ أثناء تعديل المنشور' };
    }
  }

  // Edit a reply
  async editReply(postId, replyId, newContent, isPlatformPost = false) {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول لتعديل الرد' };
    }

    if (!newContent || newContent.trim().length === 0) {
      return { success: false, message: 'لا يمكن حفظ رد فارغ' };
    }

    try {
      const collectionRef = isPlatformPost ? this.platformPostsCollectionRef : this.postsCollectionRef;
      const postRef = doc(collectionRef, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        return { success: false, message: 'المنشور غير موجود' };
      }

      const postData = postSnap.data();
      const replies = postData.replies || [];
      const replyIndex = replies.findIndex(reply => reply.id === replyId);

      if (replyIndex === -1) {
        return { success: false, message: 'الرد غير موجود' };
      }

      const reply = replies[replyIndex];

      // Check if user is the author or admin
      if (reply.authorId !== currentUser.id && !currentUser.isAdmin) {
        return { success: false, message: 'ليس لديك صلاحية لتعديل هذا الرد' };
      }

      // Check time limit for editing (2 hours for regular users, unlimited for admins)
      if (!currentUser.isAdmin) {
        const replyDate = new Date(reply.createdAt);
        const now = new Date();
        const hoursDiff = (now - replyDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 2) {
          return { success: false, message: 'انتهت مدة التعديل المسموحة للرد (2 ساعة)' };
        }
      }

      // Update the reply
      const updatedReplies = [...replies];
      updatedReplies[replyIndex] = {
        ...reply,
        content: newContent.trim(),
        formattedContent: this.formatTextWithLinks(newContent.trim()),
        updatedAt: new Date()
      };

      await updateDoc(postRef, {
        replies: updatedReplies,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'تم تحديث الرد بنجاح'
      };
    } catch (error) {
      console.error("Error editing reply:", error);
      return { success: false, message: 'حدث خطأ أثناء تعديل الرد' };
    }
  }

  // Delete a reply
  async deleteReply(postId, replyId, isPlatformPost = false) {
    const currentUser = await userManager.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول لحذف الرد' };
    }

    try {
      const collectionRef = isPlatformPost ? this.platformPostsCollectionRef : this.postsCollectionRef;
      const postRef = doc(collectionRef, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        return { success: false, message: 'المنشور غير موجود' };
      }

      const postData = postSnap.data();
      const replies = postData.replies || [];
      const replyIndex = replies.findIndex(reply => reply.id === replyId);

      if (replyIndex === -1) {
        return { success: false, message: 'الرد غير موجود' };
      }

      const reply = replies[replyIndex];

      // Check if user is the author or admin
      if (reply.authorId !== currentUser.id && !currentUser.isAdmin) {
        return { success: false, message: 'ليس لديك صلاحية لحذف هذا الرد' };
      }

      // Remove the reply
      const updatedReplies = replies.filter(r => r.id !== replyId);

      await updateDoc(postRef, {
        replies: updatedReplies,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'تم حذف الرد بنجاح'
      };
    } catch (error) {
      console.error("Error deleting reply:", error);
      return { success: false, message: 'حدث خطأ أثناء حذف الرد' };
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
      const allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter posts based on search term
      const filteredPosts = allPosts.filter(post => {
        const postContent = `${post.title} ${post.content}`.toLowerCase();
        return postContent.includes(searchTerm.toLowerCase());
      });

      // Paginate results
      const paginatedPosts = filteredPosts.slice(0, limitCount);

      return { success: true, posts: paginatedPosts };
    } catch (error) {
      console.error("Error searching posts:", error);
      return { success: false, message: 'حدث خطأ أثناء البحث عن المنشورات', posts: [] };
    }
  }
}

const postsManager = new EnhancedPostsManager();

// تصدير الكائن postsManager ليصبح متاحًا للاستيراد في ملفات أخرى
export default postsManager;
