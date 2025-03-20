import React, { useState, useEffect } from 'react';
import './App.css';
import ChatRoom from './ChatRoom';
import Login from './Login';

const App: React.FC = () => {
  const [user, setUser] = useState<{name: string; room: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (user) {
    return <ChatRoom user={user} logout={logout} />;
  }

  return <Login setUser={setUser} />;
};

export default App;
