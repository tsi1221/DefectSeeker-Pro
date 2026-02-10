
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Defect, Project, Notification, UserRole } from './types';
import { INITIAL_DEFECTS, MOCK_USERS, MOCK_PROJECTS, INITIAL_NOTIFICATIONS } from './constants';
import Dashboard from './components/Dashboard';
import DefectList from './components/DefectList';
import DefectForm from './components/DefectForm';
import DefectDetail from './components/DefectDetail';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProjectList from './components/ProjectList';
import Reports from './components/Reports';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ds_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [defects, setDefects] = useState<Defect[]>(() => {
    const stored = localStorage.getItem('ds_defects');
    return stored ? JSON.parse(stored) : INITIAL_DEFECTS;
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('ds_all_users');
    return stored ? JSON.parse(stored) : MOCK_USERS;
  });

  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    localStorage.setItem('ds_defects', JSON.stringify(defects));
  }, [defects]);

  useEffect(() => {
    localStorage.setItem('ds_all_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ds_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ds_user');
    }
  }, [currentUser]);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const handleRegister = (newUser: User) => {
    setRegisteredUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const addDefect = (defect: Defect) => {
    setDefects(prev => [defect, ...prev]);
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      type: 'Alert',
      title: 'New Defect Logged',
      message: `[${defect.id}] ${defect.title}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateDefect = (updated: Defect) => {
    setDefects(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const deleteDefect = (id: string) => {
    setDefects(prev => prev.filter(d => d.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route 
          path="/login" 
          element={
            currentUser ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} users={registeredUsers} />
          } 
        />
        <Route 
          path="/register" 
          element={
            currentUser ? <Navigate to="/" /> : <RegisterPage onRegister={handleRegister} />
          } 
        />

        {/* Private Application Routes */}
        <Route
          path="/*"
          element={
            currentUser ? (
              <div className="flex min-h-screen bg-slate-50">
                <Sidebar role={currentUser.role} />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <Navbar 
                    user={currentUser} 
                    notifications={notifications} 
                    onLogout={handleLogout} 
                    onMarkRead={markNotificationRead}
                  />
                  <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Routes>
                      <Route path="/" element={<Dashboard defects={defects} />} />
                      <Route path="/defects" element={<DefectList defects={defects} users={registeredUsers} onDelete={deleteDefect} />} />
                      <Route path="/defects/new" element={<DefectForm onSubmit={addDefect} currentUser={currentUser} users={registeredUsers} />} />
                      <Route path="/defects/:id" element={<DefectDetail defects={defects} users={registeredUsers} currentUser={currentUser} onUpdate={updateDefect} />} />
                      <Route path="/projects" element={<ProjectList projects={projects} />} />
                      <Route path="/reports" element={<Reports defects={defects} projects={projects} />} />
                      <Route path="/profile" element={<Profile user={currentUser} onUpdate={(u) => setCurrentUser(u)} />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
