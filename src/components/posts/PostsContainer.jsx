import React, { useState, useCallback } from 'react';
import { Helmet } from "react-helmet";
import PostForm from './hooks/PostForm/PostForm';
import PostCard from './hooks/PostCard/PostCard';
import PostTabs from './hooks/PostFilters/PostTabs';
import SearchBar from './hooks/PostFilters/SearchBar';
import SortOptions from './hooks/PostFilters/SortOptions';
import { usePosts } from './hooks/usePosts';
import { usePostActions } from './hooks/usePostActions';
import { usePostControls } from './hooks/usePostControls';
import { sortPosts } from './hooks/utils/postHelpers';
import './styles/posts.css';
import ErrorBoundary from './ErrorBoundary';
const PostsContainer = () => {
  // Main posts data and state
 const {
    currentUser,
    posts,
    platformPosts,
    combinedUserPosts,
    loading,
    error,
    refreshPosts,
    updatePostInState,
    removePostFromState,
    addPostToState
  } = usePosts();

  // Post actions (create, like, reply, search)
  const {
    createPost,
    addReply,
    toggleLike,
    searchPosts,
    replyTexts,
    updateReplyText,
    clearReplyText,
    isActionLoading
  } = usePostActions(currentUser, updatePostInState, addPostToState, refreshPosts);

  // Post controls (edit, delete)
  const {
    canControlPost,
    startEditingPost,
    cancelEditingPost,
    saveEditedPost,
    deletePost,
    isEditing,
    isControlLoading,
    getEditText,
    updateEditText
  } = usePostControls(currentUser, updatePostInState, removePostFromState, refreshPosts);

  // Local state for UI
  const [activeTab, setActiveTab] = useState('user');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    // عند تغيير التاب، قم بمسح نتائج البحث
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  // Handle search (triggered by debounce or Enter key)
  const handleSearch = useCallback(async (term) => {
    if (!term.trim()) {
      // لا تقم بالبحث إذا كان المصطلح فارغًا
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchPosts(term);
      setSearchResults(result.posts);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchPosts]);

  // Handle search term change (triggered on every keystroke)
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  // دالة جديدة لمسح حالة البحث تمامًا
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);

  // Handle toggle replies
  const handleToggleReplies = useCallback((postId) => {
    setShowReplies(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  }, []);

  // Handle create post
  const handleCreatePost = useCallback(async (content) => {
    try {
      await createPost(content);
    } catch (error) {
      throw error;
    }
  }, [createPost]);

  // Handle add reply
  const handleAddReply = useCallback(async (postId, isPlatformPost) => {
    try {
      await addReply(postId, isPlatformPost);
    } catch (error) {
      alert(error.message);
    }
  }, [addReply]);

  // Handle toggle like
  const handleToggleLike = useCallback(async (postId, isPlatformPost, post) => {
    try {
      await toggleLike(postId, isPlatformPost, post);
    } catch (error) {
      alert(error.message);
    }
  }, [toggleLike]);

  // Handle edit post
  const handleEditPost = useCallback(async (postId, isPlatformPost) => {
  try {
    await saveEditedPost(postId, isPlatformPost);
    updatePostInState(postId, { content: getEditText(`post_${postId}`) }); // <-- تحديث فوري
  } catch (error) {
    alert(error.message);
  }
}, [saveEditedPost, updatePostInState, getEditText]);


  // Handle delete post
const handleDeletePost = useCallback(async (postId, isPlatformPost) => {
  removePostFromState(postId, isPlatformPost); // <-- حذف مباشرة
  try {
    await deletePost(postId, isPlatformPost); 
  } catch (error) {
    alert("فشل الحذف، سيتم استرجاع البوست");
    refreshPosts(); // <-- ترجع من السيرفر لو صار خطأ
  }
}, [deletePost, removePostFromState, refreshPosts]);


  // Get current posts based on active tab and search
  const getCurrentPosts = useCallback(() => {
    if (searchTerm) {
      return sortPosts(searchResults, sortBy, sortOrder);
    }

    let currentPosts = [];
    switch (activeTab) {
      case 'platform':
        currentPosts = platformPosts;
        break;
      case 'trending':
        currentPosts = [...combinedUserPosts].sort((a, b) => {
          const engagementA = (a.likes?.length || 0) + (a.replies?.length || 0);
          const engagementB = (b.likes?.length || 0) + (b.replies?.length || 0);
          return engagementB - engagementA;
        });
        break;
      case 'recent':
        currentPosts = [...combinedUserPosts].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case 'user':
      default:
        currentPosts = combinedUserPosts;
        break;
    }

    // Apply sorting to non-trending/recent tabs
    if (activeTab !== 'trending' && activeTab !== 'recent') {
      return sortPosts(currentPosts, sortBy, sortOrder);
    }
    return currentPosts;
  }, [
    searchTerm,
    searchResults,
    activeTab, 
    platformPosts, 
    combinedUserPosts, 
    sortBy, 
    sortOrder
  ]);

  const currentPosts = getCurrentPosts();
  const hasResults = currentPosts.length > 0;

  // Loading state
  if (loading) {
    return (
      <div className="posts-container">
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل المنشورات...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="posts-container">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={refreshPosts}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!currentUser) {
    return (
      <>
        <Helmet>
          <title>المنشورات - الأمن السيبراني</title>
          <meta name="description" content="استعرض أحدث المنشورات وتفاعل مع المجتمع في مجال الأمن السيبراني." />
        </Helmet>
        <div className="posts-container">
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              يجب عليك تسجيل الدخول للمشاركة وعرض المنشورات.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>المنشورات - الأمن السيبراني</title>
        <meta name="description" content="استعرض أحدث المنشورات وتفاعل مع المجتمع في مجال الأمن السيبراني." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-adsense-account" content="ca-pub-2404732748519909" />
        <meta name="keywords" content="الأمن السيبراني, تعلم الأمن السيبراني, سيبراني, اختراق, حماية الشبكات, تعلم الهكر الأخلاقي, أمن المعلومات" />
        <meta name="author" content="waheeb al_sharabi" />
        <meta property="og:title" content="مسار تعلم الأمن السيبراني الشامل" />
        <meta property="og:description" content="ابدأ رحلتك في تعلم الأمن السيبراني بخطة واضحة وشاملة، خطوة بخطوة حتى الاحتراف." />
        <meta property="og:image" content="https://cyberlearn0.netlify.app/og-image.png" />
        <meta property="og:url" content="https://cyberlearn0.netlify.app" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="مسار تعلم الأمن السيبراني الشامل" />
        <meta name="twitter:description" content="ابدأ رحلتك في تعلم الأمن السيبراني بخطة واضحة وشاملة، خطوة بخطوة حتى الاحتراف." />
        <meta name="twitter:image" content="https://cyberlearn0.netlify.app/og-image.png" />
        <link crossOrigin href="https://fonts.gstatic.com/" rel="preconnect" />
      </Helmet>

      <div className="posts-container">
        {/* Header */}
        <header className="posts-header">
          <h1 className="posts-title">المنشورات</h1>
          <p className="posts-subtitle">شارك أفكارك وتفاعل مع المجتمع</p>
        </header>

        {/* Post Creation Form */}
        <PostForm
          currentUser={currentUser}
          onCreatePost={handleCreatePost}
          isLoading={isActionLoading('createPost')}
        />

        {/* Filters */}
        <div className="posts-filters">
          <PostTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userPostsCount={posts.length}
            platformPostsCount={platformPosts.length}
          />
<ErrorBoundary>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
            isSearching={isActionLoading('search')}
            hasResults={hasResults} 
            onClearSearch={handleClearSearch} 
          />
</ErrorBoundary>

          <SortOptions
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Posts List */}
        <main className="posts-list">
          {currentPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {isSearching || searchTerm ? 
                  'لم يتم العثور على منشورات مطابقة للبحث' : 
                  'لا توجد منشورات حالياً'
                }
              </p>
            </div>
          ) : (
            currentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                showReplies={showReplies[post.id] || false}
                onToggleReplies={handleToggleReplies}
                onToggleLike={handleToggleLike}
                onAddReply={handleAddReply}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                replyText={replyTexts[post.id] || ''}
                onReplyTextChange={updateReplyText}
                isLoadingReply={isActionLoading(`reply_${post.id}`)}
                isEditing={isEditing(`post_${post.id}`)}
                onStartEdit={startEditingPost}
                onCancelEdit={cancelEditingPost}
                onSaveEdit={handleEditPost}
                editText={getEditText(`post_${post.id}`)}
                onEditTextChange={updateEditText}
                isLoadingEdit={isControlLoading(`edit_post_${post.id}`)}
              />
            ))
          )}
        </main>
      </div>
    </>
  );
};

export default PostsContainer;