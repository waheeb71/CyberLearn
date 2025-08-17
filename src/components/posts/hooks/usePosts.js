import { useState, useEffect, useCallback } from 'react';
import postsManager from '../../../utils/postsManagerEnhanced';
import userManager from '../../../utils/userManager';

export const usePosts = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [platformPosts, setPlatformPosts] = useState([]);
  const [combinedUserPosts, setCombinedUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and combine posts
  const fetchAndCombinePosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [userPostsResult, platformPostsResult] = await Promise.all([
        postsManager.getPosts(),
        postsManager.getPlatformPosts(),
      ]);

      let allUserPosts = userPostsResult.success ? userPostsResult.posts : [];
      let allPlatformPosts = platformPostsResult.success ? platformPostsResult.posts : [];

      setPosts(allUserPosts);
      setPlatformPosts(allPlatformPosts);

      // Combine user posts with selected platform posts
      const selectedPlatformPosts = allPlatformPosts.slice(0, 3).map(post => ({ 
        ...post, 
        isPlatformPost: true 
      }));
      
      const combined = [
        ...allUserPosts.map(p => ({ ...p, isPlatformPost: false })), 
        ...selectedPlatformPosts
      ];
      
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCombinedUserPosts(combined);

    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('حدث خطأ أثناء جلب المنشورات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize user and posts
  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await userManager.getCurrentUser();
        setCurrentUser(user);
        await fetchAndCombinePosts();
      } catch (err) {
        console.error('Error initializing posts:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
        setLoading(false);
      }
    };

    initialize();
  }, [fetchAndCombinePosts]);

  // Refresh posts data
  const refreshPosts = useCallback(async () => {
    await fetchAndCombinePosts();
  }, [fetchAndCombinePosts]);

  // Update a specific post in the state
  const updatePostInState = useCallback((postId, updatedPost, isPlatformPost = false) => {
    if (isPlatformPost) {
      setPlatformPosts(prev => 
        prev.map(post => post.id === postId ? { ...post, ...updatedPost } : post)
      );
    } else {
      setPosts(prev => 
        prev.map(post => post.id === postId ? { ...post, ...updatedPost } : post)
      );
    }

    // Update combined posts as well
    setCombinedUserPosts(prev => 
      prev.map(post => post.id === postId ? { ...post, ...updatedPost } : post)
    );
  }, []);

  // Remove a post from state
  const removePostFromState = useCallback((postId, isPlatformPost = false) => {
    if (isPlatformPost) {
      setPlatformPosts(prev => prev.filter(post => post.id !== postId));
    } else {
      setPosts(prev => prev.filter(post => post.id !== postId));
    }

    setCombinedUserPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  // Add a new post to state
  const addPostToState = useCallback((newPost, isPlatformPost = false) => {
    const postWithFlag = { ...newPost, isPlatformPost };

    if (isPlatformPost) {
      setPlatformPosts(prev => [postWithFlag, ...prev]);
    } else {
      setPosts(prev => [postWithFlag, ...prev]);
    }

    // Add to combined posts if it's a user post or if we need platform posts in combined view
    if (!isPlatformPost) {
      setCombinedUserPosts(prev => [postWithFlag, ...prev]);
    }
  }, []);

  return {
    // State
    currentUser,
    posts,
    platformPosts,
    combinedUserPosts,
    loading,
    error,

    // Actions
    refreshPosts,
    updatePostInState,
    removePostFromState,
    addPostToState,
    
    // Setters for external use
    setCurrentUser,
    setPosts,
    setPlatformPosts,
    setCombinedUserPosts,
    setLoading,
    setError
  };
};