import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onSubmit: (name: string, room: string) => void; // callback для отправки данных в App
}

const Login: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const validateInput = (input: string): boolean => {
    return input.trim().length > 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка, что поля не пустые и не состоят только из пробелов
    if (!validateInput(name) || !validateInput(room)) {
      setError('Имя и название комнаты не могут быть пустыми или состоять только из пробелов');
      return;
    }

    setError(''); // Сброс ошибки при успешной валидации

    // Вызываем onSubmit из родительского компонента для отправки данных
    onSubmit(name, room);
    navigate('/chat');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    setter(value);
    // Проверка ошибки при изменении имени и комнаты
    if (!validateInput(value)) {
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
          onChange={(e) => handleInputChange(e, setName)}
        />
        <input
          type="text"
          placeholder="Название комнаты"
          value={room}
          onChange={(e) => handleInputChange(e, setRoom)}
        />
        <button type="submit" disabled={!name.trim() || !room.trim()}>Войти в чат</button>
      </form>
      {error && <p className='loginError'>{error}</p>} {/* Сообщение об ошибке */}
    </div>
  );
};

export default Login;
