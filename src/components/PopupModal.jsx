import React from 'react';
import { Button } from './ui/button';

const PopupModal = ({ message, link, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      <div className="relative bg-gray-800 text-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto transition-transform duration-300 animate-slide-in-up border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="إغلاق النافذة"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
         <p className="text-2xl sm:text-3xl font-extrabold mb-4 text-white leading-tight">
  {message}
</p>

          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block my-6">
              <Button className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95 rounded-xl shadow-lg">
                انتقل إلى العرض
              </Button>
            </a>
          )}
          <Button onClick={onClose} variant="outline" className="w-full h-12 text-lg font-semibold bg-transparent text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white transition-colors rounded-xl mt-2">
            إغلاق
          </Button>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
          .animate-slide-in-up {
            animation: slideInUp 0.4s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default PopupModal;
