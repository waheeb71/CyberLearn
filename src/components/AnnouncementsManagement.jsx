// src/components/AnnouncementsManagement.jsx
import React, { useState, useEffect } from 'react';
import { database } from '../utils/firebaseConfig';
import { ref, push, onValue, remove } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  const [status, setStatus] = useState('');

  // الاستماع للتغييرات في الإعلانات من Firebase
  useEffect(() => {
    const announcementsRef = ref(database, 'announcements');
    const unsubscribe = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAnnouncements = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setAnnouncements(loadedAnnouncements);
    });

    return () => unsubscribe();
  }, []);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) {
      setStatus('الرجاء تعبئة جميع الحقول.');
      return;
    }
    try {
      await push(ref(database, 'announcements'), newAnnouncement);
      setNewAnnouncement({ title: '', message: '' });
      setStatus('تم إضافة الإعلان بنجاح!');
    } catch (error) {
      console.error("خطأ في إضافة الإعلان: ", error);
      setStatus('حدث خطأ أثناء الإضافة.');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await remove(ref(database, `announcements/${id}`));
      setStatus('تم حذف الإعلان بنجاح!');
    } catch (error) {
      console.error("خطأ في حذف الإعلان: ", error);
      setStatus('حدث خطأ أثناء الحذف.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Form لإضافة إعلان جديد */}
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">إضافة إعلان جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAnnouncement} className="space-y-4">
            <div>
              <Label htmlFor="title">العنوان:</Label>
              <Input
                id="title"
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">الرسالة:</Label>
              <Textarea
                id="message"
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              إضافة الإعلان
            </Button>
            {status && <p className="mt-4 text-center text-green-600">{status}</p>}
          </form>
        </CardContent>
      </Card>

      {/* قائمة الإعلانات الحالية */}
      <div>
        <h2 className="text-2xl font-bold mb-4">الإعلانات الحالية</h2>
        {announcements.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد إعلانات حالياً.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                    <p className="text-sm text-gray-600">{announcement.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsManagement;
