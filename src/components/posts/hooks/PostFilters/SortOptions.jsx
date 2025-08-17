import React from 'react';
import { ArrowUpDown, Calendar, Heart, MessageCircle, TrendingUp } from 'lucide-react';

const SortOptions = ({ 
  sortBy = 'date', 
  sortOrder = 'desc', 
  onSortChange 
}) => {
  const sortOptions = [
    {
      value: 'date',
      label: 'التاريخ',
      icon: Calendar,
      description: 'ترتيب حسب تاريخ النشر'
    },
    {
      value: 'likes',
      label: 'الإعجابات',
      icon: Heart,
      description: 'ترتيب حسب عدد الإعجابات'
    },
    {
      value: 'replies',
      label: 'التعليقات',
      icon: MessageCircle,
      description: 'ترتيب حسب عدد التعليقات'
    },
    {
      value: 'engagement',
      label: 'التفاعل',
      icon: TrendingUp,
      description: 'ترتيب حسب إجمالي التفاعل'
    }
  ];

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Toggle order if same sort option is selected
      const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      onSortChange(sortBy, newOrder);
    } else {
      // Default to descending for new sort option
      onSortChange(newSortBy, 'desc');
    }
  };

  return (
    <div className="sort-options">
      <div className="sort-label">
        <ArrowUpDown className="w-4 h-4" />
        <span>ترتيب حسب:</span>
      </div>
      
      <div className="sort-buttons">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isActive = sortBy === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`sort-button ${isActive ? 'active' : ''}`}
              title={option.description}
            >
              <Icon className="w-4 h-4" />
              <span>{option.label}</span>
              {isActive && (
                <span className="sort-order">
                  {sortOrder === 'desc' ? '↓' : '↑'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortOptions;