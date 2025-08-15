import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Send, Search, Users, MessageSquare,Shield , User} from 'lucide-react';
import postsManager from '../utils/postsManager';
import userManager from '../utils/userManager';
import { Helmet } from "react-helmet";

const PostsPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]); // منشورات المستخدمين فقط
  const [platformPosts, setPlatformPosts] = useState([]); // منشورات المنصة فقط
  const [combinedUserPosts, setCombinedUserPosts] = useState([]); // قائمة مدمجة لقسم المستخدمين
  const [newPost, setNewPost] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('user');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
const [loadingReplies, setLoadingReplies] = useState({});

  // دالة لجلب ودمج المنشورات
  const fetchAndCombinePosts = async () => {
    const [userPostsResult, platformPostsResult] = await Promise.all([
      postsManager.getPosts(),
      postsManager.getPlatformPosts(),
    ]);

    let allUserPosts = userPostsResult.success ? userPostsResult.posts : [];
    let allPlatformPosts = platformPostsResult.success ? platformPostsResult.posts : [];

    setPosts(allUserPosts);
    setPlatformPosts(allPlatformPosts);

    const selectedPlatformPosts = allPlatformPosts.slice(0, 3).map(post => ({ ...post, isPlatformPost: true }));
    const combined = [...allUserPosts.map(p => ({ ...p, isPlatformPost: false })), ...selectedPlatformPosts];
    
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setCombinedUserPosts(combined);
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const user = await userManager.getCurrentUser();
      setCurrentUser(user);
      await fetchAndCombinePosts();
      setLoading(false);
    };
    initialize();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !currentUser) {
      alert("يجب تسجيل الدخول وإنشاء محتوى للمنشور.");
      return;
    }

    setIsCreatingPost(true);
    const result = await postsManager.createPost(newPost);
    setIsCreatingPost(false);

    if (result.success) {
      setNewPost('');
      await fetchAndCombinePosts(); // إعادة جلب ودمج المنشورات
    } else {
      alert(result.message);
    }
  };

 const handleAddReply = async (postId, isPlatformPost = false) => {
  const replyText = replyTexts[postId];
  if (!replyText?.trim() || !currentUser) {
    alert("يجب تسجيل الدخول وكتابة رد.");
    return;
  }

  setLoadingReplies(prev => ({ ...prev, [postId]: true }));

  const result = await postsManager.addReply(postId, replyText, isPlatformPost);

  setLoadingReplies(prev => ({ ...prev, [postId]: false }));

  if (result.success) {
    setReplyTexts({ ...replyTexts, [postId]: '' });
    await fetchAndCombinePosts(); // إعادة جلب ودمج المنشورات
  } else {
    alert(result.message);
  }
};


  const handleToggleLike = async (postId, isPlatformPost = false) => {
    if (!currentUser) {
      alert("يجب تسجيل الدخول للإعجاب.");
      return;
    }

    // تحديد القائمة التي سنقوم بتحديثها
    let listToUpdate;
    let setListToUpdate;

    if (isPlatformPost) {
      listToUpdate = platformPosts;
      setListToUpdate = setPlatformPosts;
    } else {
      listToUpdate = posts;
      setListToUpdate = setPosts;
    }
    
    // إيجاد المنشور في القائمة الأصلية
    const postIndex = listToUpdate.findIndex(post => post.id === postId);
    if (postIndex === -1) return;

    // تحديث متفائل للحالة المحلية
    const currentPost = listToUpdate[postIndex];
    const isLiked = currentPost.likes.includes(currentUser.id);
    const updatedLikes = isLiked
      ? currentPost.likes.filter(id => id !== currentUser.id)
      : [...currentPost.likes, currentUser.id];

    const originalListState = [...listToUpdate];
    const newOptimisticState = [...listToUpdate];
    newOptimisticState[postIndex] = { ...currentPost, likes: updatedLikes };
    setListToUpdate(newOptimisticState);

    // تحديث القائمة المدمجة أيضًا
    const combinedIndex = combinedUserPosts.findIndex(post => post.id === postId);
    if (combinedIndex !== -1) {
      const newCombinedState = [...combinedUserPosts];
      newCombinedState[combinedIndex] = { ...newCombinedState[combinedIndex], likes: updatedLikes };
      setCombinedUserPosts(newCombinedState);
    }

    // إرسال الطلب للخادم
    const result = await postsManager.toggleLike(postId, isPlatformPost);

    if (!result.success) {
      alert(result.message);
      // إذا فشل الطلب، نرجع الحالات إلى ما كانت عليه
      setListToUpdate(originalListState);
      if (combinedIndex !== -1) {
        // إعادة جلب المنشورات لضمان التناسق بعد فشل الطلب
        await fetchAndCombinePosts();
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const [userPostsResult, platformPostsResult] = await Promise.all([
      postsManager.searchPosts(searchTerm, false),
      postsManager.searchPosts(searchTerm, true),
    ]);

    let results = [];
    if (userPostsResult.success) {
      results = [...results, ...userPostsResult.posts.map(p => ({...p, isPlatformPost: false}))];
    }
    if (platformPostsResult.success) {
      results = [...results, ...platformPostsResult.posts.map(p => ({...p, isPlatformPost: true}))];
    }
    
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setSearchResults(results);
    setIsSearching(false);
  };
  
  const formatDate = (date) => {
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

  const PostCard = ({ post }) => {
    const isLiked = currentUser && post.likes?.includes(currentUser.id);
    const likesCount = post.likes?.length || 0;
    const repliesCount = post.replies?.length || 0;

    return (
      <div className="bg-card border border-border rounded-lg p-4 mb-4 hover:bg-accent/5 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 space-x-reverse">
           <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
  {post.isPlatformPost ? (
    <Shield className="w-6 h-6 text-red-600" />
  ) : (
    <User className="w-6 h-6 text-red-600" />
  )}
</div>

            <div>
              <h3 className="font-semibold text-foreground">{post.authorName}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
            </div>
          </div>
      {post.isPlatformPost && (
  <div className="flex items-center space-x-1 space-x-reverse bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
    <Shield className="w-3 h-3 text-red-600" />
    <span>منشور المنصة</span>
  </div>
)}


        </div>

        <div
          className="text-foreground mb-4 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: post.formattedContent }}
        />

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center space-x-6 space-x-reverse">
            <button
              onClick={() => handleToggleLike(post.id, post.isPlatformPost)}
              className={`flex items-center space-x-2 space-x-reverse transition-colors ${
                isLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowReplies({
                ...showReplies,
                [post.id]: !showReplies[post.id]
              })}
              className="flex items-center space-x-2 space-x-reverse text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{repliesCount}</span>
            </button>
          </div>
        </div>

        {showReplies[post.id] && (
          <div className="mt-4 border-t border-border pt-4">
            <div className="space-y-4">
              {currentUser && (
                <div className="flex space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-xs">
                      {currentUser.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                  <textarea
  value={replyTexts[post.id] || ''}
  onChange={(e) => setReplyTexts({
    ...replyTexts,
    [post.id]: e.target.value
  })}
  placeholder="اكتب ردك هنا..."
  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-900 shadow-sm"
  rows="3"
/>

                  <button
  onClick={() => handleAddReply(post.id, post.isPlatformPost)}
  disabled={!replyTexts[post.id]?.trim() || loadingReplies[post.id]}
  className="mt-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 space-x-reverse"
>
  {loadingReplies[post.id] ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
  ) : (
    <Send className="w-4 h-4" />
  )}
  <span>{loadingReplies[post.id] ? 'جاري الإرسال...' : 'رد'}</span>
</button>

                  </div>
                </div>
              )}

              {post.replies && post.replies.length > 0 && (
                <div className="space-y-3">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-3 space-x-reverse bg-accent/5 p-3 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-xs">
                          {reply.authorName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-1">
                          <span className="font-semibold text-sm text-foreground">{reply.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <div
                          className="text-sm text-foreground leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: reply.formattedContent }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const currentPosts = isSearching ? searchResults : (activeTab === 'platform' ? platformPosts : combinedUserPosts);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">
          يجب عليك تسجيل الدخول للمشاركة وعرض المنشورات.
        </p>
      </div>
    );
  }

  return (
      <>
      <Helmet>
        <title>المنشورات - الأمن السيبراني</title>
        <meta name="description" content="استعرض أحدث المنشورات وتفاعل مع المجتمع في مجال الأمن السيبراني." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="google-adsense-account" content="ca-pub-2404732748519909"></meta>


  <meta name="keywords" content="الأمن السيبراني, تعلم الأمن السيبراني, سيبراني, اختراق, حماية الشبكات, تعلم الهكر الأخلاقي, أمن المعلومات" />
  <meta name="author" content="waheeb al_sharabi" />


  <meta property="og:title" content="مسار تعلم الأمن السيبراني الشامل" />
  <meta property="og:description" content="ابدأ رحلتك في تعلم الأمن السيبراني بخطة واضحة وشاملة، خطوة بخطوة حتى الاحتراف." />
  <meta property="og:image" content="https://cyberlearn0.netlify.app/og-image.png" />
  <meta property="og:url" content="https://cyberlearn0.netlify.app" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="مسار تعلم الأمن السيبراني الشامل" />
  <meta name="twitter:description" content="ابدأ رحلتك في تعلم الأمن السيبراني بخطة واضحة وشاملة، خطوة بخطوة حتى الاحتراف." />
  <meta name="twitter:image" content="https://cyberlearn0.netlify.app/og-image.png" />
  <link crossorigin href="https://fonts.gstatic.com/" rel="preconnect"/>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script type="module" crossorigin src="/assets/index-rqsdKoJT.js"></script>
      </Helmet>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
       <div className="mb-8 flex flex-col items-center">
  <h1 className="text-3xl font-bold text-foreground mb-2">المنشورات</h1>
  <p className="text-muted-foreground">شارك أفكارك وتفاعل مع المجتمع</p>
</div>


        <div className="flex space-x-4 space-x-reverse mb-6 border-b border-border">
          <button
            onClick={() => {
              setActiveTab('user');
              setIsSearching(false);
              setSearchTerm('');
              setSearchResults([]);
            }}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center space-x-2 space-x-reverse ${
              activeTab === 'user'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>منشورات المستخدمين</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('platform');
              setIsSearching(false);
              setSearchTerm('');
              setSearchResults([]);
            }}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center space-x-2 space-x-reverse ${
              activeTab === 'platform'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>منشورات المنصة</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-3 space-x-reverse">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ابحث في المنشورات..."
                className="w-full pr-10 pl-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-black"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              بحث
            </button>
            {isSearching && (
              <button
                onClick={() => {
                  setIsSearching(false);
                  setSearchTerm('');
                  setSearchResults([]);
                }}
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>

        {activeTab === 'user' && !isSearching && (
          <form onSubmit={handleCreatePost} className="mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="ما الذي تفكر فيه؟"
                    className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-black"
                    rows="4"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-muted-foreground">
                      {newPost.length} حرف
                    </span>
                    <button
                      type="submit"
                      disabled={!newPost.trim() || isCreatingPost}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 space-x-reverse"
                    >
                      {isCreatingPost ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isCreatingPost ? 'جاري النشر...' : 'نشر'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {loading && !isSearching ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل المنشورات...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-xl text-muted-foreground">
                  {isSearching ? 'لا توجد نتائج مطابقة لبحثك.' : 'لا توجد منشورات متاحة حاليًا.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
     </>
  );
};

export default PostsPage;