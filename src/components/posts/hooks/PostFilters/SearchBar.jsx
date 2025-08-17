import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { debounce } from '../utils/postHelpers';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  isSearching,
  placeholder = "ابحث في المنشورات...",
  hasResults, // إضافة خاصية جديدة للإشارة إلى وجود نتائج
  onClearSearch // إضافة دالة جديدة لمسح النتائج في المكون الأب
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // استخدام useRef للحصول على نسخة مستقرة من دالة البحث الموقوتة
  const debouncedSearchRef = useRef(
    debounce((term) => {
      // لا تقم باستدعاء البحث إذا كان المصطلح فارغًا
      if (term.trim()) {
        onSearchChange(term);
      }
    }, 500)
  );

  useEffect(() => {
    // قم باستدعاء الدالة الموقوتة في كل مرة يتغير فيها localSearchTerm
    debouncedSearchRef.current(localSearchTerm);
    
    // إذا كان حقل البحث فارغًا، قم بمسح النتائج فورًا
    if (localSearchTerm.trim() === '') {
      onClearSearch();
    }
    
    // تنظيف (cleanup) دالة الـ debounce عند إزالة المكون
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [localSearchTerm, onClearSearch]);

  const handleInputChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleClear = () => {
    // مسح حقل البحث
    setLocalSearchTerm('');
    // استدعاء دالة مسح النتائج فورًا
    onClearSearch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      // عند الضغط على Enter، قم بالبحث مباشرة دون انتظار الـ debounce
      debouncedSearchRef.current.cancel();
      onSearchChange(localSearchTerm);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <Search className="search-icon" />
          <input
            type="text"
            value={localSearchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="search-input"
            disabled={isSearching}
          />
          {localSearchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSearching || !localSearchTerm.trim()}
          className="search-button"
        >
          {isSearching ? (
            <div className="loading-spinner" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">
            {isSearching ? 'جاري البحث...' : 'بحث'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-button ${showFilters ? 'active' : ''}`}
          title="فلاتر البحث"
        >
          <Filter className="w-5 h-5" />
        </button>
      </form>

      {showFilters && (
        <div className="search-filters">
          <div className="filter-group">
            <label className="filter-label">نوع المحتوى:</label>
            <div className="filter-options">
              <label className="filter-option">
                <input type="checkbox" defaultChecked />
                <span>منشورات المستخدمين</span>
              </label>
              <label className="filter-option">
                <input type="checkbox" defaultChecked />
                <span>منشورات المنصة</span>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">ترتيب النتائج:</label>
            <select className="filter-select">
              <option value="date">الأحدث أولاً</option>
              <option value="relevance">الأكثر صلة</option>
              <option value="likes">الأكثر إعجاباً</option>
              <option value="replies">الأكثر تعليقاً</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">التاريخ:</label>
            <select className="filter-select">
              <option value="all">جميع الأوقات</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="year">هذا العام</option>
            </select>
          </div>
        </div>
      )}

      {/* عرض رسالة البحث */}
      {localSearchTerm && (
        <div className="search-info">
          <span className="text-sm text-gray-600">
            البحث عن: "<strong>{localSearchTerm}</strong>"
          </span>
          {isSearching && (
            <span className="text-sm text-blue-600 mr-2">
              جاري البحث...
            </span>
          )}
        </div>
      )}

      {/* عرض رسالة لا توجد نتائج */}
      {/* يجب تمرير hasResults من المكون الأب */}
      {!isSearching && localSearchTerm.trim() && !hasResults && (
        <div className="text-center text-gray-500 mt-4">
          لا توجد نتائج مطابقة لـ "<strong>{localSearchTerm}</strong>".
        </div>
      )}
    </div>
  );
};

export default SearchBar;