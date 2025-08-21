// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  TrendingUp,
  Shield,
  Star,
  Brain,
} from 'lucide-react';
import AdsenseAd from "./AdsenseAd";
import userManager from "../utils/userManager";
import { Helmet } from "react-helmet";

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
        navigate('/login');
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const paths = [
    { key: 'cybersecurity', name: 'مسار الأمن السيبراني', icon: Shield, description: 'ابدأ رحلتك في حماية الأنظمة والشبكات.' },
    { key: 'ai', name: 'مسار الذكاء الاصطناعي', icon: Brain, description: 'اكتشف عالم الذكاء الاصطناعي وتعلم بناء نماذجه.' },
  ];

  const getPathProgress = (pathKey) => {
    const pathData = user.pathsProgress?.[pathKey];
    if (!pathData) {
      return { totalPoints: 0, completedSections: 0, overallProgress: 0 };
    }
    const totalSections = Object.keys(pathData.progress).length;
    const completedSections = Object.values(pathData.progress).filter(p => p.completed).length;
    const overallProgress = (completedSections / totalSections) * 100;
    return {
      totalPoints: pathData.totalPoints,
      completedSections,
      overallProgress,
      totalSections,
    };
  };

  const getOverallProgress = () => {
    if (!user.pathsProgress) return { totalPoints: 0, totalCompletedSections: 0, totalOverallSections: 0 };
    
    const allPathsKeys = Object.keys(user.pathsProgress);
    
    const totalPoints = allPathsKeys.reduce((acc, pathKey) => acc + (user.pathsProgress[pathKey].totalPoints || 0), 0);
    const totalCompletedSections = allPathsKeys.reduce((acc, pathKey) => {
      const pathData = user.pathsProgress[pathKey];
      return acc + (Object.values(pathData.progress || {}).filter(p => p.completed).length);
    }, 0);
    const totalOverallSections = allPathsKeys.reduce((acc, pathKey) => acc + Object.keys(user.pathsProgress[pathKey].progress || {}).length, 0);

    return { totalPoints, totalCompletedSections, totalOverallSections };
  };

  const { totalPoints, totalCompletedSections, totalOverallSections } = getOverallProgress();
  const overallProgressValue = totalOverallSections > 0 ? (totalCompletedSections / totalOverallSections) * 100 : 0;

  const getLevelInfo = (level) => {
    const levels = [
      { name: 'مبتدئ', icon: '🌱', color: 'bg-green-100 text-green-800' },
      { name: 'متوسط', icon: '🌿', color: 'bg-blue-100 text-blue-800' },
      { name: 'متقدم', icon: '🌳', color: 'bg-purple-100 text-purple-800' },
      { name: 'خبير', icon: '🏆', color: 'bg-yellow-100 text-yellow-800' },
      { name: 'أسطورة', icon: '👑', color: 'bg-red-100 text-red-800' }
    ];
    const levelIndex = Math.min(level - 1, levels.length - 1);
    return levels[levelIndex] || levels[0];
  };

  const levelInfo = getLevelInfo(user.level);

  return (
    <>
      <Helmet>
        <title>لوحة التحكم - {user.name}</title>
        <meta name="description" content="تابع تقدمك في مسارات التعلم المختلفة" />
      </Helmet>

      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2" style={{ color: 'white' }}>
              مرحباً، {user.name} 👋
            </h1>
            <p className="text-muted-foreground">
              تابع تقدمك في مسارات التعلم المختلفة.
            </p>
          </div>
          <div>
            <AdsenseAd />
          </div>

          {/* Overall Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">التقدم الإجمالي</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(overallProgressValue)}%</div>
                <Progress value={overallProgressValue} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {totalCompletedSections} من {totalOverallSections} أقسام
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
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-2xl font-bold">{user.level}</span>
                  <Badge className={levelInfo.color}>
                    {levelInfo.icon} {levelInfo.name}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {100 - (user.totalPoints % 100)} نقطة للمستوى التالي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تاريخ التسجيل</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
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
          
          {/* Path Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paths.map((path) => {
              const { overallProgress, totalPoints } = getPathProgress(path.key);
              const isEnrolled = user.enrolledPaths && user.enrolledPaths.includes(path.key);

              return (
                <Card key={path.key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <path.icon className="h-6 w-6 text-primary" />
                      <span>{path.name}</span>
                    </CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEnrolled ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">التقدم: {Math.round(overallProgress)}%</span>
                          <span className="text-sm">النقاط: {totalPoints}</span>
                        </div>
                        <Progress value={overallProgress} />
                        <Button 
                          className="w-full" 
                          onClick={() => navigate(`/${path.key}-dashboard`)}
                        >
                          عرض لوحة التحكم
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={async () => {
                          const result = await userManager.enrollInPath(path.key);
                          if (result.success) {
                            setUser(result.user);
                            navigate(`/${path.key}-dashboard`);
                          } else {
                            alert(result.message);
                          }
                        }}
                      >
                        الاشتراك في المسار
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;