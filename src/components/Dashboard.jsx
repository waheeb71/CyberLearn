import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  BookOpen, 
  Award, 
  Target, 
  Calendar,
  TrendingUp,
  Shield,
  Star,
  Clock,
  Rocket, 
  Search, 
  Globe, 
  Laptop, 
  BookMarked, 
  MonitorPlay, 
  Briefcase, 
  ScrollText, 
  Map, 
  Lightbulb 
} from 'lucide-react';

import userManager from './utils/userManager';
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await userManager.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        // If no user is logged in, redirect to the login page
        navigate('/login');
      }
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const sections = [
    { key: 'basics', name: 'الأساسيات', icon: Rocket, description: 'أساسيات الشبكات وأنظمة التشغيل' },
    { key: 'fundamentals', name: 'المفاهيم الأساسية', icon: Search, description: 'مفاهيم الأمان وأفضل الممارسات' },
    { key: 'specialization', name: 'التخصص', icon: Globe, description: 'اختر تخصصك في الأمن السيبراني' },
    { key: 'practicalExperience', name: 'الخبرة العملية', icon: Laptop, description: 'مختبرات عملية وتحديات' },
    { key: 'continuousLearning', name: 'التعلم المستمر', icon: BookMarked, description: 'موارد للتعلم المستمر' },
    { key: 'youtubeChannels', name: 'قنوات يوتيوب', icon: MonitorPlay, description: 'قنوات تعليمية مفيدة' },
    { key: 'jobRoles', name: 'الأدوار الوظيفية', icon: Briefcase, description: 'فرص العمل في الأمن السيبراني' },
    { key: 'certifications', name: 'الشهادات', icon: ScrollText, description: 'الشهادات المهنية المعتمدة' },
    { key: 'roadmap', name: 'خارطة طريق 6 أشهر', icon: Map, description: 'خطة تعلم لمدة 6 أشهر' },
    { key: 'additionalResources', name: 'موارد إضافية', icon: Lightbulb, description: 'موارد ومراجع إضافية' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  if (!user) {
    // The redirect should handle this, but as a fallback, show a message
    return null; 
  }

  const completedSections = Object.values(user.progress).filter(p => p.completed).length;
  const totalSections = sections.length;
  const overallProgress = (completedSections / totalSections) * 100;

  const getLevelInfo = (level) => {
    const levels = [
      { name: 'مبتدئ', icon: '🌱', color: 'bg-green-100 text-green-800' },
      { name: 'متوسط', icon: '🌿', color: 'bg-blue-100 text-blue-800' },
      { name: 'متقدم', icon: '🌳', color: 'bg-purple-100 text-purple-800' },
      { name: 'خبير', icon: '🏆', color: 'bg-yellow-100 text-yellow-800' },
      { name: 'أسطورة', icon: '👑', color: 'bg-red-100 text-red-800' }
    ];
    
    const levelIndex = Math.min(level - 1, levels.length - 1);
    return levels[levelIndex];
  };

  const levelInfo = getLevelInfo(user.level);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            مرحباً، {user.name} 👋
          </h1>
          <p className="text-muted-foreground">
            تابع تقدمك في مسار تعلم الأمن السيبراني
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التقدم الإجمالي</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <Progress value={overallProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedSections} من {totalSections} أقسام
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي النقاط</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{user.totalPoints}</div>
              <p className="text-xs text-muted-foreground mt-2">
                نقطة مكتسبة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستوى الحالي</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-2xl font-bold">{user.level}</span>
                <Badge className={levelInfo.color}>
                  {levelInfo.icon} {levelInfo.name}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {50 - (user.totalPoints % 50)} نقطة للمستوى التالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تاريخ التسجيل</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(user.registrationDate).toLocaleDateString('ar-EG')}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                عضو منذ {Math.floor((Date.now() - new Date(user.registrationDate)) / (1000 * 60 * 60 * 24))} يوم
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Progress */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <BookOpen className="h-5 w-5" />
                  <span>تقدم التعلم</span>
                </CardTitle>
                <CardDescription>
                  تتبع تقدمك في جميع أقسام المسار التعليمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sections.map((section) => {
                    const progress = user.progress[section.key];
                    const isCompleted = progress?.completed || false;
                    const score = progress?.score || 0;
                    
                    return (
                      <div key={section.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="flex items-center gap-2">
                              <section.icon className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">{section.name}</h3>
                            </div>

                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {section.description}
                          </p>
                          {isCompleted && (
                            <p className="text-sm text-primary mt-1">
                              النقاط المكتسبة: {score}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {isCompleted ? (
                            <Badge variant="default">مكتمل ✓</Badge>
                          ) : (
                            <Badge variant="secondary">غير مكتمل</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Target className="h-5 w-5" />
                  <span>إجراءات سريعة</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/learning-path">
                  <Button className="w-full justify-start" variant="default">
                    <BookOpen className="h-4 w-4 ml-2" />
                    متابعة التعلم
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="h-4 w-4 ml-2" />
                    الملف الشخصي
                  </Button>
                </Link>
                <Link to="/sponsor">
                  <Button className="w-full justify-start" variant="outline">
                    <Award className="h-4 w-4 ml-2" />
                    الراعي الرسمي
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Achievement Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Award className="h-5 w-5" />
                  <span>الإنجازات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">أول قسم مكتمل</span>
                    <Badge variant={completedSections >= 1 ? "default" : "secondary"}>
                      {completedSections >= 1 ? "✓" : "🔒"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">نصف المسار</span>
                    <Badge variant={completedSections >= 5 ? "default" : "secondary"}>
                      {completedSections >= 5 ? "✓" : "🔒"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">إكمال المسار</span>
                    <Badge variant={completedSections === totalSections ? "default" : "secondary"}>
                      {completedSections === totalSections ? "✓" : "🔒"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;