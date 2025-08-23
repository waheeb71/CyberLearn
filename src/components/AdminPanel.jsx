// src/components/AdminPanel.jsx
import React, { useState } from 'react';
import PopupManagement from './PopupManagement';
import AnnouncementsManagement from './AnnouncementsManagement';
import UsersManagement from './UsersManagement'; 
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; 

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('popup');

 
  const renderSection = () => {
    switch (activeSection) {
      case 'popup':
        return <PopupManagement />;
      case 'announcements':
        return <AnnouncementsManagement />;
      case 'users':
        return <UsersManagement />;
      default:
        return <PopupManagement />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - شريط التنقل الجانبي */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">لوحة التحكم</h2>
        <nav className="space-y-2">
          <Button
            onClick={() => setActiveSection('popup')}
            variant="ghost"
            className={cn("w-full justify-start text-lg", activeSection === 'popup' && "bg-gray-700")}
          >
            إدارة النوافذ المنبثقة
          </Button>
          <Button
            onClick={() => setActiveSection('announcements')}
            variant="ghost"
            className={cn("w-full justify-start text-lg", activeSection === 'announcements' && "bg-gray-700")}
          >
            إدارة الإعلانات
          </Button>
          <Button
            onClick={() => setActiveSection('users')}
            variant="ghost"
            className={cn("w-full justify-start text-lg", activeSection === 'users' && "bg-gray-700")}
          >
            إدارة المستخدمين
          </Button>
        </nav>
      </aside>

      {/* Main Content - المحتوى الرئيسي */}
      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          لوحة تحكم الموقع
        </h1>
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminPanel;
