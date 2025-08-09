// User Management System using localStorage
// This handles user registration, login, and progress tracking

class UserManager {
  constructor() {
    this.storageKey = 'cyberlearn_users';
    this.currentUserKey = 'cyberlearn_current_user';
    this.init();
  }

  init() {
    // Initialize storage if it doesn't exist
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({}));
    }
    
    // Add demo user if no users exist
    const users = this.getAllUsers();
    if (Object.keys(users).length === 0) {
      this.createDemoUser();
    }
  }

  createDemoUser() {
    const demoUser = {
      id: 'demo_user',
      name: 'مستخدم تجريبي',
      email: 'demo@example.com',
      password: 'demo123', // In real app, this would be hashed
      registrationDate: new Date().toISOString(),
      level: 1,
      totalPoints: 0,
      progress: {
        basics: { completed: false, score: 0, completedAt: null },
        fundamentals: { completed: false, score: 0, completedAt: null },
        specialization: { completed: false, score: 0, completedAt: null },
        practicalExperience: { completed: false, score: 0, completedAt: null },
        continuousLearning: { completed: false, score: 0, completedAt: null },
        youtubeChannels: { completed: false, score: 0, completedAt: null },
        jobRoles: { completed: false, score: 0, completedAt: null },
        certifications: { completed: false, score: 0, completedAt: null },
        roadmap: { completed: false, score: 0, completedAt: null },
        additionalResources: { completed: false, score: 0, completedAt: null }
      }
    };
    
    const users = this.getAllUsers();
    users[demoUser.email] = demoUser;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    } catch (error) {
      console.error('Error parsing users data:', error);
      return {};
    }
  }

  saveUsers(users) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  register(userData) {
    const { name, email, password } = userData;
    
    // Validate input
    if (!name || !email || !password) {
      return { success: false, message: 'جميع الحقول مطلوبة' };
    }

    if (password.length < 6) {
      return { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }

    const users = this.getAllUsers();
    
    // Check if user already exists
    if (users[email]) {
      return { success: false, message: 'المستخدم موجود بالفعل' };
    }

    // Create new user
    const newUser = {
      id: this.generateUserId(),
      name,
      email,
      password, // In real app, this would be hashed
      registrationDate: new Date().toISOString(),
      level: 1,
      totalPoints: 0,
      progress: {
        basics: { completed: false, score: 0, completedAt: null },
        fundamentals: { completed: false, score: 0, completedAt: null },
        specialization: { completed: false, score: 0, completedAt: null },
        practicalExperience: { completed: false, score: 0, completedAt: null },
        continuousLearning: { completed: false, score: 0, completedAt: null },
        youtubeChannels: { completed: false, score: 0, completedAt: null },
        jobRoles: { completed: false, score: 0, completedAt: null },
        certifications: { completed: false, score: 0, completedAt: null },
        roadmap: { completed: false, score: 0, completedAt: null },
        additionalResources: { completed: false, score: 0, completedAt: null }
      }
    };

    users[email] = newUser;
    this.saveUsers(users);
    
    // Auto login after registration
    this.setCurrentUser(newUser);
    
    return { success: true, user: newUser };
  }

  login(email, password) {
    const users = this.getAllUsers();
    const user = users[email];
    
    if (!user) {
      return { success: false, message: ' المستخدم غير موجود' };
    }

    if (user.password !== password) {
      return { success: false, message: 'كلمة المرور غير صحيحة' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
    return { success: true };
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.currentUserKey);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      
      // Get fresh user data from storage to ensure it's up to date
      const users = this.getAllUsers();
      const freshUser = users[user.email];
      
      if (freshUser) {
        this.setCurrentUser(freshUser);
        return freshUser;
      }
      
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  setCurrentUser(user) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  updateUserProgress(sectionKey, completed, score) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    const users = this.getAllUsers();
    const user = users[currentUser.email];
    
    if (!user) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    // Update progress
    user.progress[sectionKey] = {
      completed,
      score: completed ? score : 0,
      completedAt: completed ? new Date().toISOString() : null
    };

    // Recalculate total points and level
    user.totalPoints = Object.values(user.progress)
      .filter(p => p.completed)
      .reduce((total, p) => total + p.score, 0);
    
    // Calculate level (every 50 points = 1 level)
    user.level = Math.floor(user.totalPoints / 50) + 1;

    // Save updated user data
    users[currentUser.email] = user;
    this.saveUsers(users);
    this.setCurrentUser(user);

    return { success: true, user };
  }

  exportUserData() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    
    return {
      exportDate: new Date().toISOString(),
      userData: currentUser
    };
  }

  importUserData(data) {
    try {
      if (!data.userData) {
        return { success: false, message: 'بيانات غير صالحة' };
      }

      const users = this.getAllUsers();
      users[data.userData.email] = data.userData;
      this.saveUsers(users);
      this.setCurrentUser(data.userData);

      return { success: true, user: data.userData };
    } catch (error) {
      return { success: false, message: 'خطأ في استيراد البيانات' };
    }
  }

  resetUserProgress() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    const users = this.getAllUsers();
    const user = users[currentUser.email];
    
    if (!user) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    // Reset all progress
    Object.keys(user.progress).forEach(key => {
      user.progress[key] = { completed: false, score: 0, completedAt: null };
    });

    user.totalPoints = 0;
    user.level = 1;

    users[currentUser.email] = user;
    this.saveUsers(users);
    this.setCurrentUser(user);

    return { success: true, user };
  }

  deleteAccount() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'المستخدم غير مسجل الدخول' };
    }

    const users = this.getAllUsers();
    delete users[currentUser.email];
    this.saveUsers(users);
    this.logout();

    return { success: true };
  }

  getUserStats() {
    const users = this.getAllUsers();
    const totalUsers = Object.keys(users).length;
    
    let totalCompletions = 0;
    let totalPoints = 0;
    
    Object.values(users).forEach(user => {
      totalPoints += user.totalPoints;
      totalCompletions += Object.values(user.progress).filter(p => p.completed).length;
    });

    return {
      totalUsers,
      totalCompletions,
      totalPoints,
      averageProgress: totalUsers > 0 ? (totalCompletions / (totalUsers * 10)) * 100 : 0
    };
  }
}

// Create singleton instance
const userManager = new UserManager();

export default userManager;

