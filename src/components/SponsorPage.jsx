import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TelegramIcon } from './icons/TelegramIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { InstagramIcon } from './icons/InstagramIcon';

import { 
  User, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe,
  Award,
  Code,
  Shield,
  Heart
} from 'lucide-react';

const SponsorPage = () => {
const socialLinks = [
  { name: 'Gmail', icon: Mail, url: 'mailto:rhybmhywb9@gmail.com', description: 'تواصل معي مباشرة عبر البريد الإلكتروني' },
  { name: 'Telegram', icon: TelegramIcon, url: 'https://t.me/WAT4F', description: 'تابعني على تليجرام' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/wa__cys', description: 'تابع آخر التحديثات والأفكار' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/waheeb71', description: 'تواصل معي مهنياً' },
  { name: 'YouTube', icon: YouTubeIcon, url: 'https://www.youtube.com/@cyber_code1/', description: 'شاهد فيديوهاتي التعليمية' },
  { name: 'WhatsApp', icon: WhatsAppIcon, url: 'https://wa.me/967738695139', description: 'تواصل معي عبر واتساب' },
  { name: 'Instagram', icon: InstagramIcon, url: 'https://instagram.com/wa_20_cys', description: 'تابعني على انستجرام' }
];



 const skills = [
  'الأمن السيبراني',
  'تطوير الويب',
  'البرمجة',
  'إدارة المشاريع',
  'التعلم الذاتي',
  'الذكاء الاصطناعي'
];

const achievements = [
  {
    title: 'ذو خبرة في الأمن السيبراني',
    description: 'أتابع التعلم وأطور مهاراتي في هذا المجال باستمرار',
    icon: Shield
  },
  {
    title: 'مطور برمجيات',
    description: 'تصميم وتطوير حلول تقنية مبتكرة',
    icon: Code
  },
  {
    title: 'معلم ومرشد',
    description: 'دعم ومساعدة العديد من الطلاب في مسيرتهم التعليمية',
    icon: Award
  }
];


  return (
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
            وهيب الشرعبي
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            الراعي الرسمي لمنصة تعلم الأمن السيبراني
          </p>
          <Badge className="text-lg px-4 py-2 bg-primary/10 text-primary border-primary">
            <Heart className="w-4 h-4 ml-2" />
            شكراً لدعمك المستمر
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
مرحباً! أنا وهيب الشرعبي، متخصص في الأمن السيبراني وتطوير البرمجيات والذكاء الاصطناعي.
أؤمن بأهمية التعليم ومشاركة المعرفة مع المجتمع التقني.
أنشأت هذه المنصة لتكون مساراً تعليمياً شاملاً ومجانياً لكل من يرغب في تعلم الأمن السيبراني.
</p>

           <p className="text-lg leading-relaxed text-muted-foreground">
أسعى لمشاركة معرفتي بالأمن السيبراني والذكاء الاصطناعي لتمكين الجيل القادم من حماية عالمنا الرقمي.
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
                شكراً لك على دعم التعليم المجاني
              </h2>
              <p className="text-lg mb-6 opacity-90">
                بفضل دعمكم، نستطيع توفير محتوى تعليمي عالي الجودة مجاناً للجميع
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/waheeb71"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    <Github className="h-5 w-5 ml-2" />
                    تابعني على GitHub
                  </Button>
                </a>
               <a
  href="https://t.me/SyberSc71"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button
    size="lg"
    variant="outline"
    className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
  >
    <TelegramIcon className="h-5 w-5 ml-2" />
  قناه لتليجرام
  </Button>
</a>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            التعليم هو أقوى سلاح يمكن استخدامه لتغيير العالم
          </p>
        </div>
      </div>
    </div>
  );
};

export default SponsorPage;

