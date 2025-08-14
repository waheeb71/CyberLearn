import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Search,
  Filter,
  Shield,
} from 'lucide-react';
import postsManager from '../utils/postsManager';
import userManager from '../utils/userManager'; // استيراد UserManager

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [platformPosts, setPlatformPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newPlatformPost, setNewPlatformPost] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = await userManager.getCurrentUser();
      if (currentUser?.isAdmin) {
        setIsAdmin(true);
        loadDashboardData();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load stats
      const statsResult = await postsManager.getPostsStats();
      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      // Load posts
      const postsResult = await postsManager.getPosts(100);
      if (postsResult.success) {
        setPosts(postsResult.posts);
      }

      // Load platform posts
      const platformPostsResult = await postsManager.getPlatformPosts(100);
      if (platformPostsResult.success) {
        setPlatformPosts(platformPostsResult.posts);
      }

      // Load users (will be implemented in the user manager later)
      // const usersResult = await userManager.getAllUsers();
      // if (usersResult.success) {
      //   setUsers(usersResult.users);
      // }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlatformPost = async (e) => {
    e.preventDefault();
    if (!newPlatformPost.trim()) return;

    const result = await postsManager.createPost(newPlatformPost, true);

    if (result.success) {
      setNewPlatformPost('');
      loadDashboardData(); // Reload data
      // TODO: Use a custom modal instead of alert
      // alert('تم إنشاء منشور المنصة بنجاح');
    } else {
      // TODO: Use a custom modal instead of alert
      // alert(result.message);
    }
  };

  const handleTogglePostVisibility = async (postId, isPlatformPost = false) => {
    const result = await postsManager.togglePostVisibility(postId, isPlatformPost);
    if (result.success) {
      loadDashboardData(); // Reload data
    } else {
      // TODO: Use a custom modal instead of alert
      // alert(result.message);
    }
  };

  const handleDeletePost = async (postId, isPlatformPost = false) => {
    // TODO: Replace with a custom confirmation modal
    // if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      const result = await postsManager.deletePost(postId, isPlatformPost);
      if (result.success) {
        loadDashboardData(); // Reload data
        // TODO: Use a custom modal instead of alert
        // alert('تم حذف المنشور بنجاح');
      } else {
        // TODO: Use a custom modal instead of alert
        // alert(result.message);
      }
    // }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPosts = (postsList) => {
    return postsList.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === 'all' ||
        (filterStatus === 'visible' && post.isVisible) ||
        (filterStatus === 'hidden' && !post.isVisible);

      return matchesSearch && matchesFilter;
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">غير مصرح</h2>
          <p className="text-muted-foreground">ليس لديك صلاحية للوصول إلى لوحة التحكم الإدارية</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-muted-foreground">إدارة المنشورات والمستخدمين والإحصائيات</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 space-x-reverse mb-8 border-b border-border">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
            { id: 'posts', label: 'منشورات المستخدمين', icon: MessageSquare },
            { id: 'platform-posts', label: 'منشورات المنصة', icon: Shield },
            { id: 'users', label: 'المستخدمين', icon: Users },
            { id: 'settings', label: 'الإعدادات', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 border-b-2 transition-colors flex items-center space-x-2 space-x-reverse ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي المنشورات</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalPosts}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">منشورات المستخدمين</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalUserPosts}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">منشورات المنصة</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalPlatformPosts}</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الإعجابات</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalLikes}</p>
                  </div>
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">النشاط الأخير</h3>
              <div className="space-y-3">
                {[...posts, ...platformPosts]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((post) => (
                    <div key={post.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-foreground">
                          منشور جديد من {post.authorName}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts Management Tab */}
        {(activeTab === 'posts' || activeTab === 'platform-posts') && (
          <div className="space-y-6">
            {/* Create Platform Post (only for platform-posts tab) */}
            {activeTab === 'platform-posts' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">إنشاء منشور جديد للمنصة</h3>
                <form onSubmit={handleCreatePlatformPost}>
                  <textarea
                    value={newPlatformPost}
                    onChange={(e) => setNewPlatformPost(e.target.value)}
                    placeholder="اكتب منشور المنصة هنا..."
                    className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground mb-4"
                    rows="4"
                  />
                  <button
                    type="submit"
                    disabled={!newPlatformPost.trim()}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 space-x-reverse"
                  >
                    <Plus className="w-4 h-4" />
                    <span>نشر</span>
                  </button>
                </form>
              </div>
            )}

            {/* Search and Filter */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="البحث في المنشورات..."
                    className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                >
                  <option value="all">جميع المنشورات</option>
                  <option value="visible">المنشورات المرئية</option>
                  <option value="hidden">المنشورات المخفية</option>
                </select>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts(activeTab === 'posts' ? posts : platformPosts).map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {post.authorName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{post.authorName}</h4>
                        <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.isVisible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {post.isVisible ? 'مرئي' : 'مخفي'}
                      </span>
                      <button
                        onClick={() => handleTogglePostVisibility(post.id, activeTab === 'platform-posts')}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title={post.isVisible ? 'إخفاء المنشور' : 'إظهار المنشور'}
                      >
                        {post.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id, activeTab === 'platform-posts')}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                        title="حذف المنشور"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="text-foreground mb-4 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: post.formattedContent }}
                  />

                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                    <span>{post.likes?.length || 0} إعجاب</span>
                    <span>{post.replies?.length || 0} رد</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">إدارة المستخدمين</h3>
            <p className="text-muted-foreground">
              هذا القسم سيتم تطويره لاحقاً لإدارة المستخدمين وصلاحياتهم.
            </p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">إعدادات النظام</h3>
            <p className="text-muted-foreground">
              هذا القسم سيتم تطويره لاحقاً لإدارة إعدادات النظام العامة.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
