// src/components/PopupSystem.jsx
import React, { useState, useEffect } from 'react';
import { database } from '../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import PopupModal from './PopupModal';

const PopupSystem = () => {
  const [popups, setPopups] = useState([]);
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [randomPopup, setRandomPopup] = useState(null);

  useEffect(() => {
    // الاستماع لحالة نظام الإعلانات
    const systemRef = ref(database, 'popupSystem/isActive');
    const unsubscribeSystem = onValue(systemRef, (snapshot) => {
      setIsSystemActive(snapshot.val() || false);
    });

    // الاستماع لقائمة الإعلانات
    const popupsRef = ref(database, 'popups');
    const unsubscribePopups = onValue(popupsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedPopups = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setPopups(loadedPopups);
    });

    return () => {
      unsubscribeSystem();
      unsubscribePopups();
    };
  }, []);

  useEffect(() => {
    if (isSystemActive && popups.length > 0) {
      // اختيار إعلان عشوائي
      const randomIndex = Math.floor(Math.random() * popups.length);
      setRandomPopup(popups[randomIndex]);
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [isSystemActive, popups]);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && randomPopup && (
        <PopupModal
          message={randomPopup.message}
          link={randomPopup.link}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default PopupSystem;
