import React, { useState, useEffect } from 'react';
import './App.css';
import './ChatRoom/ChatRoom.css';
import './Login/Login.css';
import ChatRoom from './ChatRoom/ChatRoom';
import Login from './Login/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StorageService from './services/StorageService';
import { User } from './models/User';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = StorageService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const onLogout = () => {
    StorageService.removeUser();
    setUser(null);
  };

  // callback для обработки отправки данных из Login
  const handleLoginSubmit = (name: string, room: string) => {
    const newUser = new User(name, room);
    StorageService.setUser(newUser);
    setUser(newUser);
  };

  return (
    <Router>
      <Routes>
        {/* Переход на страницу входа */}
        <Route path="/" element={<Login onSubmit={handleLoginSubmit} />} />

        {/* Переход на страницу чата, доступно только если пользователь есть */}
        <Route path="/chat" element={user ? <ChatRoom user={user} onLogout={onLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
