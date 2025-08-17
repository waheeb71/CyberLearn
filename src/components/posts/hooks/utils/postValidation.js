
/**
 * Validation rules configuration
 */
export const VALIDATION_RULES = {
  POST: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 5000,
    REQUIRED: true
  },
  REPLY: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 2000,
    REQUIRED: true
  },
  SEARCH: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100
  }
};

/**
 * Error messages in Arabic
 */
export const ERROR_MESSAGES = {
  REQUIRED: 'هذا الحقل مطلوب',
  TOO_SHORT: 'النص قصير جداً',
  TOO_LONG: 'النص طويل جداً',
  INVALID_FORMAT: 'تنسيق غير صحيح',
  INAPPROPRIATE_CONTENT: 'المحتوى غير مناسب',
  SPAM_DETECTED: 'تم اكتشاف محتوى مكرر',
  INVALID_USER: 'المستخدم غير صالح',
  PERMISSION_DENIED: 'ليس لديك صلاحية لهذا الإجراء',
  POST_NOT_FOUND: 'المنشور غير موجود',
  REPLY_NOT_FOUND: 'الرد غير موجود',
  EDIT_TIME_EXPIRED: 'انتهت مدة التعديل المسموحة',
  NETWORK_ERROR: 'خطأ في الاتصال'
};

/**
 * Validate post content
 * @param {string} content - Post content to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validatePostContent = (content, options = {}) => {
  const rules = { ...VALIDATION_RULES.POST, ...options };
  const errors = [];

  // Check if content is provided
  if (rules.REQUIRED && (!content || typeof content !== 'string')) {
    errors.push(ERROR_MESSAGES.REQUIRED);
    return { isValid: false, errors, message: errors[0] };
  }

  if (!content) {
    return { isValid: true, errors: [], message: 'صالح' };
  }

  const trimmedContent = content.trim();

  // Check minimum length
  if (trimmedContent.length < rules.MIN_LENGTH) {
    errors.push(`${ERROR_MESSAGES.TOO_SHORT} (الحد الأدنى ${rules.MIN_LENGTH} حرف)`);
  }

  // Check maximum length
  if (trimmedContent.length > rules.MAX_LENGTH) {
    errors.push(`${ERROR_MESSAGES.TOO_LONG} (الحد الأقصى ${rules.MAX_LENGTH} حرف)`);
  }

  // Check for inappropriate content
  if (!isContentAppropriate(trimmedContent)) {
    errors.push(ERROR_MESSAGES.INAPPROPRIATE_CONTENT);
  }

  // Check for spam patterns
  if (isSpamContent(trimmedContent)) {
    errors.push(ERROR_MESSAGES.SPAM_DETECTED);
  }

  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? errors[0] : 'صالح',
    trimmedContent
  };
};

/**
 * Validate reply content
 * @param {string} content - Reply content to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateReplyContent = (content, options = {}) => {
  const rules = { ...VALIDATION_RULES.REPLY, ...options };
  const errors = [];

  // Check if content is provided
  if (rules.REQUIRED && (!content || typeof content !== 'string')) {
    errors.push(ERROR_MESSAGES.REQUIRED);
    return { isValid: false, errors, message: errors[0] };
  }

  if (!content) {
    return { isValid: true, errors: [], message: 'صالح' };
  }

  const trimmedContent = content.trim();

  // Check minimum length
  if (trimmedContent.length < rules.MIN_LENGTH) {
    errors.push(`${ERROR_MESSAGES.TOO_SHORT} (الحد الأدنى ${rules.MIN_LENGTH} حرف)`);
  }

  // Check maximum length
  if (trimmedContent.length > rules.MAX_LENGTH) {
    errors.push(`${ERROR_MESSAGES.TOO_LONG} (الحد الأقصى ${rules.MAX_LENGTH} حرف)`);
  }

  // Check for inappropriate content
  if (!isContentAppropriate(trimmedContent)) {
    errors.push(ERROR_MESSAGES.INAPPROPRIATE_CONTENT);
  }

  // Check for spam patterns
  if (isSpamContent(trimmedContent)) {
    errors.push(ERROR_MESSAGES.SPAM_DETECTED);
  }

  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? errors[0] : 'صالح',
    trimmedContent
  };
};

/**
 * Validate search term
 * @param {string} searchTerm - Search term to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateSearchTerm = (searchTerm, options = {}) => {
  const rules = { ...VALIDATION_RULES.SEARCH, ...options };
  const errors = [];

  if (!searchTerm || typeof searchTerm !== 'string') {
    return { isValid: false, errors: [ERROR_MESSAGES.REQUIRED], message: ERROR_MESSAGES.REQUIRED };
  }

  const trimmedTerm = searchTerm.trim();

  // Check minimum length
  if (trimmedTerm.length < rules.MIN_LENGTH) {
    errors.push(`${ERROR_MESSAGES.TOO_SHORT} (الحد الأدنى ${rules.MIN_LENGTH} حرف)`);
  }

  // Check maximum length
  if (trimmedTerm.length > rules.MAX_LENGTH) {
    errors.push(`${ERROR_MESSAGES.TOO_LONG} (الحد الأقصى ${rules.MAX_LENGTH} حرف)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? errors[0] : 'صالح',
    trimmedTerm
  };
};

/**
 * Validate user permissions for post actions
 * @param {object} user - Current user
 * @param {object} post - Post object
 * @param {string} action - Action to validate ('edit', 'delete', 'like', 'reply')
 * @returns {object} Validation result
 */
