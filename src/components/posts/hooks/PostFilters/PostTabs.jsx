import React from 'react';
import { Users, MessageSquare, TrendingUp, Clock } from 'lucide-react';

const PostTabs = ({ 
  activeTab, 
  onTabChange, 
  userPostsCount = 0, 
  platformPostsCount = 0 
}) => {
  const tabs = [
    {
      id: 'user',
      label: 'منشورات المستخدمين',
      icon: Users,
      count: userPostsCount,
      description: 'منشورات من أعضاء المجتمع'
    },
    {
      id: 'platform',
      label: 'منشورات المنصة',
      icon: MessageSquare,
      count: platformPostsCount,
      description: 'منشورات رسمية من المنصة'
    },
    {
      id: 'trending',
      label: 'الأكثر تفاعلاً',
      icon: TrendingUp,
      count: 0,
      description: 'المنشورات الأكثر إعجاباً وتعليقاً'
    },
    {
      id: 'recent',
      label: 'الأحدث',
      icon: Clock,
      count: 0,
      description: 'أحدث المنشورات المضافة'
    }
  ];

  return (
    <div className="posts-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-button ${isActive ? 'active' : ''}`}
            title={tab.description}
          >
            <Icon className="w-5 h-5" />
            <span className="tab-label">{tab.label}</span>
            {tab.count > 0 && (
              <span className="tab-count">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PostTabs;