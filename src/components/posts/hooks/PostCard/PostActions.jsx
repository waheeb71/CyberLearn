import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

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
    if (navigator.share) {
      try {
        await navigator.share({
          title: `منشور من ${post.authorName}`,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
        alert('تم نسخ الرابط');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
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
            title="حفظ"
            onClick={() => {
              // Implement bookmark functionality
              console.log('Bookmark post:', post.id);
            }}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostActions;