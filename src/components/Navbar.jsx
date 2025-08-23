import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User, LogOut, Home, BookOpen, Award, Menu, X, MessageSquare } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// SVG Path لأيقونة التلجرام
import { Helmet } from "react-helmet";

const TelegramIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    className={`${className} w-6 h-6`}
  >
    <path d="M320 72C183 72 72 183 72 320C72 457 183 568 320 568C457 568 568 457 568 320C568 183 457 72 320 72zM435 240.7C431.3 279.9 415.1 375.1 406.9 419C403.4 437.6 396.6 443.8 390 444.4C375.6 445.7 364.7 434.9 350.7 425.7C328.9 411.4 316.5 402.5 295.4 388.5C270.9 372.4 286.8 363.5 300.7 349C304.4 345.2 367.8 287.5 369 282.3C369.2 281.6 369.3 279.2 367.8 277.9C366.3 276.6 364.2 277.1 362.7 277.4C360.5 277.9 325.6 300.9 258.1 346.5C248.2 353.3 239.2 356.6 231.2 356.4C222.3 356.2 205.3 351.4 192.6 347.3C177.1 342.3 164.7 339.6 165.8 331C166.4 326.5 172.5 322 184.2 317.3C256.5 285.8 304.7 265 328.8 255C397.7 226.4 412 221.4 421.3 221.2C423.4 221.2 427.9 221.7 430.9 224.1C432.9 225.8 434.1 228.2 434.4 230.8C434.9 234 435 237.3 434.8 240.6z" fill="white" />

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
    <>
 
   
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
                <NavLink to="/posts" icon={MessageSquare}>المنشورات</NavLink>
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
                      <MobileNavLink to="/posts" icon={MessageSquare}>المنشورات</MobileNavLink>
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
     </>
  );
};

export default Navbar;