import React, { useState } from 'react';
import { Send, Image, Smile, AtSign } from 'lucide-react';
import { getUserInitials, getUserAvatarColor } from '../utils/postHelpers';
import { validatePostContent } from '../utils/postValidation';
import { useToast } from "@/components/ui/use-toast";
const PostForm = ({ 
  currentUser,
  onCreatePost,
  isLoading
}) => {
  const [postText, setPostText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { toast } = useToast();
  const avatarColor = getUserAvatarColor(currentUser?.id);
  const userInitials = getUserInitials(currentUser?.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validatePostContent(postText);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    try {
      await onCreatePost(postText);
      setPostText('');
    } catch (error) {
      alert(error.message || 'حدث خطأ أثناء إنشاء المنشور');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const insertEmoji = (emoji) => {
    setPostText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = [
  // 😀 مشاعر عامة وتفاعل
  '😀','😂','🤣','😊','😍','🤩','😎','🤔','😅','🥳',
  '👏','🙌','👍','👎','🙏','💯','🔥','❤️','💙','💡',

  // 💻 تقنية وبرمجة
  '💻','🖥️','⌨️','🖱️','📱','📲','🖧','💾','🧑‍💻','👨‍💻','👩‍💻','⚙️',
  '🛠️','🗄️','🖇️','🌐','🕹️','🪛','🧰',

  // 🤖 ذكاء اصطناعي وروبوتات
  '🤖','🧠','📊','📈','📉','📡','🔮','⚡','🛰️','🔐','🧮','🧬','🕵️‍♂️',

  // 🔒 أمن سيبراني
  '🔒','🔓','🛡️','⚔️','🚨','🔑','🧑‍🚀','🪪','💣','🕶️',

  // 🌍 مجتمعات وتواصل
  '🌍','🌎','🌏','🌐','🗣️','👥','🤝','💬','📢','📝','📖','✍️',

  // 🚀 إبداع وتطوير
  '🚀','🛸','🌌','⭐','✨','💡','🔭','🔧','⚙️','📦','🧩',

  // 🎉 تشجيع واحتفال
  '🎉','🎊','🏆','🥇','🥈','🥉','🎖️','🥂','🍕','☕'
];

  const isValid = postText.trim().length > 0;
  const charCount = postText.length;
  const maxChars = 5000;

  if (!currentUser) {
    return (
      <div className="post-form">
        <div className="text-center py-8">
          <p className="text-gray-500">يجب تسجيل الدخول لإنشاء منشور جديد</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <header className="post-form-header">
        <div 
          className="post-form-avatar"
          style={{ backgroundColor: avatarColor }}
        >
          <span className="text-white font-semibold">
            {userInitials}
          </span>
        </div>
        <div>
          <h3 className="post-form-title">إنشاء منشور جديد</h3>
          <p className="text-sm text-gray-500">شارك أفكارك مع المجتمع</p>
        </div>
      </header>

      <div className="post-form-content">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="ما الذي تريد مشاركته؟ (Ctrl+Enter للنشر)"
          className="post-textarea"
          rows="4"
          disabled={isLoading}
        />

        {showEmojiPicker && (
  <div className="emoji-picker mt-2">
    <div className="grid grid-cols-4 gap-2 max-h-40 w-40 overflow-y-auto p-2 border rounded-lg bg-white shadow-md scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      {commonEmojis.map((emoji, index) => (
        <button
          key={index}
          type="button"
          onClick={() => insertEmoji(emoji)}
          className="emoji-button text-xl hover:scale-125 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  </div>
)}

      </div>

      <footer className="post-form-actions">
        <div className="post-form-tools">
          <button
      type="button"
      className="tool-button"
      title="إضافة صورة"
      onClick={() => {
        toast({
          title: "🚧 تحت التطوير",
          description: "ميزة إضافة الصور لم تتوفر بعد.",
        });
      }}
    >
      <Image className="w-5 h-5" />
    </button>

          <button
            type="button"
            className="tool-button"
            title="إضافة رموز تعبيرية"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="w-5 h-5" />
          </button>

        {/* <button
            type="button"
            className="tool-button"
            title="ذكر مستخدم"
            onClick={() => {
              // Implement user mention
              console.log('Mention user');
            }}
          >
            <AtSign className="w-5 h-5" />
          </button>*/}
        </div>

        <div className="post-form-submit">
          <div className="char-counter">
            <span className={charCount > maxChars * 0.9 ? 'text-red-500' : 'text-gray-500'}>
              {charCount} / {maxChars}
            </span>
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading || charCount > maxChars}
            className="post-submit"
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{isLoading ? 'جاري النشر...' : 'نشر'}</span>
          </button>
        </div>
      </footer>
    </form>
  );
};

export default PostForm;