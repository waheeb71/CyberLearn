import React, { useState } from 'react';
import { Edit3, Trash2, Save, X } from 'lucide-react';
import { canEditReply, canDeleteReply } from '../utils/postHelpers';
import postsManager from './../../../../utils/postsManager'; 

const ReplyControls = ({ reply, currentUser, postId, isPlatformPost, refreshPosts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canEdit = canEditReply(reply, currentUser);
  const canDelete = canDeleteReply(reply, currentUser);

  const handleStartEdit = () => {
    setEditText(reply.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditText('');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      alert('لا يمكن حفظ رد فارغ');
      return;
    }

    setIsLoading(true);
    try {
      const result = await postsManager.editReply(postId, reply.id, editText, isPlatformPost);
      if (result.success) {
        setIsEditing(false);
        setEditText('');
        // تحديث قائمة الردود في الصفحة
        if (refreshPosts) await refreshPosts();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error editing reply:', error);
      alert('حدث خطأ أثناء تعديل الرد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الرد؟')) return;

    setIsLoading(true);
    try {
      const result = await postsManager.deleteReply(postId, reply.id, isPlatformPost);
      if (result.success) {
        // تحديث قائمة الردود في الصفحة
        if (refreshPosts) await refreshPosts();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('حدث خطأ أثناء حذف الرد');
    } finally {
      setIsLoading(false);
    }
  };

  if (!canEdit && !canDelete) return null;

  if (isEditing) {
    return (
      <div className="reply-controls editing">
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="reply-textarea"
          rows="2"
          autoFocus
        />
        <div className="reply-edit-actions">
          <button
            onClick={handleSaveEdit}
            disabled={isLoading || !editText.trim()}
            className="control-button save"
            title="حفظ التعديلات"
          >
            {isLoading ? <div className="loading-spinner" /> : <Save className="w-3 h-3" />}
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="control-button cancel"
            title="إلغاء التعديل"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reply-controls">
      {canEdit && (
        <button onClick={handleStartEdit} className="control-button edit" title="تعديل الرد">
          <Edit3 className="w-3 h-3" />
        </button>
      )}
      {canDelete && (
        <button onClick={handleDelete} disabled={isLoading} className="control-button delete" title="حذف الرد">
          {isLoading ? <div className="loading-spinner" /> : <Trash2 className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
};

export default ReplyControls;
