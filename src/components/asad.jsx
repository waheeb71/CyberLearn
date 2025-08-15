import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TelegramIcon } from './icons/TelegramIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { Helmet } from "react-helmet";

import { 
  User, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe,
  Award,
  Code,
  Brush, 
  LayoutPanelLeft
} from 'lucide-react';

const Asad = () => {
const socialLinks = [
  { name: 'Gmail', icon: Mail, url: 'mailto:asadbinah@gmail.com', description: 'تواصل معي مباشرة عبر البريد الإلكتروني' },
  { name: 'Github', icon: Github, url: 'https://github.com/asadbinah', description: 'تابع مشاريعي على GitHub' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/asadbinah', description: 'تواصل معي على LinkedIn' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/asadbinah', description: 'تابعني على تويتر' }
];

const skills = [
  'تطوير الواجهات الأمامية (Frontend)',
  'تصميم واجهات المستخدم (UI Design)',
  'React.js',
  'Tailwind CSS',
  'Figma',
  'إدارة المشاريع'
];

const achievements = [
  {
    title: 'خبير في تصميم الواجهات',
    description: 'تصميم واجهات مستخدم جذابة وتجربة مستخدم سلسة',
    icon: Brush
  },
  {
    title: 'مطور واجهات أمامية',
    description: 'بناء مكونات تفاعلية باستخدام أحدث التقنيات',
    icon: Code
  },
  {
    title: 'مساهم في مجتمع المصممين',
    description: 'مشاركة المعرفة والخبرات في مجال التصميم',
    icon: Award
  }
];

  return (
      <>
    <Helmet>
      <title>أسد بنه - مطور واجهات أمامية</title>
      <meta name="description" content="أسد بنه، مطور واجهات أمامية متخصص في تصميم وتطوير الواجهات الجميلة." />
      <meta name="keywords" content="أسد بنه, مطور واجهات أمامية, تصميم واجهات, تطوير واجهات" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="google-adsense-account" content="ca-pub-2404732748519909"></meta>
  <title>مسار تعلم الأمن السيبراني الشامل</title>
  <meta name="description" content="ابدأ رحلتك في تعلم الأمن السيبراني من الصفر حتى الاحتراف، مع خطة منظمة وموارد تعليمية عالية الجودة موجهة للطلاب والمهتمين بالمجال." />
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
  

    </Helmet>
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            أسد بنه
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            مساهم ومطور واجهات أمامية (Frontend Developer)
          </p>
          <Badge className="text-lg px-4 py-2 bg-primary/10 text-primary border-primary">
            <LayoutPanelLeft className="w-4 h-4 ml-2" />
            محب لتصميم وتطوير الواجهات الجميلة
          </Badge>
        </div>

        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <User className="h-5 w-5" />
              <span>نبذة عني</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
          <p className="text-lg leading-relaxed text-muted-foreground mb-6">
أهلاً! أنا أسد بنه، متخصص في تطوير الواجهات الأمامية وتصميم تجارب المستخدم (UX/UI).
أؤمن بقوة التصميم في خلق تجارب رقمية لا تُنسى.
أسعى للمساهمة في بناء واجهات جذابة وعملية لهذه المنصة.
</p>

          <p className="text-lg leading-relaxed text-muted-foreground">
هدفي هو تحويل الأفكار إلى واجهات أمامية ملموسة وجميلة.
</p>

          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Code className="h-5 w-5" />
              <span>المهارات والخبرات</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {achievements.map((achievement, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <achievement.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {achievement.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Links */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Globe className="h-5 w-5" />
              <span>تواصل معي</span>
            </CardTitle>
            <CardDescription>
              يسعدني التواصل معك عبر المنصات التالية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border rounded-lg hover:bg-accent transition-colors">
                    <link.icon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">{link.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                شكراً لدعمكم المتواصل
              </h2>
              <p className="text-lg mb-6 opacity-90">
                دعونا نصنع معاً تجربة رقمية استثنائية!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/asadbinah"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    <Github className="h-5 w-5 ml-2" />
                    تابعني على GitHub
                  </Button>
                </a>
               <a
                  href="https://www.linkedin.com/in/asadbinah"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    <Linkedin className="h-5 w-5 ml-2" />
                    تواصل معي على LinkedIn
                  </Button>
                </a>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            التصميم الجيد يمنح تجربة مستخدم أفضل
          </p>
        </div>
      </div>
    </div>
      </>
  );
};

export default Asad;