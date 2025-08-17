

/**
 * Format date for display in posts
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

  if (diffInMinutes < 1) return 'الآن';
  if (diffInMinutes < 60) return `${diffInMinutes} د`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} س`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} ي`;

  return postDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format text with clickable links
 * @param {string} text - The text to format
 * @returns {string} HTML string with formatted links
 */
export const formatTextWithLinks = (text) => {
  if (!text) return '';
  
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-red-500 hover:text-red-600 underline">$1</a>');
};

/**
 * Truncate text to specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 200) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get user initials for avatar
 * @param {string} name - User's name
 * @returns {string} User initials
 */
export const getUserInitials = (name) => {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate a random color for user avatar
 * @param {string} userId - User ID for consistent color
 * @returns {string} CSS color value
 */
export const getUserAvatarColor = (userId) => {
  const colors = [
    '#dc2626', // red
    '#2563eb', // blue
    '#16a34a', // green
    '#9333ea', // purple
    '#ea580c', // orange
    '#0891b2', // cyan
    '#be123c', // rose
    '#4338ca', // indigo
  ];
  
  if (!userId) return colors[0];
  
  // Simple hash function to get consistent color for user
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Validate post content
 * @param {string} content - Post content to validate
 * @returns {object} Validation result
 */
export const validatePostContent = (content) => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, message: 'محتوى المنشور مطلوب' };
  }
  
  const trimmedContent = content.trim();
  
  if (trimmedContent.length === 0) {
    return { isValid: false, message: 'لا يمكن إنشاء منشور فارغ' };
  }
  
  if (trimmedContent.length > 5000) {
    return { isValid: false, message: 'المنشور طويل جداً (الحد الأقصى 5000 حرف)' };
  }
  
  return { isValid: true, message: 'المحتوى صالح' };
};

/**
 * Validate reply content
 * @param {string} content - Reply content to validate
 * @returns {object} Validation result
 */
export const validateReplyContent = (content) => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, message: 'محتوى الرد مطلوب' };
  }
  
  const trimmedContent = content.trim();
  
  if (trimmedContent.length === 0) {
    return { isValid: false, message: 'لا يمكن إضافة رد فارغ' };
  }
  
  if (trimmedContent.length > 2000) {
    return { isValid: false, message: 'الرد طويل جداً (الحد الأقصى 2000 حرف)' };
  }
  
  return { isValid: true, message: 'المحتوى صالح' };
};

/**
 * Check if user can edit post (within time limit)
 * @param {object} post - Post object
 * @param {object} currentUser - Current user object
 * @param {number} timeLimit - Time limit in hours (default 24)
 * @returns {boolean} Whether user can edit
 */
export const canEditPost = (post, currentUser, timeLimit = 24) => {
  if (!post || !currentUser) return false;
  
  // Admin can always edit
  if (currentUser.isAdmin) return true;
  
  // Only author can edit their own posts
  if (post.authorId !== currentUser.id) return false;
  
  // Check time limit
  const postDate = new Date(post.createdAt);
  const now = new Date();
  const hoursDiff = (now - postDate) / (1000 * 60 * 60);
  
  return hoursDiff <= timeLimit;
};

/**
 * Check if user can delete post
 * @param {object} post - Post object
 * @param {object} currentUser - Current user object
 * @returns {boolean} Whether user can delete
 */
export const canDeletePost = (post, currentUser) => {
  if (!post || !currentUser) return false;
  
  // Admin can always delete
  if (currentUser.isAdmin) return true;
  
  // Only author can delete their own posts
  return post.authorId === currentUser.id;
};

/**
 * Check if user can edit reply (within time limit)
 * @param {object} reply - Reply object
 * @param {object} currentUser - Current user object
 * @param {number} timeLimit - Time limit in hours (default 2)
 * @returns {boolean} Whether user can edit
 */
