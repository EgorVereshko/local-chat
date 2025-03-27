import React, { useState, useEffect } from 'react';
import './App.css';
import './ChatRoom/ChatRoom.css';
import './Login/Login.css';
import ChatRoom from './ChatRoom/ChatRoom';
import Login from './Login/Login';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import StorageService from './services/StorageService';
import { UserService } from './services/UserService';
import { User } from './models/User';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Проверяем наличие пользователя при обновлении страницы
  useEffect(() => {
    const storedUser = StorageService.getUser();
    if (storedUser) {
      setUser(storedUser);
      navigate('/chat');
    } else {
      navigate('/');
    }
  }, []);

  const onLogout = () => {
    StorageService.removeUser();
    setUser(null);
  };

  // callback для обработки отправки данных из Login
  const handleLoginSubmit = (name: string, room: string) => {
    const newUser = UserService.createUser(name, room);
    StorageService.setUser(newUser);
    setUser(newUser);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onSubmit={handleLoginSubmit} />} />
      <Route path="/chat" element={user ? <ChatRoom user={user} onLogout={onLogout} /> : <Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
