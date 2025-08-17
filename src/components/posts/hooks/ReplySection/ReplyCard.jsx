import React from 'react';
import ReplyControls from './ReplyControls';
import { formatDate, getUserInitials, getUserAvatarColor } from '../utils/postHelpers';

const ReplyCard = ({ 
  reply, 
  currentUser, 
  postId, 
  isPlatformPost 
}) => {
  const avatarColor = getUserAvatarColor(reply.authorId);
  const userInitials = getUserInitials(reply.authorName);
  const canControl = currentUser && (reply.authorId === currentUser.id || currentUser.isAdmin);

  return (
    <article className="reply-card">
      <div 
        className="reply-avatar"
        style={{ backgroundColor: avatarColor }}
      >
        <span className="text-white font-semibold text-xs">
          {userInitials}
        </span>
      </div>
      
      <div className="reply-content">
        <header className="reply-header">
          <div className="reply-author-info">
            <span className="reply-author-name">
              {reply.authorName}
            </span>
            <span className="reply-date">
              {formatDate(reply.createdAt)}
              {reply.updatedAt && new Date(reply.updatedAt) > new Date(reply.createdAt) && (
                <span className="text-xs text-gray-400 mr-1">• محرر</span>
              )}
            </span>
          </div>
          
          {canControl && (
            <ReplyControls
              reply={reply}
              currentUser={currentUser}
              postId={postId}
              isPlatformPost={isPlatformPost}
            />
          )}
        </header>
        
        <div 
          className="reply-text"
          dangerouslySetInnerHTML={{ 
            __html: reply.formattedContent || reply.content 
          }}
        />
      </div>
    </article>
  );
};

export default ReplyCard;
