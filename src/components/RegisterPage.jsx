import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, User, Mail, Lock } from 'lucide-react';
import userManager from "../utils/userManager";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقتان');
      setLoading(false);
      return;
    }

  const result = await userManager.register({
  name: formData.name,
  email: formData.email,
  password: formData.password
});


    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            أو{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              تسجيل الدخول إلى حسابك
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">انضم إلينا</CardTitle>
            <CardDescription className="text-center">
              ابدأ رحلتك في تعلم الأمن السيبراني اليوم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="pr-10"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

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
                    placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="pr-10"
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
  <Card className="bg-muted/50">
  <CardContent className="pt-6">
    <p className="text-xs text-muted-foreground text-center">
      بإنشاء حساب، فإنك توافق على إرسال بياناتك إلى خوادمنا لغرض حفظ تقدمك
      ومزامنته عبر أجهزتك.
    </p>
  </CardContent>
</Card>

      </div>
    </div>
  );
};

export default RegisterPage;