import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Star,
  TrendingUp,
  Shield,
  Target,
  Medal,
  Crown,
  Gem,
  Lock
} from 'lucide-react';


const Profile = ({ user }) => {
  const sections = [
    { key: 'basics', name: '🚀 الأساسيات' },
    { key: 'fundamentals', name: '🔎 المفاهيم الأساسية' },
    { key: 'specialization', name: '🌐 التخصص' },
    { key: 'practicalExperience', name: '💻 الخبرة العملية' },
    { key: 'continuousLearning', name: '📚 التعلم المستمر' },
    { key: 'youtubeChannels', name: '📺 قنوات يوتيوب' },
    { key: 'jobRoles', name: '💼 الأدوار الوظيفية' },
    { key: 'certifications', name: '📜 الشهادات' },
    { key: 'roadmap', name: '📅 خارطة طريق 6 أشهر' },
    { key: 'additionalResources', name: '💡 موارد إضافية' }
  ];

  const completedSections = Object.values(user.progress).filter(p => p.completed).length;
  const totalSections = sections.length;
  const overallProgress = (completedSections / totalSections) * 100;

  const getLevelInfo = (level) => {
    const levels = [
      { name: 'مبتدئ', icon: '🌱', color: 'bg-green-100 text-green-800', description: 'بداية رحلة التعلم' },
      { name: 'متوسط', icon: '🌿', color: 'bg-blue-100 text-blue-800', description: 'تقدم جيد في التعلم' },
      { name: 'متقدم', icon: '🌳', color: 'bg-purple-100 text-purple-800', description: 'مستوى متقدم من المعرفة' },
      { name: 'خبير', icon: '🏆', color: 'bg-yellow-100 text-yellow-800', description: 'خبرة عالية في المجال' },
      { name: 'أسطورة', icon: '👑', color: 'bg-red-100 text-red-800', description: 'مستوى استثنائي' }
    ];
    
    const levelIndex = Math.min(level - 1, levels.length - 1);
    return levels[levelIndex];
  };

  const levelInfo = getLevelInfo(user.level);

 const getAchievements = () => {
  const achievements = [];

  if (completedSections >= 1) {
    achievements.push({
      title: 'البداية القوية',
      description: 'أكمل أول قسم في المسار',
      icon: <Target className="h-6 w-6 text-green-700" />,
      earned: true
    });
  }

  if (completedSections >= 3) {
    achievements.push({
      title: 'المتعلم المثابر',
      description: 'أكمل 3 أقسام من المسار',
      icon: <BookMarked className="h-6 w-6 text-green-700" />,
      earned: true
    });
  }

  if (completedSections >= 5) {
    achievements.push({
      title: 'نصف الطريق',
      description: 'أكمل نصف المسار التعليمي',
      icon: <Star className="h-6 w-6 text-green-700" />,
      earned: true
    });
  }

  if (completedSections >= 8) {
    achievements.push({
      title: 'المتفوق',
      description: 'أكمل 8 أقسام من المسار',
      icon: <Medal className="h-6 w-6 text-green-700" />,
      earned: true
    });
  }

  if (completedSections === totalSections) {
    achievements.push({
      title: 'بطل الأمن السيبراني',
      description: 'أكمل جميع أقسام المسار',
      icon: <Award className="h-6 w-6 text-green-700" />,
      earned: true
    });
  }

  if (user.totalPoints >= 50) {
    achievements.push({
      title: 'جامع النقاط',
      description: 'حصل على 50 نقطة أو أكثر',
      icon: <Gem className="h-6 w-6 text-green-700" />,
      earned: true
    });
  }

  if (user.totalPoints >= 100) {
    achievements.push({
      title: 'ملك النقاط',
      description: 'حصل على 100 نقطة أو أكثر',
      icon: <Crown className="h-6 w-6 text-green-700" />,
      earned: true
    });
  }

  // Achievements locked
  if (completedSections < 1) {
    achievements.push({
      title: 'البداية القوية',
      description: 'أكمل أول قسم في المسار',
      icon: <Lock className="h-6 w-6 text-gray-400" />,
      earned: false
    });
  }

  if (completedSections < totalSections) {
    achievements.push({
      title: 'بطل الأمن السيبراني',
      description: 'أكمل جميع أقسام المسار',
      icon: <Lock className="h-6 w-6 text-gray-400" />,
      earned: false
    });
  }

  return achievements;
};


  const achievements = getAchievements();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
          <Badge className={`text-lg px-4 py-2 ${levelInfo.color}`}>
            {levelInfo.icon} {levelInfo.name}
          </Badge>
          <p className="text-muted-foreground mt-2">{levelInfo.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="h-5 w-5" />
                  <span>المعلومات الأساسية</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    عضو منذ {new Date(user.registrationDate).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">المستوى {user.level}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <TrendingUp className="h-5 w-5" />
                  <span>الإحصائيات</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">التقدم الإجمالي</span>
                    <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">الأقسام المكتملة</span>
                  <span className="text-sm font-medium">{completedSections}/{totalSections}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">إجمالي النقاط</span>
                  <span className="text-sm font-medium text-primary">{user.totalPoints}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">النقاط للمستوى التالي</span>
                  <span className="text-sm font-medium">{50 - (user.totalPoints % 50)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Target className="h-5 w-5" />
                  <span>تفاصيل التقدم</span>
                </CardTitle>
                <CardDescription>
                  تقدمك في كل قسم من أقسام المسار التعليمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sections.map((section) => {
                    const progress = user.progress[section.key];
                    const isCompleted = progress?.completed || false;
                    const score = progress?.score || 0;
                    
                    return (
                      <div key={section.key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="font-medium">{section.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {isCompleted && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {score} نقطة
                            </Badge>
                          )}
                          <Badge variant={isCompleted ? "default" : "secondary"}>
                            {isCompleted ? "مكتمل" : "غير مكتمل"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Award className="h-5 w-5" />
                  <span>الإنجازات</span>
                </CardTitle>
                <CardDescription>
                  الشارات والإنجازات التي حصلت عليها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg ${
                        achievement.earned 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                       <span>{achievement.icon}</span>
                        <h3 className={`font-medium ${achievement.earned ? 'text-green-800' : 'text-gray-600'}`}>
                          {achievement.title}
                        </h3>
                      </div>
                      <p className={`text-sm ${achievement.earned ? 'text-green-600' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

