import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User, LogOut, Home, BookOpen, Award } from 'lucide-react';
import { TelegramIcon } from './components/icons/TelegramIcon'; // عدّل حسب مسار ملف الأيقونة

const Navbar = ({ currentUser, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CyberLearn</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Link
              to="/"
              className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>الرئيسية</span>
            </Link>

            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>لوحة التحكم</span>
                </Link>

                <Link
                  to="/learning-path"
                  className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/learning-path') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>المسار التعليمي</span>
                </Link>
              </>
            )}

            <Link
              to="/sponsor"
              className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/sponsor') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>الراعي الرسمي</span>
            </Link>

            {/* أيقونة قناة التلجرام */}
            <a
              href="https://t.me/SyberSc71"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="قناة التلجرام"
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {currentUser ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 rtl:space-x-reverse">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentUser.name}</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLogout}
                  className="flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">تسجيل الخروج</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link to="/login">
                  <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">إنشاء حساب</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            الرئيسية
          </Link>

          {currentUser && (
            <>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                لوحة التحكم
              </Link>

              <Link
                to="/learning-path"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/learning-path') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                المسار التعليمي
              </Link>
            </>
          )}

          <Link
            to="/sponsor"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/sponsor') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            الراعي الرسمي
          </Link>

          {/* أيقونة التلجرام للموبايل */}
          <a
            href="https://t.me/SyberSc71"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="قناة التلجرام"
          >
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <TelegramIcon className="h-5 w-5" />
              <span>قناة التلجرام</span>
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
