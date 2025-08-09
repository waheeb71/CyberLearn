import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, BookOpen, Award, Users, Target, Zap } from 'lucide-react';
import heroImage from '../assets/hero_image.png';
import rewardsImage from '../assets/rewards_image.png';
import motivations from './motivations.json';


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
    useEffect(() => {
    // نختار رسالة عشوائية من ملف ال JSON
    const randomIndex = Math.floor(Math.random() * motivations.length);
    setMessage(motivations[randomIndex]);
    setShowModal(true);
  }, []);



  const features = [
    {
      icon: BookOpen,
      title: 'مسار تعليمي شامل',
      description: 'تعلم الأمن السيبراني من الأساسيات إلى المستوى المتقدم مع مسار منظم ومدروس'
    },
    {
      icon: Award,
      title: 'نظام النقاط والحوافز',
      description: 'احصل على نقاط وشارات عند إكمال كل قسم واتبع تقدمك في التعلم'
    },
    {
      icon: Users,
      title: 'مجتمع تعليمي',
      description: 'انضم إلى مجتمع من المتعلمين والخبراء في مجال الأمن السيبراني'
    },
    {
      icon: Target,
      title: 'تطبيق عملي',
      description: 'مختبرات عملية وتحديات حقيقية لتطبيق ما تعلمته'
    },
    {
      icon: Zap,
      title: 'تحديث مستمر',
      description: 'محتوى محدث باستمرار ليواكب أحدث التطورات في الأمن السيبراني'
    },
    {
      icon: Shield,
      title: 'شهادات معتمدة',
      description: 'إرشادات للحصول على الشهادات المهنية المعترف بها عالمياً'
    }
  ];

  const learningPaths = [
    {
      title: '🚀 الأساسيات',
      description: 'تعلم أساسيات الشبكات وأنظمة التشغيل والأمن السيبراني',
      modules: 9
    },
    {
      title: '🔎 المفاهيم الأساسية',
      description: 'فهم مفاهيم الأمان وأفضل الممارسات والأدوات الأساسية',
      modules: 10
    },
    {
      title: '🌐 التخصص',
      description: 'اختر تخصصك في أمن الشبكات أو اختبار الاختراق أو غيرها',
      modules: 8
    },
    {
      title: '💻 الخبرة العملية',
      description: 'مختبرات عملية وتحديات لتطبيق المعرفة النظرية',
      modules: 15
    }
  ];
const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen">
       {/* رسالة منبثقة */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">رسالة تحفيزية</h3>
            <p className="mb-6 text-lg">{message}</p>
            <Button onClick={closeModal} className="px-6">
              أغلق
            </Button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                مسار تعلم الأمن السيبراني
                <span className="text-primary block">الشامل</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                ابدأ رحلتك في عالم الأمن السيبراني مع مسار تعليمي شامل ومنظم. 
                من الأساسيات إلى التخصصات المتقدمة، كل ما تحتاجه في مكان واحد.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto glow-effect">
                    ابدأ التعلم الآن
                  </Button>
                </Link>
                <Link to="/learning-path">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    استكشف المسار
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src={heroImage} 
                alt="Cybersecurity Learning" 
                className="max-w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">لماذا تختار منصتنا؟</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نوفر لك تجربة تعليمية متكاملة ومميزة في مجال الأمن السيبراني
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">المسار التعليمي</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              مسار منظم ومتدرج يأخذك من المبتدئ إلى الخبير في الأمن السيبراني
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {path.modules} وحدة تعليمية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {path.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img 
                src={rewardsImage} 
                alt="Rewards and Gamification" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
            <div className="text-center lg:text-right">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                نظام النقاط والحوافز
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                اجعل تعلمك أكثر متعة وتحفيزاً مع نظام النقاط والشارات. 
                احصل على نقاط عند إكمال كل قسم وتنافس مع المتعلمين الآخرين.
              </p>
              <ul className="text-right space-y-3 mb-8">
                <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                  <span>نقاط لكل قسم مكتمل</span>
                  <Award className="h-5 w-5 text-primary" />
                </li>
                <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                  <span>شارات للإنجازات المميزة</span>
                  <Shield className="h-5 w-5 text-primary" />
                </li>
                <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                  <span>مستويات تقدم متدرجة</span>
                  <Target className="h-5 w-5 text-primary" />
                </li>
              </ul>
              <Link to="/register">
                <Button size="lg" className="glow-effect">
                  ابدأ رحلتك الآن
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            هل أنت مستعد لتصبح خبيراً في الأمن السيبراني؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى آلاف المتعلمين الذين بدأوا رحلتهم معنا وحققوا أهدافهم المهنية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                إنشاء حساب مجاني
              </Button>
            </Link>
            <Link to="/sponsor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                تعرف على الراعي
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

