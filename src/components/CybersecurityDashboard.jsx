// src/components/CybersecurityDashboard.jsx
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
  TrendingUp,
  Shield,
  Star,
  Rocket,
  Search,
  Globe,
  Laptop,
  BookMarked,
  MonitorPlay,
  Briefcase,
  ScrollText,
  Map,
  Lightbulb,
} from 'lucide-react';
import AdsenseAd from "./AdsenseAd";
import userManager from "../utils/userManager";
import { Helmet } from "react-helmet";

const CybersecurityDashboard = () => {
  const [user, setUser] = useState(null);
  const [pathProgress, setPathProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      const currentUser = await userManager.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      const result = await userManager.getPathProgress('cybersecurity');
      if (result.success) {
        setPathProgress(result.progress);
      } else {
        alert(result.message);
        navigate('/dashboard'); // Redirect if not enrolled
      }
      setLoading(false);
    };
    fetchProgress();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>جاري تحميل لوحة التحكم الخاصة بالأمن السيبراني...</p>
      </div>
    );
  }

  if (!user || !pathProgress) {
    return null;
  }

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

  const overallProgress = (pathProgress.completedSections / sections.length) * 100;
  
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

  const levelInfo = getLevelInfo(pathProgress.level);

  return (
    <>
      <Helmet>
        <title>لوحة تحكم الأمن السيبراني - {user.name}</title>
        <meta name="description" content="تابع تقدمك في مسار تعلم الأمن السيبراني" />
      </Helmet>

      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2" style={{ color: 'white' }}>
              لوحة تحكم الأمن السيبراني <Shield className="inline-block h-8 w-8 text-primary" />
            </h1>
            <p className="text-muted-foreground">
              مرحباً، {user.name} 👋 تابع تقدمك في مسار الأمن السيبراني.
            </p>
          </div>
          <div>
            <AdsenseAd />
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
                  {pathProgress.completedSections} من {sections.length} أقسام
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي النقاط</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{pathProgress.totalPoints}</div>
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
                  <span className="text-2xl font-bold">{pathProgress.level}</span>
                  <Badge className={levelInfo.color}>
                    {levelInfo.icon} {levelInfo.name}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {50 - (pathProgress.totalPoints % 50)} نقطة للمستوى التالي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تاريخ الانضمام</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
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
                    تتبع تقدمك في جميع أقسام مسار الأمن السيبراني.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sections.map((section) => {
                      const progress = pathProgress.progress[section.key];
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
                    <BookOpen className="h-5 w-5" />
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
                  <Link to="/dashboard">
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="h-4 w-4 ml-2" />
                      العودة للوحة الرئيسية
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
                      <Badge variant={pathProgress.completedSections >= 1 ? "default" : "secondary"}>
                        {pathProgress.completedSections >= 1 ? "✓" : "🔒"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">نصف المسار</span>
                      <Badge variant={pathProgress.completedSections >= 5 ? "default" : "secondary"}>
                        {pathProgress.completedSections >= 5 ? "✓" : "🔒"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">إكمال المسار</span>
                      <Badge variant={pathProgress.completedSections === sections.length ? "default" : "secondary"}>
                        {pathProgress.completedSections === sections.length ? "✓" : "🔒"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CybersecurityDashboard;