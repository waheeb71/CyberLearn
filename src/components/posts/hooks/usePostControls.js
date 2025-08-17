import { useState, useCallback } from 'react';
import postsManager from '../../../utils/postsManager';

export const usePostControls = (currentUser, updatePostInState, removePostFromState, refreshPosts) => {
  const [editingStates, setEditingStates] = useState({});
  const [editTexts, setEditTexts] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // Set loading state for specific control action
  const setControlLoading = useCallback((actionKey, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [actionKey]: isLoading
    }));
  }, []);

  // Check if user can control this post/reply
  const canControlPost = useCallback((post) => {
    if (!currentUser) return false;
    return post.authorId === currentUser.id || currentUser.isAdmin;
  }, [currentUser]);

  const canControlReply = useCallback((reply) => {
    if (!currentUser) return false;
    return reply.authorId === currentUser.id || currentUser.isAdmin;
  }, [currentUser]);

  // Start editing a post
  const startEditingPost = useCallback((postId, currentContent) => {
    setEditingStates(prev => ({ ...prev, [`post_${postId}`]: true }));
    setEditTexts(prev => ({ ...prev, [`post_${postId}`]: currentContent }));
  }, []);

  // Cancel editing a post
  const cancelEditingPost = useCallback((postId) => {
    setEditingStates(prev => {
      const newState = { ...prev };
      delete newState[`post_${postId}`];
      return newState;
    });
    setEditTexts(prev => {
      const newState = { ...prev };
      delete newState[`post_${postId}`];
      return newState;
    });
  }, []);

  // Save edited post
  const saveEditedPost = useCallback(async (postId, isPlatformPost = false) => {
    const newContent = editTexts[`post_${postId}`];
    if (!newContent?.trim()) {
      throw new Error('لا يمكن حفظ منشور فارغ');
    }

    const actionKey = `edit_post_${postId}`;
    setControlLoading(actionKey, true);

    try {
      // Note: This would require implementing an edit function in postsManager
      // For now, we'll simulate the update
      const result = await postsManager.editPost?.(postId, newContent, isPlatformPost) || 
                     { success: false, message: 'ميزة التعديل غير متوفرة حالياً' };

      if (result.success) {
        // Update the post in state
        updatePostInState(postId, { 
          content: newContent,
          formattedContent: postsManager.formatTextWithLinks?.(newContent) || newContent,
          updatedAt: new Date()
        }, isPlatformPost);

        // Clear editing state
        cancelEditingPost(postId);
        
        return { success: true, message: 'تم تحديث المنشور بنجاح' };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error editing post:', error);
      throw error;
    } finally {
      setControlLoading(actionKey, false);
    }
  }, [editTexts, updatePostInState, cancelEditingPost, setControlLoading]);

  // Delete a post
  const deletePost = useCallback(async (postId, isPlatformPost = false) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      return { success: false, message: 'تم إلغاء الحذف' };
    }

    const actionKey = `delete_post_${postId}`;
    setControlLoading(actionKey, true);

    try {
      const result = await postsManager.deletePost(postId, isPlatformPost);

      if (result.success) {
        removePostFromState(postId, isPlatformPost);
        return { success: true, message: 'تم حذف المنشور بنجاح' };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    } finally {
      setControlLoading(actionKey, false);
    }
  }, [removePostFromState, setControlLoading]);

  // Start editing a reply
  const startEditingReply = useCallback((postId, replyId, currentContent) => {
    const key = `reply_${postId}_${replyId}`;
    setEditingStates(prev => ({ ...prev, [key]: true }));
    setEditTexts(prev => ({ ...prev, [key]: currentContent }));
  }, []);

  // Cancel editing a reply
  const cancelEditingReply = useCallback((postId, replyId) => {
    const key = `reply_${postId}_${replyId}`;
    setEditingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    setEditTexts(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  // Save edited reply
  const saveEditedReply = useCallback(async (postId, replyId, isPlatformPost = false) => {
    const key = `reply_${postId}_${replyId}`;
    const newContent = editTexts[key];
    if (!newContent?.trim()) {
      throw new Error('لا يمكن حفظ رد فارغ');
    }

    const actionKey = `edit_reply_${postId}_${replyId}`;
    setControlLoading(actionKey, true);

    try {
      // Note: This would require implementing an edit reply function in postsManager
      // For now, we'll simulate the update by refreshing posts
      const result = await postsManager.editReply?.(postId, replyId, newContent, isPlatformPost) || 
                     { success: false, message: 'ميزة تعديل الردود غير متوفرة حالياً' };

      if (result.success) {
        // Refresh posts to get updated data
        await refreshPosts();
        
        // Clear editing state
        cancelEditingReply(postId, replyId);
        
        return { success: true, message: 'تم تحديث الرد بنجاح' };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error editing reply:', error);
      throw error;
    } finally {
      setControlLoading(actionKey, false);
    }
  }, [editTexts, refreshPosts, cancelEditingReply, setControlLoading]);

  // Delete a reply
  const deleteReply = useCallback(async (postId, replyId, isPlatformPost = false) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الرد؟')) {
      return { success: false, message: 'تم إلغاء الحذف' };
    }

    const actionKey = `delete_reply_${postId}_${replyId}`;
    setControlLoading(actionKey, true);

    try {
      // Note: This would require implementing a delete reply function in postsManager
      const result = await postsManager.deleteReply?.(postId, replyId, isPlatformPost) || 
                     { success: false, message: 'ميزة حذف الردود غير متوفرة حالياً' };

      if (result.success) {
        // Refresh posts to get updated data
        await refreshPosts();
        return { success: true, message: 'تم حذف الرد بنجاح' };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      throw error;
    } finally {
      setControlLoading(actionKey, false);
    }
  }, [refreshPosts, setControlLoading]);

  // Update edit text
  const updateEditText = useCallback((key, text) => {
    setEditTexts(prev => ({
      ...prev,
      [key]: text
    }));
  }, []);

  // Check if currently editing
  const isEditing = useCallback((key) => {
    return editingStates[key] || false;
  }, [editingStates]);

  // Check if action is loading
  const isControlLoading = useCallback((actionKey) => {
    return loadingStates[actionKey] || false;
  }, [loadingStates]);

  // Get edit text
  const getEditText = useCallback((key) => {
    return editTexts[key] || '';
  }, [editTexts]);

  return {
    // Post controls
    canControlPost,
    startEditingPost,
    cancelEditingPost,
    saveEditedPost,
    deletePost,

    // Reply controls
    canControlReply,
    startEditingReply,
    cancelEditingReply,
    saveEditedReply,
    deleteReply,

    // State management
    isEditing,
    isControlLoading,
    getEditText,
    updateEditText,

    // Raw states for debugging
    editingStates,
    editTexts,
    loadingStates
  };
};
