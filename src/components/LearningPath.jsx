import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  ExternalLink,
  Star,
  Award,
  Target,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

import userManager from "../utils/userManager";

const LearningPath = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
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

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const markAsComplete = async (sectionKey) => {
    if (user && !user.progress[sectionKey]?.completed) {
      // السطر الذي تم تصحيحه هنا
      const result = await userManager.updateUserProgress(sectionKey, true, 10);
      
      if (result.success) {
        // تحديث حالة المستخدم بالبيانات الجديدة من النتيجة
        setUser(result.user);
      }
    }
  };

  const learningContent = {
    basics: {
      title: '🚀 الأساسيات',
      description: 'تعلم أساسيات الشبكات وأنظمة التشغيل والأمن السيبراني',
      items: [
        {
          title: 'أساسيات الشبكات',
          description: 'تعلم كيفية مشاركة الأجهزة للبيانات والاتصال عبر الشبكات',
          links: [
            { name: 'أساسيات الشبكات - Coursera', url: 'https://www.coursera.org/learn/computer-networking' },
            { name: 'Practical Networking', url: 'https://www.practicalnetworking.net/' }
          ]
        },
        {
          title: 'أساسيات أنظمة التشغيل',
          description: 'تعرف على كيفية عمل أنظمة التشغيل، وهو أمر مهم لفهم أمان النظام',
          links: [
            { name: 'أساسيات أنظمة التشغيل - Udemy', url: 'https://www.udemy.com/course/operating-system-concepts/' }
          ]
        },
        {
          title: 'مقدمة في الأمن السيبراني',
          description: 'ابدأ بأساسيات الأمن السيبراني وتعرف على أهميته',
          links: [
            { name: 'مقدمة في الأمن السيبراني - Cybrary', url: 'https://www.cybrary.it/course/introduction-to-it-and-cybersecurity/' }
          ]
        },
        {
          title: 'شهادة CompTIA Network+',
          description: 'تغطي هذه الشهادة كل ما تحتاج لمعرفته حول الشبكات',
          links: [
            { name: 'CompTIA Network+ - Cybrary', url: 'https://www.cybrary.it/course/comptia-network-plus/' }
          ]
        },
        {
          title: 'أساسيات Linux',
          description: 'تعلم أساسيات Linux، وهو نظام تشغيل شائع في الأمن السيبراني',
          links: [
            { name: 'أساسيات Linux - A Cloud Guru', url: 'https://acloudguru.com/course/linux-essentials' },
            { name: 'OverTheWire Bandit', url: 'https://overthewire.org/wargames/bandit/' }
          ]
        }
      ]
    },
    fundamentals: {
      title: '🔎 المفاهيم الأساسية',
      description: 'بناء أساس متين في الأمن السيبراني وفهم أفضل الممارسات',
      items: [
        {
          title: 'أساسيات الأمن وأفضل الممارسات',
          description: 'تعلم المبادئ الأساسية للأمن السيبراني وأفضل الممارسات',
          links: [
            { name: 'أساسيات الأمن السيبراني - Simplilearn', url: 'https://www.simplilearn.com/learn-cyber-security-basics-skillup' }
          ]
        },
        {
          title: 'أدوات وتقنيات الأمن الأساسية',
          description: 'اكتشف الأدوات الأساسية التي تساعد في حماية ومراقبة الأنظمة',
          links: [
            { name: 'أدوات الأمن السيبراني - YouTube', url: 'https://www.youtube.com/watch?v=SW6AE76Pi50' }
          ]
        },
        {
          title: 'مقدمة في القرصنة الأخلاقية',
          description: 'تعلم أساسيات القرصنة الأخلاقية وكيف تساعد في العثور على نقاط الضعف',
          links: [
            { name: 'أساسيات القرصنة الأخلاقية - Cybrary', url: 'https://www.cybrary.it/course/ethical-hacking/' }
          ]
        },
        {
          title: 'نقاط الضعف الأمنية الشائعة',
          description: 'فهم مخاطر الأمان الأكثر شيوعًا التي يمكن أن تؤثر على التطبيقات والشبكات',
          links: [
            { name: 'فهم نقاط الضعف الشائعة - OWASP', url: 'https://owasp.org/www-project-top-ten/' },
            { name: 'OWASP Juice Shop', url: 'https://owasp.org/www-project-juice-shop/' }
          ]
        }
      ]
    },
    specialization: {
      title: '🌐 التخصص',
      description: 'اختر تخصصك في مجال الأمن السيبراني',
      items: [
        {
          title: 'أمن الشبكات',
          description: 'تخصص في حماية الشبكات والبنية التحتية',
          links: [
            { name: 'CompTIA Security+', url: 'https://www.comptia.org/certifications/security' },
            { name: 'Cisco Certified CyberOps Associate', url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/cyberops-associate.html' }
          ]
        },
        {
          title: 'اختبار الاختراق',
          description: 'تعلم كيفية اختبار أمان الأنظمة والتطبيقات',
          links: [
            { name: 'Certified Ethical Hacker (CEH)', url: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/' },
            { name: 'Offensive Security Certified Professional (OSCP)', url: 'https://www.offensive-security.com/certification/oscp/' }
          ]
        },
        {
          title: 'الاستجابة للحوادث',
          description: 'تخصص في التعامل مع الحوادث الأمنية والاستجابة لها',
          links: [
            { name: 'Certified Incident Handler (GCIH)', url: 'https://www.giac.org/certification/certified-incident-handler-gcih' }
          ]
        },
        {
          title: 'أمن السحابة',
          description: 'تخصص في أمان الحوسبة السحابية',
          links: [
            { name: 'Certified Cloud Security Professional (CCSP)', url: 'https://www.isc2.org/Certifications/CCSP' },
            { name: 'AWS Certified Security – Specialty', url: 'https://aws.amazon.com/certification/certified-security-specialty/' }
          ]
        }
      ]
    },
    practicalExperience: {
      title: '💻 الخبرة العملية',
      description: 'احصل على خبرة عملية مع أدوات ومختبرات الأمن السيبراني',
      items: [
        {
          title: 'TryHackMe',
          description: 'مختبرات تفاعلية وموجهة تغطي مواضيع الأمن السيبراني المختلفة',
          links: [
            { name: 'مختبرات TryHackMe', url: 'https://tryhackme.com/' }
          ]
        },
        {
          title: 'Hack The Box',
          description: 'اختبر مهاراتك مع مجموعة واسعة من التحديات',
          links: [
            { name: 'مختبرات Hack The Box', url: 'https://www.hackthebox.eu/' }
          ]
        },
        {
          title: 'OverTheWire',
          description: 'سلسلة من ألعاب الحرب المصممة لتعلم مفاهيم الأمان',
          links: [
            { name: 'ألعاب OverTheWire', url: 'https://overthewire.org/wargames/' }
          ]
        },
        {
          title: 'VulnHub',
          description: 'أجهزة افتراضية ضعيفة قابلة للتنزيل للممارسة',
          links: [
            { name: 'VulnHub', url: 'https://www.vulnhub.com/' }
          ]
        },
        {
          title: 'OWASP Juice Shop',
          description: 'تطبيق ويب ضعيف لتعلم أمان تطبيقات الويب',
          links: [
            { name: 'OWASP Juice Shop', url: 'https://owasp.org/www-project-juice-shop/' }
          ]
        }
      ]
    },
    continuousLearning: {
      title: '📚 التعلم المستمر',
      description: 'موارد للبقاء على اطلاع بأحدث التطورات في الأمن السيبراني',
      items: [
        {
          title: 'أخبار الأمن السيبراني',
          description: 'مواقع إخبارية متخصصة في الأمن السيبراني',
          links: [
            { name: 'Dark Reading', url: 'https://www.darkreading.com/' },
            { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/' },
            { name: 'The Hacker News', url: 'https://thehackernews.com/' }
          ]
        },
        {
          title: 'مجتمعات التعلم',
          description: 'انضم إلى مجتمعات المتخصصين في الأمن السيبراني',
          links: [
            { name: 'Reddit - Netsec', url: 'https://www.reddit.com/r/netsec/' }
          ]
        }
      ]
    },
    youtubeChannels: {
      title: '📺 قنوات يوتيوب',
      description: 'قنوات تعليمية مفيدة في مجال الأمن السيبراني',
      items: [
        {
          title: 'قنوات تعليمية أساسية',
          description: 'قنوات يوتيوب تقدم محتوى تعليمي عالي الجودة',
          links: [
            { name: 'Cybrary', url: 'https://www.youtube.com/@CybraryIt' },
            { name: 'Hak5', url: 'https://www.youtube.com/user/Hak5Darren' },
            { name: 'Professor Messer', url: 'https://www.youtube.com/user/professormesser' }
          ]
        }
      ]
    },
    jobRoles: {
      title: '💼 الأدوار الوظيفية',
      description: 'تعرف على الفرص الوظيفية في مجال الأمن السيبراني',
      items: [
        {
          title: 'محلل أمن المعلومات',
          description: 'مراقبة وتحليل التهديدات الأمنية',
          links: []
        },
        {
          title: 'مهندس أمن الشبكات',
          description: 'تصميم وتنفيذ حلول أمان الشبكات',
          links: []
        },
        {
          title: 'خبير اختبار الاختراق',
          description: 'اختبار أمان الأنظمة والتطبيقات',
          links: []
        },
        {
          title: 'مستشار أمن المعلومات',
          description: 'تقديم الاستشارات الأمنية للمؤسسات',
          links: []
        }
      ]
    },
    certifications: {
      title: '📜 الشهادات',
      description: 'الشهادات المهنية المعتمدة في مجال الأمن السيبراني',
      items: [
        {
          title: 'شهادات المستوى المبتدئ',
          description: 'شهادات مناسبة للمبتدئين في المجال',
          links: [
            { name: 'CompTIA Security+', url: 'https://www.comptia.org/certifications/security' },
            { name: 'CompTIA Network+', url: 'https://www.comptia.org/certifications/network' }
          ]
        },
        {
          title: 'شهادات المستوى المتقدم',
          description: 'شهادات للمتخصصين ذوي الخبرة',
          links: [
            { name: 'CISSP', url: 'https://www.isc2.org/Certifications/CISSP' },
            { name: 'CISM', url: 'https://www.isaca.org/certifications/cism' }
          ]
        }
      ]
    },
    roadmap: {
      title: '📅 خارطة طريق لمدة 6 أشهر',
      description: 'خطة تعلم منظمة لمدة 6 أشهر',
      items: [
        {
          title: 'الشهر الأول والثاني: الأساسيات',
          description: 'بناء أساس قوي في الشبكات وأنظمة التشغيل',
          links: []
        },
        {
          title: 'الشهر الثالث والرابع: المفاهيم الأساسية',
          description: 'تعلم مفاهيم الأمان وأفضل الممارسات',
          links: []
        },
        {
          title: 'الشهر الخامس والسادس: التخصص والممارسة',
          description: 'اختيار التخصص والحصول على خبرة عملية',
          links: []
        }
      ]
    },
    additionalResources: {
      title: '💡 موارد إضافية',
      description: 'موارد ومراجع إضافية مفيدة',
      items: [
        {
          title: 'كتب مفيدة',
          description: 'كتب أساسية في مجال الأمن السيبراني',
          links: []
        },
        {
          title: 'أدوات مجانية',
          description: 'أدوات مجانية مفيدة للمتخصصين',
          links: []
        },
        {
          title: 'مؤتمرات وفعاليات',
          description: 'مؤتمرات مهمة في مجال الأمن السيبراني',
          links: []
        }
      ]
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>جاري تحميل مسار التعلم...</p>
      </div>
    );
  }

  if (!user) {
    // The redirect should handle this, but as a fallback, show a message
    return null; 
  }

  const completedSections = Object.values(user.progress).filter(p => p.completed).length;
  const totalSections = Object.keys(learningContent).length;
  const overallProgress = (completedSections / totalSections) * 100;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            مسار تعلم الأمن السيبراني الشامل
          </h1>
          <p className="text-muted-foreground mb-6">
            مسار منظم ومتدرج يأخذك من المبتدئ إلى الخبير في الأمن السيبراني
          </p>
          
          {/* Overall Progress */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">التقدم الإجمالي</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {completedSections}/{totalSections} أقسام
                </Badge>
              </div>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                {Math.round(overallProgress)}% مكتمل
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Sections */}
        <div className="space-y-6">
          {Object.entries(learningContent).map(([sectionKey, section]) => {
            const isCompleted = user.progress[sectionKey]?.completed || false;
            const isExpanded = expandedSections[sectionKey] || false;
            const score = user.progress[sectionKey]?.score || 0;

            return (
              <Card key={sectionKey} className={`card-hover ${isCompleted ? 'border-green-500' : ''}`}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleSection(sectionKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          <Star className="h-3 w-3 ml-1" />
                          {score} نقطة
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent>
                    <div className="space-y-6">
                      {section.items.map((item, index) => (
                        <div key={index} className="border-r-4 border-primary/20 pr-4">
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-3">{item.description}</p>
                          
                          {item.links.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-muted-foreground">الروابط المفيدة:</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.links.map((link, linkIndex) => (
                                  <a
                                    key={linkIndex}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 rtl:space-x-reverse text-sm text-primary hover:text-primary/80 border border-primary/20 rounded-md px-2 py-1 hover:bg-primary/5 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>{link.name}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t">
                        {!isCompleted ? (
                          <Button 
                            onClick={() => markAsComplete(sectionKey)}
                            className="w-full sm:w-auto"
                          >
                            <Award className="h-4 w-4 ml-2" />
                            تم إكمال هذا القسم
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">تم إكمال هذا القسم بنجاح!</span>
                            <Badge className="bg-green-100 text-green-800">
                              +{score} نقطة
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedSections === totalSections && (
          <Card className="mt-8 bg-primary text-primary-foreground">
            <CardContent className="pt-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                مبروك! لقد أكملت المسار التعليمي بالكامل! 🎉
              </h2>
              <p className="text-lg opacity-90">
                أنت الآن جاهز لبدء مسيرتك المهنية في مجال الأمن السيبراني
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LearningPath;