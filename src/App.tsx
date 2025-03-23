import React, { useState, useEffect } from 'react';
import './App.css';
import './ChatRoom/ChatRoom.css'
import './Login/Login.css'
import ChatRoom from './ChatRoom/ChatRoom';
import Login from './Login/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; room: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Переход на страницу входа */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Переход на страницу чата, доступно только если пользователь есть */}
        <Route path="/chat" element={user ? <ChatRoom user={user} onLogout={onLogout} /> : <Navigate to="/" />} />

        {/* Переход на страницу чата, если пользователь авторизован */}
        <Route path="/" element={user ? <ChatRoom user={user} onLogout={onLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