export const validateUserPermissions = (user, post, action) => {
  const errors = [];

  // Check if user is logged in
  if (!user || !user.id) {
    errors.push(ERROR_MESSAGES.INVALID_USER);
    return { isValid: false, errors, message: 'يجب تسجيل الدخول أولاً' };
  }

  // Check if post exists
  if (!post || !post.id) {
    errors.push(ERROR_MESSAGES.POST_NOT_FOUND);
    return { isValid: false, errors, message: ERROR_MESSAGES.POST_NOT_FOUND };
  }

  switch (action) {
    case 'edit':
      if (!canUserEditPost(user, post)) {
        errors.push(ERROR_MESSAGES.PERMISSION_DENIED);
      }
      break;

    case 'delete':
      if (!canUserDeletePost(user, post)) {
        errors.push(ERROR_MESSAGES.PERMISSION_DENIED);
      }
      break;

    case 'like':
    case 'reply':
      // All logged-in users can like and reply
      break;

    default:
      errors.push(ERROR_MESSAGES.INVALID_FORMAT);
  }

  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? errors[0] : 'صالح'
  };
};

/**
 * Validate user permissions for reply actions
 * @param {object} user - Current user
 * @param {object} reply - Reply object
 * @param {string} action - Action to validate ('edit', 'delete')
 * @returns {object} Validation result
 */
export const validateReplyPermissions = (user, reply, action) => {
  const errors = [];

  // Check if user is logged in
  if (!user || !user.id) {
    errors.push(ERROR_MESSAGES.INVALID_USER);
    return { isValid: false, errors, message: 'يجب تسجيل الدخول أولاً' };
  }

  // Check if reply exists
  if (!reply || !reply.id) {
    errors.push(ERROR_MESSAGES.REPLY_NOT_FOUND);
    return { isValid: false, errors, message: ERROR_MESSAGES.REPLY_NOT_FOUND };
  }

  switch (action) {
    case 'edit':
      if (!canUserEditReply(user, reply)) {
        errors.push(ERROR_MESSAGES.PERMISSION_DENIED);
      }
      break;

    case 'delete':
      if (!canUserDeleteReply(user, reply)) {
        errors.push(ERROR_MESSAGES.PERMISSION_DENIED);
      }
      break;

    default:
      errors.push(ERROR_MESSAGES.INVALID_FORMAT);
  }

  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? errors[0] : 'صالح'
  };
};

/**
 * Check if content is appropriate (basic content filtering)
 * @param {string} content - Content to check
 * @returns {boolean} Whether content is appropriate
 */
export const isContentAppropriate = (content) => {
  if (!content) return true;

  const lowerContent = content.toLowerCase();

  // Basic inappropriate words list (expand as needed)
  const inappropriateWords = [
    // Add inappropriate words based on your requirements
    // This is a basic example - you should customize this list
  ];

  // Check for inappropriate words
  const hasInappropriateWords = inappropriateWords.some(word => 
    lowerContent.includes(word)
  );

  // Check for excessive caps (potential spam)
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  const hasExcessiveCaps = capsRatio > 0.7 && content.length > 10;

  // Check for excessive punctuation
  const punctuationRatio = (content.match(/[!?.,;:]/g) || []).length / content.length;
  const hasExcessivePunctuation = punctuationRatio > 0.3;

  return !hasInappropriateWords && !hasExcessiveCaps && !hasExcessivePunctuation;
};

/**
 * Check if content appears to be spam
 * @param {string} content - Content to check
 * @returns {boolean} Whether content appears to be spam
 */
