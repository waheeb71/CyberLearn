import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  ExternalLink,
  Star,
  Award,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

import userManager from "../utils/userManager";
import { Helmet } from "react-helmet";

// ... (مكون ConfirmationDialog بدون تغيير)
const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
    const [loading, setLoading] = useState(false);
  
    const handleConfirm = async () => {
      setLoading(true);
      await onConfirm();
      setLoading(false);
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 text-center">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'white' }}>{message}</h3>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <Button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              ) : "موافق"}
            </Button>
            <Button onClick={onCancel} variant="outline" disabled={loading}>
              لا
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
const LearningPathAI = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sectionToComplete, setSectionToComplete] = useState(null);
  const navigate = useNavigate();

  // اسم المسار الذي تعمل عليه هذه الصفحة
  const pathName = 'ai';

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await userManager.getCurrentUser();
      if (currentUser) {
        // التحقق من أن المستخدم مشترك في مسار الذكاء الاصطناعي، وإن لم يكن، يتم اشتراكه تلقائيًا
        if (!currentUser.enrolledPaths?.includes(pathName)) {
          const enrollResult = await userManager.enrollInPath(pathName);
          setUser(enrollResult.user);
        } else {
          setUser(currentUser);
        }
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

  const handleMarkAsCompleteClick = (sectionKey) => {
    setSectionToComplete(sectionKey);
    setShowConfirmDialog(true);
  };

  const confirmCompletion = async () => {
    // يجب أن تحدد المسار هنا 'ai'
    const pathId = 'ai';
    const isCompleted = user.pathsProgress?.[pathId]?.progress?.[sectionToComplete]?.completed;
    
    if (user && sectionToComplete && !isCompleted) {
      // قم بتمرير pathId إلى دالة التحديث الجديدة
      const result = await userManager.updatePathProgress(pathId, sectionToComplete, true, 10);
      if (result.success) setUser(result.user);
    }
    setShowConfirmDialog(false);
    setSectionToComplete(null);
  };

  const cancelCompletion = () => {
    setShowConfirmDialog(false);
    setSectionToComplete(null);
  };

  const learningContent = {
    // ... (هذا الجزء من الشيفرة بدون تغيير)
    basics: {
      title: ' الأساسيات',
      description: 'ابدأ بفهم الرياضيات، البرمجة، والخوارزميات الأساسية للذكاء الاصطناعي',
      items: [
        {
          title: 'أساسيات الرياضيات للذكاء الاصطناعي',
          description: 'تعلم الجبر الخطي، الاحتمالات، والتفاضل والتكامل',
          links: [
         
            { name: 'الجبر الخطي لعلم البيانات', url: 'https://youtube.com/playlist?list=PLtsZ69x5q-X_mtZI2heqry-nw3-6apBqm&si=ZV9ps_FpWdMoYlod' }
          ]
        },
        {
          title: 'أساسيات البرمجة (Python)',
          description: 'Python هي لغة أساسية لتطبيقات الذكاء الاصطناعي',
          links: [
           {
    name: 'لديك خلفية عن لغة برمجة أخرى - تابع صحيح',
    url: 'https://youtu.be/pdsc9SVW-S8?si=KS7qaBgJmGIqfHQz'
  },
  {
    name: 'لا تعرف عن لغات البرمجة شيئًا - تابع هذه السلسلة',
    url: 'https://youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs&si=PvHZnjru_yWAFuF_'
  }
          ]
        },
        {
          title: 'مقدمة في الذكاء الاصطناعي',
          description: 'فهم المفاهيم الأساسية مثل التعلم الآلي والشبكات العصبية',
          links: [
            { name: 'Intro to AI - English', url: 'https://www.coursera.org/learn/ai-for-everyone' },
            { name: 'مقدمة في الذكاء الاصطناعي - عربي', url: 'https://youtube.com/playlist?list=PLXlHqMRg9lAa48zcXmM08DonedIxZcoz5&si=tEjKHCGizd_HGaLn' }
          ]
        }
      ]
    },
    machineLearning: {
      title: ' التعلم الآلي',
      description: 'تعلم نماذج التعلم الآلي وتقنيات التدريب والتقييم',
      items: [
        {
          title: 'مقدمة في التعلم الآلي',
          description: 'أساسيات الخوارزميات مثل الانحدار الخطي وشجرة القرار',
          links: [

            {
    name: 'Machine Learning - Andrew Ng (نظري)',
    url: 'https://youtube.com/playlist?list=PLtsZ69x5q-X9j44MdSX-NGuOhGXOY0aqH&si=ueqxKy9ViX39MUbE'
  },
  {
    name: 'Machine Learning - Andrew Ng (عملي)',
    url: 'https://t.me/c_yber_r/79'
  }

          ]
        },
        {
          title: 'تعلم عميق',
          description: 'مقدمة لشبكات الأعصاب العميقة والتعلم العميق',
          links: [
            { name: 'Deep Learning عربي', url: 'https://t.me/c_yber_r/72' },
             { name:  'تعلم TensorFlow للتعلم العميق - من الصفر إلى الاحتراف', url: 'https://t.me/c_yber_r/241' },
            { name: 'التعلم العميق - أندرو نج (اختياري وانصح فية)', url: 'https://www.coursera.org/specializations/deep-learning' }
          ]
        }
      ]
    },
    practicalProjects: {
      title: 'المشاريع العملية',
  description: 'طبق ما تعلمته على مشاريع حقيقية',
  items: [
    {
      title: 'مشروع التعرف على الصور',
      description: 'تصميم نموذج للتعرف على الصور باستخدام الشبكات العصبية التلافيفية (CNN)',
      links: [
        { name: 'مشروع التعرف على الوجه', url: 'https://youtu.be/2z70y_8kKA0?si=cuHF8ecxaXSGBDwu' },
        { name: 'مشروع تصنيف الصور على Kaggle', url: 'https://www.kaggle.com/competitions' },
        { name: 'مشروع Food Vision على GitHub', url: 'https://github.com/mrdbourke/tensorflow-deep-learning' }
      ]
    },
    {
      title: 'مشروع معالجة اللغة الطبيعية',
      description: 'استخدام NLP لتحليل النصوص وبناء نماذج لفهم النصوص',
      links: [
        { name: 'مشروع تصنيف النصوص على Kaggle', url: 'https://www.kaggle.com/competitions' },
        { name: 'مشروع SkimLit - استخراج المعلومات من النصوص', url: 'https://github.com/mrdbourke/skimlit' },
          { name: 'انشاء مودل ذكاء اصطناعي باستخدام بايثون لعمل تصنيف للصور ', url: 'https://youtu.be/3wQCImF_eEg?si=ozMla8_HMvoU4ykt' },
      ]
    },
    {
      title: 'مشروع التنبؤ بالبيانات الزمنية',
      description: 'بناء نموذج للتنبؤ بحركة الأسعار أو البيانات الزمنية باستخدام RNN أو LSTM',
      links: [
      
       { name: 'مشروع التنبؤ بالبيانات الزمنية على GitHub', url: 'https://github.com/mrdbourke/tensorflow-deep-learning/blob/main/10_time_series_forecasting_in_tensorflow.ipynb' }
      ]
    },
    {
      title: 'مشروع التعلم بالنقل (Transfer Learning)',
      description: 'استخدام نماذج مدربة مسبقًا لتحسين أداء مشاريعك بسرعة',
      links: [
        { name: 'العديد من المشاريع ', url: 'https://github.com/tensorflow/models/tree/master/official/vision' },
        { name: 'مشروع التعرف على الأرقام (MNIST)', url: 'https://github.com/aymericdamien/TensorFlow-Examples' },

     
      ]
    }
  ]
    },
    continuousLearning: {
      title: ' التعلم المستمر',
      description: 'ابقَ على اطلاع بأحدث التطورات في الذكاء الاصطناعي',
      items: [
        {
          title: 'مقالات وأخبار AI',
          description: 'تابع أحدث الأبحاث والتقنيات',
          links: [
            { name: 'arXiv AI', url: 'https://arxiv.org/list/cs.AI/recent' },
            { name: 'Towards Data Science', url: 'https://towardsdatascience.com/' },
            { name: 'قناة الذكاء الاصطناعي', url: 'https://t.me/c_yber_r' },
          ]
        }
      ]
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري تحميل مسار التعلم...</div>;
  if (!user) return null;

  // الوصول إلى تقدم مسار الذكاء الاصطناعي المحدد
  const aiProgress = user.pathsProgress?.[pathName]?.progress || {};
  const completedSections = Object.values(aiProgress).filter(p => p.completed).length;
  const totalSections = Object.keys(learningContent).length;
  const overallProgress = (completedSections / totalSections) * 100;

  return (
    <>
      <Helmet>
        <title>مسار تعلم الذكاء الاصطناعي</title>
        <meta name="description" content="ابدأ رحلتك في تعلم الذكاء الاصطناعي من الصفر حتى الاحتراف" />
      </Helmet>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4" style={{ color: 'white' }}>مسار تعلم الذكاء الاصطناعي الشامل</h1>
          <p className="text-muted-foreground mb-6">مسار منظم ومتدرج يأخذك من المبتدئ إلى الخبير في الذكاء الاصطناعي</p>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">التقدم الإجمالي</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">{completedSections}/{totalSections} أقسام</Badge>
              </div>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">{Math.round(overallProgress)}% مكتمل</p>
            </CardContent>
          </Card>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {Object.entries(learningContent).map(([sectionKey, section]) => {
            // الوصول إلى تقدم القسم المحدد داخل مسار الذكاء الاصطناعي
            const isCompleted = aiProgress[sectionKey]?.completed || false;
            const isExpanded = expandedSections[sectionKey] || false;
            const score = aiProgress[sectionKey]?.score || 0;

            return (
              <Card key={sectionKey} className={`card-hover ${isCompleted ? 'border-green-500' : ''}`}>
                <CardHeader className="cursor-pointer" onClick={() => toggleSection(sectionKey)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      {isCompleted ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                      <div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                        <CardDescription className="mt-1">{section.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {isCompleted && <Badge className="bg-green-100 text-green-800"><Star className="h-3 w-3 ml-1" />{score} نقطة</Badge>}
                      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
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
                                  <a key={linkIndex} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 rtl:space-x-reverse text-sm text-primary hover:text-primary/80 border border-primary/20 rounded-md px-2 py-1 hover:bg-primary/5 transition-colors">
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
                          <Button onClick={() => handleMarkAsCompleteClick(sectionKey)} className="w-full sm:w-auto">
                            <Award className="h-4 w-4 ml-2" /> تم إكمال هذا القسم
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">تم إكمال هذا القسم بنجاح!</span>
                            <Badge className="bg-green-100 text-green-800">+{score} نقطة</Badge>
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

        {completedSections === totalSections && (
          <Card className="mt-8 bg-primary text-primary-foreground">
            <CardContent className="pt-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">مبروك! لقد أكملت مسار الذكاء الاصطناعي بالكامل! 🎉</h2>
              <p className="text-lg opacity-90">أنت الآن جاهز لبدء مسيرتك المهنية في مجال الذكاء الاصطناعي</p>
            </CardContent>
          </Card>
        )}
      </div>

      {showConfirmDialog && (
        <ConfirmationDialog
          message="هل أنت متأكد من أنك أكملت كل شيء في هذا القسم؟"
          onConfirm={confirmCompletion}
          onCancel={cancelCompletion}
        />
      )}
    </>
  );
};

export default LearningPathAI;