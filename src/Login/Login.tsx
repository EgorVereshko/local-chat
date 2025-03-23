import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  setUser: React.Dispatch<React.SetStateAction<{ name: string; room: string } | null>>;
}

const Login: React.FC<Props> = ({ setUser }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка, что поля не пустые и не состоят только из пробелов
    if (!name.trim() || !room.trim()) {
      setError('Имя и название комнаты не могут быть пустыми или состоять только из пробелов');
      return;
    }

    setError(''); // Сброс ошибки при успешной валидации
    const user = { name, room };
    localStorage.setItem('user', JSON.stringify(user)); // Сохраняем данные пользователя в localStorage
    setUser(user);

    // Перенаправляем пользователя на страницу чата
    navigate('/chat');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Проверка ошибки при изменении имени
    if (!e.target.value.trim() || !room.trim()) {
      setError('Имя и название комнаты не могут быть пустыми или состоять только из пробелов');
    } else {
      setError('');
    }
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
    // Проверка ошибки при изменении комнаты
    if (!name.trim() || !e.target.value.trim()) {
      setError('Имя и название комнаты не могут быть пустыми или состоять только из пробелов');
    } else {
      setError('');
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
          onChange={handleNameChange}
        />
        <input
          type="text"
          placeholder="Название комнаты"
          value={room}
          onChange={handleRoomChange}
        />
        <button type="submit" disabled={!name.trim() || !room.trim()}>Войти в чат</button>
      </form>
      {error && <p className='loginError'>{error}</p>} {/* Сообщение об ошибке */}
    </div>
  );
};

export default Login;
