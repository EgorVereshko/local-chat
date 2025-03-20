import React, { useState } from 'react';

interface Props {
  setUser: React.Dispatch<React.SetStateAction<{ name: string; room: string } | null>>;
}

const Login: React.FC<Props> = ({ setUser }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && room) {
      const user = { name, room };
      localStorage.setItem('user', JSON.stringify(user)); // Сохраняем данные пользователя в localStorage
      setUser(user);
    }
  };

  return (
    <div className='chatLogin'>
      <h2 className='chatHeader'>Вход в чат 💬</h2>
      <div className='horizontal-line'></div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Название комнаты"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
        <button type="submit">Войти в чат</button>
      </form>
    </div>
  );
};

export default Login;
