import React from 'react';
import { Edit3, Trash2, Save, X, MoreHorizontal } from 'lucide-react';
import { canEditPost, canDeletePost } from '../utils/postHelpers';

const PostControls = ({ 
  post,
  currentUser,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  isLoadingEdit
}) => {
  const canEdit = canEditPost(post, currentUser);
  const canDelete = canDeletePost(post, currentUser);

  if (!canEdit && !canDelete) {
    return null;
  }

  if (isEditing) {
    return (
      <div className="post-controls editing">
        <button
          onClick={onSaveEdit}
          disabled={isLoadingEdit}
          className="control-button save"
          title="حفظ التعديلات"
        >
          {isLoadingEdit ? (
            <div className="loading-spinner" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </button>
        
        <button
          onClick={onCancelEdit}
          disabled={isLoadingEdit}
          className="control-button cancel"
          title="إلغاء التعديل"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="post-controls">
      {canEdit && (
        <button
          onClick={onStartEdit}
          className="control-button edit"
          title="تعديل المنشور"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      )}
      
      {canDelete && (
        <button
          onClick={onDelete}
          className="control-button delete"
          title="حذف المنشور"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      
      {/* <button
        className="control-button more"
        title="المزيد من الخيارات"
        onClick={() => {
          // Implement dropdown menu for more options
          console.log('More options for post:', post.id);
        }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>*/}
    </div>
  );
};

export default PostControls;