export const isSpamContent = (content) => {
  if (!content) return false;

  // Check for repeated characters
  const hasRepeatedChars = /(.)\1{4,}/.test(content);

  // Check for excessive emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojiCount = (content.match(emojiRegex) || []).length;
  const emojiRatio = emojiCount / content.length;
  const hasExcessiveEmojis = emojiRatio > 0.3 && content.length > 10;

  // Check for excessive URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlCount = (content.match(urlRegex) || []).length;
  const hasExcessiveUrls = urlCount > 3;

  // Check for repeated words
  const words = content.toLowerCase().split(/\s+/);
  const wordCounts = {};
  words.forEach(word => {
    if (word.length > 2) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  const hasRepeatedWords = Object.values(wordCounts).some(count => count > 5);

  return hasRepeatedChars || hasExcessiveEmojis || hasExcessiveUrls || hasRepeatedWords;
};

/**
 * Check if user can edit a post
 * @param {object} user - Current user
 * @param {object} post - Post to edit
 * @param {number} timeLimit - Time limit in hours (default 24)
 * @returns {boolean} Whether user can edit
 */
export const canUserEditPost = (user, post, timeLimit = 24) => {
  if (!user || !post) return false;

  // Admin can always edit
  if (user.isAdmin) return true;

  // Only author can edit their own posts
  if (post.authorId !== user.id) return false;

  // Check time limit
  const postDate = new Date(post.createdAt);
  const now = new Date();
  const hoursDiff = (now - postDate) / (1000 * 60 * 60);

  return hoursDiff <= timeLimit;
};

/**
 * Check if user can delete a post
 * @param {object} user - Current user
 * @param {object} post - Post to delete
 * @returns {boolean} Whether user can delete
 */
export const canUserDeletePost = (user, post) => {
  if (!user || !post) return false;

  // Admin can always delete
  if (user.isAdmin) return true;

  // Only author can delete their own posts
  return post.authorId === user.id;
};

/**
 * Check if user can edit a reply
 * @param {object} user - Current user
 * @param {object} reply - Reply to edit
 * @param {number} timeLimit - Time limit in hours (default 2)
 * @returns {boolean} Whether user can edit
 */
export const canUserEditReply = (user, reply, timeLimit = 2) => {
  if (!user || !reply) return false;

  // Admin can always edit
  if (user.isAdmin) return true;

  // Only author can edit their own replies
  if (reply.authorId !== user.id) return false;

  // Check time limit
  const replyDate = new Date(reply.createdAt);
  const now = new Date();
  const hoursDiff = (now - replyDate) / (1000 * 60 * 60);

  return hoursDiff <= timeLimit;
};

/**
 * Check if user can delete a reply
 * @param {object} user - Current user
 * @param {object} reply - Reply to delete
 * @returns {boolean} Whether user can delete
 */
export const canUserDeleteReply = (user, reply) => {
  if (!user || !reply) return false;

  // Admin can always delete
  if (user.isAdmin) return true;

  // Only author can delete their own replies
  return reply.authorId === user.id;
};

/**
 * Sanitize content for safe display
 * @param {string} content - Content to sanitize
 * @returns {string} Sanitized content
 */
export const sanitizeContent = (content) => {
  if (!content) return '';

  // Remove potentially dangerous HTML tags
  const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  let sanitized = content.replace(dangerousTags, '');

  // Remove other potentially dangerous elements
  sanitized = sanitized.replace(/<iframe\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<object\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<form\b[^>]*>/gi, '');

  return sanitized.trim();
};

/**
 * Validate file upload (for future use)
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateFileUpload = (file, options = {}) => {
  const defaultOptions = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFiles: 1
  };

  const rules = { ...defaultOptions, ...options };
  const errors = [];

  if (!file) {
    errors.push('لم يتم اختيار ملف');
    return { isValid: false, errors, message: errors[0] };
  }

  // Check file size
  if (file.size > rules.maxSize) {
    errors.push(`حجم الملف كبير جداً (الحد الأقصى ${(rules.maxSize / 1024 / 1024).toFixed(1)} ميجابايت)`);
  }

  // Check file type
  if (!rules.allowedTypes.includes(file.type)) {
    errors.push(`نوع الملف غير مدعوم (المدعوم: ${rules.allowedTypes.join(', ')})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? errors[0] : 'صالح'
  };
};

/**
 * Create validation error object
 * @param {string} field - Field name
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @returns {object} Error object
 */
export const createValidationError = (field, message, code = 'VALIDATION_ERROR') => {
  return {
    field,
    message,
    code,
    timestamp: new Date().toISOString()
  };
};

/**
 * Batch validate multiple fields
 * @param {object} data - Data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation result
 */
export const batchValidate = (data, rules) => {
  const errors = [];
  const validatedData = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    let result;
    switch (fieldRules.type) {
      case 'post':
        result = validatePostContent(value, fieldRules);
        break;
      case 'reply':
        result = validateReplyContent(value, fieldRules);
        break;
      case 'search':
        result = validateSearchTerm(value, fieldRules);
        break;
      default:
        result = { isValid: true, trimmedContent: value };
    }

    if (!result.isValid) {
      errors.push(createValidationError(field, result.message));
    } else {
      validatedData[field] = result.trimmedContent || value;
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validatedData,
    message: errors.length > 0 ? `${errors.length} خطأ في التحقق` : 'جميع البيانات صالحة'
  };
};