import React from 'react';
import { Send } from 'lucide-react';
import { getUserInitials, getUserAvatarColor } from '../utils/postHelpers';
import { validateReplyContent } from '../utils/postValidation';

const ReplyForm = ({ 
  currentUser,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  isLoadingReply
}) => {
  const avatarColor = getUserAvatarColor(currentUser.id);
  const userInitials = getUserInitials(currentUser.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateReplyContent(replyText);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }
    
    onSubmitReply();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const isValid = replyText?.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      <div 
        className="reply-avatar"
        style={{ backgroundColor: avatarColor }}
      >
        <span className="text-white font-semibold text-xs">
          {userInitials}
        </span>
      </div>
      
      <div className="reply-input-container">
        <textarea
          value={replyText || ''}
          onChange={(e) => onReplyTextChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب ردك هنا... (Ctrl+Enter للإرسال)"
          className="reply-textarea"
          rows="3"
          disabled={isLoadingReply}
        />
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500">
            {replyText?.length || 0} / 2000 حرف
          </div>
          
          <button
            type="submit"
            disabled={!isValid || isLoadingReply}
            className="reply-submit"
          >
            {isLoadingReply ? (
              <div className="loading-spinner" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isLoadingReply ? 'جاري الإرسال...' : 'رد'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;