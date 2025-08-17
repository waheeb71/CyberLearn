import React from 'react';
import { Shield, User } from 'lucide-react';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import PostControls from './PostControls';
import ReplySection from '../ReplySection/ReplySection';
import { formatDate, getUserInitials, getUserAvatarColor } from '../utils/postHelpers';
import "../../styles/posts.css";


const PostCard = ({ 
  post, 
  currentUser, 
  showReplies, 
  onToggleReplies,
  onToggleLike,
  onAddReply,
  onEditPost,
  onDeletePost,
  replyText,
  onReplyTextChange,
  isLoadingReply,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  editText,
  onEditTextChange,
  isLoadingEdit
}) => {
  const isLiked = currentUser && post.likes?.includes(currentUser.id);
  const likesCount = post.likes?.length || 0;
  const repliesCount = post.replies?.length || 0;
  const canControl = currentUser && (post.authorId === currentUser.id || currentUser.isAdmin);

  const handleLikeClick = () => {
    onToggleLike(post.id, post.isPlatformPost, post);
  };

  const handleReplyToggle = () => {
    onToggleReplies(post.id);
  };

  const handleReplySubmit = () => {
    onAddReply(post.id, post.isPlatformPost);
  };

  const handleEditStart = () => {
    onStartEdit(post.id, post.content);
  };

  const handleEditCancel = () => {
    onCancelEdit(post.id);
  };

const handleEditSave = async () => {
  if (!editText || editText.trim() === '') return alert('المحتوى لا يمكن أن يكون فارغ');
  try {
    await onEditPost(post.id, post.isPlatformPost); // 🔥 تحديث من parent
  } catch (error) {
    alert(error.message);
  }
};

const handleDelete = async () => {
  try {
    await onDeletePost(post.id, post.isPlatformPost); // 🔥 تحديث من parent
  } catch (error) {
    alert(error.message);
  }
};


  const handleReplyTextChange = (text) => {
    onReplyTextChange(post.id, text);
  };

  const handleEditTextChange = (text) => {
    onEditTextChange(`post_${post.id}`, text);
  };

  return (
    <article className="post-card">
      <PostHeader
        post={post}
        currentUser={currentUser}
        canControl={canControl}
        isEditing={isEditing}
        onStartEdit={handleEditStart}
        onCancelEdit={handleEditCancel}
        onSaveEdit={handleEditSave}
        onDelete={handleDelete}
        editText={editText}
        onEditTextChange={handleEditTextChange}
        isLoadingEdit={isLoadingEdit}
      />

      <PostContent
        post={post}
        isEditing={isEditing}
        editText={editText}
        onEditTextChange={handleEditTextChange}
      />

      <PostActions
        post={post}
        currentUser={currentUser}
        isLiked={isLiked}
        likesCount={likesCount}
        repliesCount={repliesCount}
        onLikeClick={handleLikeClick}
        onReplyToggle={handleReplyToggle}
        showReplies={showReplies}
      />

      {canControl && (
        <PostControls
          post={post}
          currentUser={currentUser}
          isEditing={isEditing}
          onStartEdit={handleEditStart}
          onCancelEdit={handleEditCancel}
          onSaveEdit={handleEditSave}
          onDelete={handleDelete}
          isLoadingEdit={isLoadingEdit}
        />
      )}

      {showReplies && (
        <ReplySection
          post={post}
          currentUser={currentUser}
          replyText={replyText}
          onReplyTextChange={handleReplyTextChange}
          onSubmitReply={handleReplySubmit}
          isLoadingReply={isLoadingReply}
        />
      )}
    </article>
  );
};

export default PostCard;