// src/components/PopupManagement.jsx
import React, { useState, useEffect } from 'react';
import { database } from '../utils/firebaseConfig';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit } from 'lucide-react';

const PopupManagement = () => {
  const [popups, setPopups] = useState({});
  const [newPopup, setNewPopup] = useState({ message: '', link: '' });
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [status, setStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingPopup, setEditingPopup] = useState({ message: '', link: '' });

  // الاستماع للتغييرات في الإعلانات و حالة النظام
  useEffect(() => {
    const popupsRef = ref(database, 'popups');
    const systemRef = ref(database, 'popupSystem/isActive');
    
    // Listen for changes in the list of popups
    const unsubscribePopups = onValue(popupsRef, (snapshot) => {
      const data = snapshot.val();
      setPopups(data || {});
    });

    // Listen for changes in the overall system status
    const unsubscribeSystem = onValue(systemRef, (snapshot) => {
      setIsSystemActive(snapshot.val() || false);
    });

    // Cleanup function
    return () => {
      unsubscribePopups();
      unsubscribeSystem();
    };
  }, []);

  const handleAddPopup = async (e) => {
    e.preventDefault();
    if (!newPopup.message) {
      setStatus('الرجاء كتابة رسالة للإعلان.');
      return;
    }
    try {
      await push(ref(database, 'popups'), newPopup);
      setNewPopup({ message: '', link: '' });
      setStatus('تم إضافة الإعلان بنجاح!');
    } catch (error) {
      console.error("خطأ في إضافة الإعلان: ", error);
      setStatus('حدث خطأ أثناء الإضافة.');
    }
  };

  const handleDeletePopup = async (id) => {
    try {
      await remove(ref(database, `popups/${id}`));
      setStatus('تم حذف الإعلان بنجاح!');
    } catch (error) {
      console.error("خطأ في حذف الإعلان: ", error);
      setStatus('حدث خطأ أثناء الحذف.');
    }
  };

  const handleEditPopup = (id) => {
    setEditingId(id);
    setEditingPopup(popups[id]);
  };

  const handleSaveEdit = async () => {
    try {
      await update(ref(database, `popups/${editingId}`), editingPopup);
      setEditingId(null);
      setStatus('تم تعديل الإعلان بنجاح!');
    } catch (error) {
      console.error("خطأ في تعديل الإعلان: ", error);
      setStatus('حدث خطأ أثناء التعديل.');
    }
  };

  const handleToggleSystemActive = async (value) => {
    try {
      await update(ref(database, 'popupSystem'), { isActive: value });
      setStatus(`تم ${value ? 'تفعيل' : 'إلغاء تفعيل'} نظام الإعلانات المنبثقة.`);
    } catch (error) {
      console.error("خطأ في تحديث حالة النظام: ", error);
      setStatus('حدث خطأ أثناء تحديث حالة النظام.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">إدارة الإعلانات المنبثقة</CardTitle>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              checked={isSystemActive}
              onCheckedChange={handleToggleSystemActive}
              id="system-toggle"
            />
            <Label htmlFor="system-toggle" className={cn(
              "font-medium",
              isSystemActive ? "text-green-600" : "text-red-600"
            )}>
              {isSystemActive ? 'مفعل' : 'معطل'}
            </Label>
          </div>
        </CardHeader>
        <CardContent>
          {status && (
            <p className={`mb-4 p-3 rounded-lg text-center ${status.includes('بنجاح') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status}
            </p>
          )}

          {/* Form لإضافة إعلان جديد */}
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">إضافة إعلان جديد</h3>
          <form onSubmit={handleAddPopup} className="space-y-4">
            <div>
              <Label htmlFor="new-message">رسالة الإعلان:</Label>
              <Textarea
                id="new-message"
                value={newPopup.message}
                onChange={(e) => setNewPopup({ ...newPopup, message: e.target.value })}
                required
                className="mt-1"
                placeholder="اكتب هنا محتوى الرسالة..."
              />
            </div>
            <div>
              <Label htmlFor="new-link">رابط الإعلان (اختياري):</Label>
              <Input
                id="new-link"
                type="url"
                value={newPopup.link}
                onChange={(e) => setNewPopup({ ...newPopup, link: e.target.value })}
                className="mt-1"
                placeholder="أدخل رابط URL هنا..."
              />
            </div>
            <Button type="submit" className="w-full">
              إضافة إعلان
            </Button>
          </form>

          {/* قائمة الإعلانات الحالية */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">الإعلانات الموجودة</h3>
            {Object.keys(popups).length === 0 ? (
              <p className="text-center text-gray-500">لا توجد إعلانات منبثقة حالياً.</p>
            ) : (
              <div className="space-y-4">
                {Object.keys(popups).map((id) => (
                  <Card key={id}>
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      {editingId === id ? (
                        <div className="flex-1 space-y-2 w-full">
                          <Textarea
                            value={editingPopup.message}
                            onChange={(e) => setEditingPopup({ ...editingPopup, message: e.target.value })}
                            className="text-md"
                          />
                          <Input
                            type="url"
                            value={editingPopup.link}
                            onChange={(e) => setEditingPopup({ ...editingPopup, link: e.target.value })}
                            className="text-md"
                            placeholder="رابط الإعلان"
                          />
                          <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                            <Button onClick={handleSaveEdit}>حفظ</Button>
                            <Button variant="outline" onClick={() => setEditingId(null)}>إلغاء</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{popups[id].message}</p>
                          {popups[id].link && (
                            <a href={popups[id].link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                              {popups[id].link}
                            </a>
                          )}
                        </div>
                      )}
                      {editingId !== id && (
                        <div className="flex-shrink-0 mt-4 sm:mt-0 flex space-x-2 rtl:space-x-reverse">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPopup(id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePopup(id)} className="text-red-500 hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopupManagement;
