import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User, LogOut, Home, BookOpen, Award, Menu, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// SVG Path لأيقونة التلجرام
const TelegramIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.184 7.74l-2.973 13.916c-.234 1.106-.827 1.343-1.743.834l-5.636-4.184-2.736 2.646c-.347.337-.638.647-1.218.647-.282 0-.498-.073-.68-.216l-.887-.643c-.47-.34-.582-.871-.242-1.353l2.883-4.306 6.837-6.52c.31-.297.603-.217.472.091l-8.706 8.358-1.503-4.825c-.275-.87.274-1.205 1.085-1.042l11.458 4.417c.806.31.797.77.165 1.157z" />
  </svg>
);

const Navbar = ({ currentUser, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to) 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );

  const MobileNavLink = ({ to, icon: Icon, children }) => (
    <DropdownMenuItem asChild>
      <Link
        to={to}
        className={`flex items-center space-x-2 rtl:space-x-reverse ${
          isActive(to) ? 'bg-primary text-primary-foreground' : ''
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </Link>
    </DropdownMenuItem>
  );

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CyberLearn</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <NavLink to="/" icon={Home}>الرئيسية</NavLink>
            {currentUser && (
              <>
                <NavLink to="/dashboard" icon={User}>لوحة التحكم</NavLink>
                <NavLink to="/learning-path" icon={BookOpen}>المسار التعليمي</NavLink>
              </>
            )}
            <NavLink to="/sponsor" icon={Award}>الراعي الرسمي</NavLink>
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
                <Link to="/profile" className="hidden md:block">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 rtl:space-x-reverse">
                    <User className="h-4 w-4" />
                    <span>{currentUser.name}</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLogout}
                  className="hidden md:flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                <Link to="/login">
                  <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">إنشاء حساب</Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">فتح القائمة</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <MobileNavLink to="/" icon={Home}>الرئيسية</MobileNavLink>
                  {currentUser && (
                    <>
                      <DropdownMenuSeparator />
                      <MobileNavLink to="/dashboard" icon={User}>لوحة التحكم</MobileNavLink>
                      <MobileNavLink to="/learning-path" icon={BookOpen}>المسار التعليمي</MobileNavLink>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <MobileNavLink to="/sponsor" icon={Award}>الراعي الرسمي</MobileNavLink>
                  <DropdownMenuItem asChild>
                    <a
                      href="https://t.me/SyberSc71"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <TelegramIcon className="h-4 w-4" />
                      <span>قناة التلجرام</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {currentUser ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center space-x-2 rtl:space-x-reverse">
                          <User className="h-4 w-4" />
                          <span>الملف الشخصي</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onLogout}>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse w-full">
                          <LogOut className="h-4 w-4" />
                          <span>تسجيل الخروج</span>
                        </div>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/login">
                          <div className="flex items-center w-full">
                            <span>تسجيل الدخول</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register">
                          <div className="flex items-center w-full">
                            <span>إنشاء حساب</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;