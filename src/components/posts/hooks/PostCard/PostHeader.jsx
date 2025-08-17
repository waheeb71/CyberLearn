import React from 'react';
import { Shield, User, Clock } from 'lucide-react';
import { formatDate, getUserInitials, getUserAvatarColor } from '../utils/postHelpers';

const PostHeader = ({ post, currentUser, canControl }) => {
  const avatarColor = getUserAvatarColor(post.authorId);
  const userInitials = getUserInitials(post.authorName);

  return (
    <header className="post-header">
      <div className="post-author-info">
        <div 
          className={`post-avatar ${post.isPlatformPost ? 'platform-avatar' : ''}`}
          style={{ backgroundColor: post.isPlatformPost ? '#2563eb' : avatarColor }}
        >
          {post.isPlatformPost ? (
            <Shield className="w-6 h-6 text-white" />
          ) : (
            <span className="text-white font-semibold">
              {userInitials}
            </span>
          )}
        </div>
        
        <div className="post-author-details">
          <h3 className="font-semibold text-foreground">
            {post.authorName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            <time dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
            {post.updatedAt && new Date(post.updatedAt) > new Date(post.createdAt) && (
              <span className="text-xs text-gray-400">• محرر</span>
            )}
          </div>
        </div>
      </div>

      {post.isPlatformPost && (
        <div className={`post-badge ${post.isPlatformPost ? 'platform-badge' : ''}`}>
          <Shield className="w-3 h-3" />
          <span>منشور المنصة</span>
        </div>
      )}
    </header>
  );
};

export default PostHeader;
