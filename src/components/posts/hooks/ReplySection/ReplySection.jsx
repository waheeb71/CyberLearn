import React from 'react';
import ReplyForm from './ReplyForm';
import ReplyCard from './ReplyCard';

const ReplySection = ({ 
  post,
  currentUser,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  isLoadingReply
}) => {
  return (
    <section className="reply-section">
      {currentUser && (
        <ReplyForm
          currentUser={currentUser}
          replyText={replyText}
          onReplyTextChange={onReplyTextChange}
          onSubmitReply={onSubmitReply}
          isLoadingReply={isLoadingReply}
        />
      )}

      {post.replies && post.replies.length > 0 && (
        <div className="replies-list">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            الردود ({post.replies.length})
          </h4>
          <div className="space-y-3">
            {post.replies.map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                currentUser={currentUser}
                postId={post.id}
                isPlatformPost={post.isPlatformPost}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ReplySection;