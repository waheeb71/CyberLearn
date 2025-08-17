import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../usePosts';
import PostCard from './PostCard';
import { Helmet } from "react-helmet";
import postsManager from './../../../../utils/postsManager';
const PostDetail = () => {
  const { postId } = useParams();
  const {
    combinedUserPosts,
    currentUser,
    updatePostInState,
    removePostFromState,
    refreshPosts,
    addReply,
    editPost,
    deletePost,
    toggleLike
  } = usePosts();
const navigate = useNavigate();
  const post = combinedUserPosts.find(p => p.id === postId);
  const [showReplies, setShowReplies] = useState(true);
  const [replyTexts, setReplyTexts] = useState({});
  const [editingStates, setEditingStates] = useState({});

  if (!post) return <p>المنشور غير موجود</p>;
 const goBackToPosts = () => {
    navigate('/posts'); // ينقل المستخدم لقائمة المنشورات
  };
  // Toggle الردود
  const handleToggleReplies = () => setShowReplies(prev => !prev);

  // تحديث نص الرد
  const handleReplyTextChange = (postId, text) =>
    setReplyTexts(prev => ({ ...prev, [postId]: text }));

  // إضافة رد
const handleAddReply = async (postId, isPlatformPost) => {
  const text = replyTexts[postId];
  if (!text || text.trim() === '') return alert('لا يمكن إرسال رد فارغ');
  try {
    await postsManager.addReply(postId, text, isPlatformPost);
    handleReplyTextChange(postId, '');
    await refreshPosts();
  } catch (error) {
    alert('حدث خطأ أثناء إضافة الرد');
  }
};



  // الإعجاب بالمنشور
  const handleToggleLike = async (post) => {
    try {
      await postsManager.toggleLike(post.id, post.isPlatformPost, post);
      const isLiked = post.likes?.includes(currentUser.id);
      const likes = isLiked 
        ? post.likes.filter(id => id !== currentUser.id) 
        : [...(post.likes || []), currentUser.id];
      updatePostInState(post.id, { likes }, post.isPlatformPost);
    } catch (error) {
      alert('حدث خطأ أثناء الإعجاب');
    }
  };

  // بدء التعديل
  const handleStartEdit = (postId, content) =>
    setEditingStates(prev => ({ ...prev, [`post_${postId}`]: content }));

  // إلغاء التعديل
  const handleCancelEdit = (postId) =>
    setEditingStates(prev => ({ ...prev, [`post_${postId}`]: '' }));

  // حفظ التعديل
  const handleSaveEdit = async (postId, isPlatformPost) => {
    const editText = editingStates[`post_${postId}`];
    if (!editText || editText.trim() === '') return alert('المحتوى لا يمكن أن يكون فارغ');
    try {
      await editPost(postId, editText, isPlatformPost);
      updatePostInState(postId, { content: editText }, isPlatformPost);
      handleCancelEdit(postId);
    } catch (error) {
      alert(error.message);
    }
  };

  // حذف المنشور
  const handleDeletePost = async (postId, isPlatformPost) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    try {
      await deletePost(postId, isPlatformPost);
      removePostFromState(postId, isPlatformPost);
    } catch (error) {
      alert(error.message);
    }
  };

  // تغيير نص التعديل
 const handleEditTextChange = (key, text) =>
  setEditingStates(prev => ({ ...prev, [key]: text }));

  return (
    <>
    
      <Helmet>
        <title>منشور من {post.authorName}</title>
        <meta property="og:title" content={`منشور من ${post.authorName}`} />
        <meta property="og:description" content={post.content.substring(0, 100)} />
        <meta property="og:url" content={`https://cyberlearn0.netlify.app/posts/${post.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image || 'https://cyberlearn0.netlify.app/og-image.png'} />
      </Helmet>

      <div className="posts-container">
        

        <PostCard
          post={post}
          currentUser={currentUser}
          showReplies={showReplies}
          onToggleReplies={handleToggleReplies}
           onToggleLike={() => handleToggleLike(post)}
          onAddReply={handleAddReply}
          onEditPost={handleSaveEdit}
          onDeletePost={handleDeletePost}
          replyText={replyTexts[post.id] || ''}
          onReplyTextChange={handleReplyTextChange}
          isLoadingReply={false}
          isEditing={!!editingStates[`post_${post.id}`]}
          onStartEdit={() => handleStartEdit(post.id, post.content)}
          onCancelEdit={() => handleCancelEdit(post.id)}
          onSaveEdit={() => handleSaveEdit(post.id, post.isPlatformPost)}
          editText={editingStates[`post_${post.id}`] || post.content}
          onEditTextChange={(text) => handleEditTextChange(`post_${post.id}`, text)}
          isLoadingEdit={false}
        />
         <button 
        onClick={goBackToPosts} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        العودة للمنشورات
      </button>
      </div>
    </>
  );
};

export default PostDetail;
