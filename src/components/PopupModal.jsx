import React from 'react';
import { Button } from './ui/button'; // تأكد أن المسار صحيح

const PopupModal = ({ message, link, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full mx-4 text-center">
        <p className="text-2xl font-bold mb-4">{message}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="block mb-4">
            <Button className="w-full">
              انتقل إلى العرض
            </Button>
          </a>
        )}
        <Button onClick={onClose} variant="outline" className="w-full">
          إغلاق
        </Button>
      </div>
    </div>
  );
};

export default PopupModal;