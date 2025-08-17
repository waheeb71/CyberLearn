import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Shield, Mail, Lock, XCircle } from 'lucide-react';
// لا نحتاج إلى userManager هنا مباشرة، لأننا نستخدم الـ prop onLogin
// import userManager from "../utils/userManager";

import { ReactTyped } from "react-typed";
import { Helmet } from "react-helmet";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // ليس هناك حاجة لاستخدام useNavigate هنا
  // const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setShowErrorDialog(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowErrorDialog(false);

    if (!formData.email || !formData.password) {
      setError('يرجى ملء جميع الحقول');
      setShowErrorDialog(true);
      setLoading(false);
      return;
    }

    // هنا نقوم بتمرير البيانات إلى الدالة onLogin التي تم تمريرها من App.js
    const result = await onLogin(formData.email, formData.password);

    if (result.success) {
      // لا تفعل شيئًا هنا.
      // App.js سيتولى إعادة التوجيه بشكل تلقائي عند تحديث حالة المستخدم.
    } else {
      setError(result.message);
      setShowErrorDialog(true);
    }

    setLoading(false);
  };

  return (
      <>
      <Helmet>
        <title>تسجيل الدخول - الأمن السيبراني</title>
        <meta name="description" content="تسجيل الدخول إلى حسابك في منصة الأمن السيبراني" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="google-adsense-account" content="ca-pub-2404732748519909"></meta>
 
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
  <link crossorigin href="https://fonts.gstatic.com/" rel="preconnect"/>

  
      </Helmet>
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            أو{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary/80">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">مرحباً بعودتك</CardTitle>
            <CardDescription className="text-center">
              سجل دخولك للمتابعة في مسارك التعليمي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pr-10"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pr-10"
                    placeholder="أدخل كلمة المرور"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex items-center space-y-0">
              <XCircle className="h-10 w-10 text-red-500 mb-2" />
              <DialogTitle className="text-red-500">حدث خطأ!</DialogTitle>
              <DialogDescription className="text-center">
                {error}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button onClick={() => setShowErrorDialog(false)}>حسناً</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
<Card className="bg-muted/50">
  <CardContent className="pt-1">
    <h3 className="font-semibold text-lg text-center mb-3 w-full">💡 تذكر:</h3>
    <p className="text-xl font-bold text-primary leading-relaxed text-center">
      <ReactTyped
        strings={[
          "رحلة الألف ميل تبدأ بخطوة.",
          "كل يوم تتعلم فيه، أنت تتطور.",
          "الفشل هو خطوة نحو النجاح.",
          "المعرفة قوة، والبحث مفتاحها.",
          "تعلم شيئًا جديدًا كل يوم.",
           "النجاح يحتاج صبر واجتهاد، فأنت على الطريق الصحيح.",
             "كل خطوة صغيرة تقربك أكثر من هدفك في الأمن السيبراني.",

        ]}
        typeSpeed={70}
        backSpeed={40}
        backDelay={1500}
        loop
      />
    </p>
  </CardContent>
</Card>

      </div>
    </div>
     </>
  );
};

export default LoginPage;