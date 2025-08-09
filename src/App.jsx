import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import LearningPath from './components/LearningPath';
import Profile from './components/Profile';
import SponsorPage from './components/SponsorPage';
import AdminPanel from './components/AdminPanel'; // استيراد لوحة التحكم

import userManager from './utils/userManager';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await userManager.getCurrentUser();
      if (user) setCurrentUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogin = async (email, password) => {
    const result = await userManager.login(email, password);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const handleRegister = async (userData) => {
    const result = await userManager.register(userData);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const handleUpdateProgress = async (sectionKey, completed, score) => {
    const result = await userManager.updateUserProgress(sectionKey, completed, score);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const handleLogout = () => {
    userManager.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />
        <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
         <Route path="/admin-waheebasadprint" element={<AdminPanel />} /> {/* المسار المخفي */}
         <Route
  path="/login"
  element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
/>
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/dashboard" /> : <RegisterPage onRegister={handleRegister} />}
          />
          <Route
            path="/dashboard"
            element={currentUser ? <Dashboard user={currentUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/learning-path"
            element={
              currentUser ? (
                <LearningPath user={currentUser} onUpdateProgress={handleUpdateProgress} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            element={currentUser ? <Profile user={currentUser} /> : <Navigate to="/login" />}
          />
          <Route path="/sponsor" element={<SponsorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