export const canEditReply = (reply, currentUser, timeLimit = 2) => {
  if (!reply || !currentUser) return false;
  
  // Admin can always edit
  if (currentUser.isAdmin) return true;
  
  // Only author can edit their own replies
  if (reply.authorId !== currentUser.id) return false;
  
  // Check time limit
  const replyDate = new Date(reply.createdAt);
  const now = new Date();
  const hoursDiff = (now - replyDate) / (1000 * 60 * 60);
  
  return hoursDiff <= timeLimit;
};

/**
 * Check if user can delete reply
 * @param {object} reply - Reply object
 * @param {object} currentUser - Current user object
 * @returns {boolean} Whether user can delete
 */
export const canDeleteReply = (reply, currentUser) => {
  if (!reply || !currentUser) return false;
  
  // Admin can always delete
  if (currentUser.isAdmin) return true;
  
  // Only author can delete their own replies
  return reply.authorId === currentUser.id;
};

/**
 * Sort posts by different criteria
 * @param {Array} posts - Array of posts
 * @param {string} sortBy - Sort criteria ('date', 'likes', 'replies')
 * @param {string} order - Sort order ('asc', 'desc')
 * @returns {Array} Sorted posts
 */
export const sortPosts = (posts, sortBy = 'date', order = 'desc') => {
  if (!Array.isArray(posts)) return [];
  
  const sortedPosts = [...posts];
  
  sortedPosts.sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'likes':
        valueA = a.likes?.length || 0;
        valueB = b.likes?.length || 0;
        break;
      case 'replies':
        valueA = a.replies?.length || 0;
        valueB = b.replies?.length || 0;
        break;
      case 'date':
      default:
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        break;
    }
    
    if (order === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });
  
  return sortedPosts;
};

/**
 * Filter posts by search term
 * @param {Array} posts - Array of posts
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered posts
 */
export const filterPostsBySearch = (posts, searchTerm) => {
  if (!Array.isArray(posts) || !searchTerm || !searchTerm.trim()) {
    return posts;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  return posts.filter(post => 
    post.content?.toLowerCase().includes(term) ||
    post.authorName?.toLowerCase().includes(term)
  );
};

/**
 * Get post statistics
 * @param {Array} posts - Array of posts
 * @returns {object} Statistics object
 */
export const getPostsStats = (posts) => {
  if (!Array.isArray(posts)) {
    return {
      totalPosts: 0,
      totalLikes: 0,
      totalReplies: 0,
      averageLikes: 0,
      averageReplies: 0
    };
  }
  
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
  const totalReplies = posts.reduce((sum, post) => sum + (post.replies?.length || 0), 0);
  
  return {
    totalPosts,
    totalLikes,
    totalReplies,
    averageLikes: totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : 0,
    averageReplies: totalPosts > 0 ? (totalReplies / totalPosts).toFixed(1) : 0
  };
};

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;

  function debounced(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  }

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
};


/**
 * Generate unique ID for temporary use
 * @returns {string} Unique ID
 */
export const generateTempId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Check if content contains inappropriate words (basic filter)
 * @param {string} content - Content to check
 * @returns {boolean} Whether content is appropriate
 */
export const isContentAppropriate = (content) => {
  if (!content) return true;
  
  // Basic inappropriate words list (can be expanded)
  const inappropriateWords = [
    // Add inappropriate words here based on your requirements
  ];
  
  const lowerContent = content.toLowerCase();
  return !inappropriateWords.some(word => lowerContent.includes(word));
};

/**
 * Extract mentions from content (@username)
 * @param {string} content - Content to extract mentions from
 * @returns {Array} Array of mentioned usernames
 */
export const extractMentions = (content) => {
  if (!content) return [];
  
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return [...new Set(mentions)]; // Remove duplicates
};

/**
 * Extract hashtags from content (#hashtag)
 * @param {string} content - Content to extract hashtags from
 * @returns {Array} Array of hashtags
 */
export const extractHashtags = (content) => {
  if (!content) return [];
  
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;
  
  while ((match = hashtagRegex.exec(content)) !== null) {
    hashtags.push(match[1]);
  }
  
  return [...new Set(hashtags)]; // Remove duplicates
};
