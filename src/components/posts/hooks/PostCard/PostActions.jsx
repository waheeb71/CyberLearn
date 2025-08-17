import React from 'react';
import { Heart, MessageCircle, Share2, Copy } from 'lucide-react';

const PostActions = ({ 
  post,
  currentUser,
  isLiked,
  likesCount,
  repliesCount,
  onLikeClick,
  onReplyToggle,
  showReplies
}) => {
const handleShare = async () => {
  const postUrl = `${window.location.origin}/posts/${post.id}`; // رابط المنشور الفريد

  if (navigator.share) {
    try {
      await navigator.share({
        title: `منشور من ${post.authorName}`,
        text: post.content.substring(0, 100) + '...',
        url: postUrl
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  } else {
    try {
      await navigator.clipboard.writeText(postUrl);
      alert('تم نسخ رابط المنشور');
    } catch (error) {
      console.log('Error copying to clipboard:', error);
    }
  }
};



  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      alert('تم نسخ محتوى المنشور');
    } catch (error) {
      console.error('Error copying content:', error);
    }
  };

  return (
    <div className="post-actions">
      <div className="post-actions-left">
        <button
          onClick={onLikeClick}
          className={`action-button ${isLiked ? 'liked' : ''}`}
          title={isLiked ? 'إلغاء الإعجاب' : 'إعجاب'}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={onReplyToggle}
          className="action-button"
          title={showReplies ? 'إخفاء الردود' : 'عرض الردود'}
        >
          <MessageCircle className="w-5 h-5" />
          <span>{repliesCount}</span>
        </button>

        <button
          onClick={handleShare}
          className="action-button"
          title="مشاركة"
        >
          <Share2 className="w-5 h-5" />
          <span>مشاركة</span>
        </button>
      </div>

      <div className="post-actions-right">
        {currentUser && (
          <button
            className="action-button"
            title="نسخ محتوى المنشور"
            onClick={handleCopyContent}
          >
            <Copy className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostActions;
