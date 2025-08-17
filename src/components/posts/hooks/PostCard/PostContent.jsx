import React from 'react';

const PostContent = ({ 
  post, 
  isEditing, 
  editText, 
  onEditTextChange 
}) => {
  if (isEditing) {
    return (
      <div className="post-content-editor">
        <textarea
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          className="post-textarea"
          placeholder="اكتب محتوى المنشور..."
          rows="4"
          autoFocus
        />
        <div className="text-xs text-gray-500 mt-1">
          {editText?.length || 0} / 5000 حرف
        </div>
      </div>
    );
  }

  return (
    <div 
      className="post-content"
      dangerouslySetInnerHTML={{ __html: post.formattedContent || post.content }}
    />
  );
};

export default PostContent;
