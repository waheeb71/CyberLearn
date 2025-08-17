import { useState, useCallback } from 'react';
// قم باستيراد الكائن بالاسم الذي قمت بتصديره به
import enhancedPostsManager from '../../../utils/postsManagerEnhanced';

export const usePostActions = (currentUser, updatePostInState, addPostToState, refreshPosts) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [replyTexts, setReplyTexts] = useState({});

  // Set loading state for specific action
  const setActionLoading = useCallback((actionKey, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [actionKey]: isLoading
    }));
  }, []);

  // Create new post
  const createPost = useCallback(async (content) => {
    if (!content.trim() || !currentUser) {
      throw new Error("يجب تسجيل الدخول وإنشاء محتوى للمنشور.");
    }

    setActionLoading('createPost', true);
    
    try {
      const result = await enhancedPostsManager.createPost(content);
      
      if (result.success) {
        await refreshPosts(); // Refresh to get the new post with proper formatting
        return { success: true, message: 'تم إنشاء المنشور بنجاح' };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    } finally {
      setActionLoading('createPost', false);
    }
  }, [currentUser, refreshPosts, setActionLoading]);

  // Add reply to post
  const addReply = useCallback(async (postId, isPlatformPost = false) => {
    const replyText = replyTexts[postId];
    if (!replyText?.trim() || !currentUser) {
      throw new Error("يجب تسجيل الدخول وكتابة رد.");
    }

    const actionKey = `reply_${postId}`;
    setActionLoading(actionKey, true);

    try {
      const result = await enhancedPostsManager.addReply(postId, replyText, isPlatformPost);

      if (result.success) {
        setReplyTexts(prev => ({ ...prev, [postId]: '' }));
        await refreshPosts(); // Refresh to get updated post with new reply
        return { success: true, message: 'تم إضافة الرد بنجاح' };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    } finally {
      setActionLoading(actionKey, false);
    }
  }, [replyTexts, currentUser, refreshPosts, setActionLoading]);

  // Toggle like on post
  const toggleLike = useCallback(async (postId, isPlatformPost = false, currentPost) => {
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول للإعجاب.");
    }

    const actionKey = `like_${postId}`;
    
    // Optimistic update
    const isLiked = currentPost.likes?.includes(currentUser.id);
    const updatedLikes = isLiked
      ? currentPost.likes.filter(id => id !== currentUser.id)
      : [...(currentPost.likes || []), currentUser.id];

    // Update UI immediately
    updatePostInState(postId, { likes: updatedLikes }, isPlatformPost);

    try {
      // تم تصحيح هذا السطر لاستخدام enhancedPostsManager بشكل متسق
      const result = await enhancedPostsManager.toggleLike(postId, isPlatformPost);

      if (!result.success) {
        // Revert optimistic update on failure
        updatePostInState(postId, { likes: currentPost.likes }, isPlatformPost);
        throw new Error(result.message);
      }

      return { 
        success: true, 
        isLiked: !isLiked,
        message: isLiked ? 'تم إلغاء الإعجاب' : 'تم الإعجاب بالمنشور'
      };
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      updatePostInState(postId, { likes: currentPost.likes }, isPlatformPost);
      throw error;
    }
  }, [currentUser, updatePostInState]);

  // Search posts
  const searchPosts = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      return { success: true, posts: [] };
    }

    setActionLoading('search', true);

    try {
      const [userPostsResult, platformPostsResult] = await Promise.all([
        enhancedPostsManager.searchPosts(searchTerm, false),
        enhancedPostsManager.searchPosts(searchTerm, true),
      ]);

      let results = [];
      if (userPostsResult.success) {
        results = [...results, ...userPostsResult.posts.map(p => ({...p, isPlatformPost: false}))];
      }
      if (platformPostsResult.success) {
        results = [...results, ...platformPostsResult.posts.map(p => ({...p, isPlatformPost: true}))];
      }
      
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, posts: results };
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('حدث خطأ أثناء البحث');
    } finally {
      setActionLoading('search', false);
    }
  }, [setActionLoading]);

  // Update reply text
  const updateReplyText = useCallback((postId, text) => {
    setReplyTexts(prev => ({
      ...prev,
      [postId]: text
    }));
  }, []);

  // Clear reply text
  const clearReplyText = useCallback((postId) => {
    setReplyTexts(prev => {
      const newState = { ...prev };
      delete newState[postId];
      return newState;
    });
  }, []);

  // Get loading state for specific action
  const isActionLoading = useCallback((actionKey) => {
    return loadingStates[actionKey] || false;
  }, [loadingStates]);

  return {
    // Actions
    createPost,
    addReply,
    toggleLike,
    searchPosts,
    
    // Reply text management
    replyTexts,
    updateReplyText,
    clearReplyText,
    
    // Loading states
    isActionLoading,
    setActionLoading,
    
    // All loading states for debugging
    loadingStates
  };
};
