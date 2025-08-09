import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Shield, Mail, Lock, XCircle } from 'lucide-react';
import userManager from "../utils/userManager";


const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();

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

    // استخدام userManager الجديد مع Firebase
    const result = await userManager.login(formData.email, formData.password);

    if (result.success) {
      // قم بتنفيذ وظيفة النجاح إذا كانت موجودة
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
      navigate('/dashboard');
    } else {
      setError(result.message);
      setShowErrorDialog(true);
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
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm mb-2">حساب تجريبي:</h3>
            <p className="text-xs text-muted-foreground mb-2">
              يمكنك إنشاء حساب جديد أو استخدام البيانات التالية للتجربة:
            </p>
            <div className="text-xs space-y-1">
              <p><strong>البريد:</strong> demo@example.com</p>
              <p><strong>كلمة المرور:</strong> demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;