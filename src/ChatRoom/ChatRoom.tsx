import React, { useState, useEffect, useRef } from 'react';
import { Message, loadMessages, saveMessages, loadUsers, saveUsers } from '../services/MessageService';

interface Props {
  user: { name: string; room: string };
  onLogout: () => void;
}

const ChatRoom: React.FC<Props> = ({ user, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [quotedMessage, setQuotedMessage] = useState<Message | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const emojiList = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😎', '😍', '😋', '😜', '😝', '😅', '😇', '🤩',
    '😍', '🥰', '😘', '😙', '🤨', '🧐', '🤓', '😢', '😖', '😫', '😩', '🥺', '😱', '😨', '😥', '😓', '🤗', '🤯',
    '😳', '🙄', '😡', '🥵', '😈', '🥶', '😬', '😑', '🤢', '🤮', '🤑', '😴', '💀', '🤡', '💩', '😸', '☠️', '👾',
  ];

  // Загружаем сообщения и пользователей из localStorage при первом рендере
  useEffect(() => {
    const savedMessages = loadMessages(user.room);
    setMessages(savedMessages);

    // Загружаем пользователей из localStorage
    const storedUsers = loadUsers(user.room);
    setUsersInRoom(storedUsers);

    // Добавляем текущего пользователя в список, если его нет в списке
    if (!storedUsers.includes(user.name)) {
      const updatedUsers = [...storedUsers, user.name];
      saveUsers(user.room, updatedUsers);
      setUsersInRoom(updatedUsers);
    }

    // Очистка при размонтировании (выход из чата)
    return () => {
      const updatedUsers = storedUsers.filter((username: string) => username !== user.name);
      saveUsers(user.room, updatedUsers);
    };
  }, [user.room]);

  // Слушаем изменения в localStorage в других вкладках
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === user.room) {
        const updatedMessages = JSON.parse(e.newValue || '[]');
        setMessages(updatedMessages);
      } else if (e.key === `${user.room}-users`) {
        const updatedUsers = JSON.parse(e.newValue || '[]');
        setUsersInRoom(updatedUsers);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user.room]);

  // Обработчик для отправки сообщений
  const sendMessage = (newMsg: Message) => {
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    saveMessages(user.room, updatedMessages); // Сохраняем сообщения в localStorage
  };

  // Прокручиваем чат вниз, чтобы показывать последние сообщения
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !image) return;

    const newMsg: Message = {
      user: user.name,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Если изображение загружено, добавляем его в сообщение
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMsgWithImage: Message = {
          ...newMsg,
          imageUrl: reader.result as string,
        };
        sendMessage(newMsgWithImage);
        setImage(null); // Сброс выбранного изображения, после отправки
      };
      reader.readAsDataURL(image);
    } else {
      sendMessage(newMsg);
    }

    setNewMessage('');
    setQuotedMessage(null); // Сбрасываем цитированное сообщение после отправки
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false); // Закрываем панель эмодзи после выбора
  };

  const handleQuoteMessage = (msg: Message) => {
    setQuotedMessage(msg);
    setNewMessage(`"${msg.content || 'img'}" — ${msg.user}: `); // Вставляем цитату в поле ввода
  };

  // Обработчик выбора изображения
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const imageBtnStyle = image ? { backgroundColor: 'yellow', borderRadius: '50%' } : {};

  return (
    <div className="chatBox">
      <div className="chatHeader">
        <h2>Комната: {user.room}</h2>
        <div className="closeChat" onClick={onLogout}></div>
      </div>

      <div className="horizontal-line"></div>

      <div className="chatContainer">
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            <strong>{msg.user}</strong> <p className="messageTime">[{msg.timestamp}]:</p>
            <p className="messageContent">{msg.content}</p>
            {msg.imageUrl && <img src={msg.imageUrl} alt="sent" className="messageImage" />}
            <button className="quoteBtn" onClick={() => handleQuoteMessage(msg)}></button>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="horizontal-line"></div>

      <div className="inputPanel">
        <button className="emojiBtn" onClick={() => setShowEmojiPicker((prev) => !prev)}></button>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="imageInput"
        />
        <label htmlFor="imageInput" className="imageBtn" style={imageBtnStyle}></label>

        <input
          className="chatInput"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button className="enterBtn" onClick={handleSendMessage}></button>
      </div>

      {showEmojiPicker && (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          {emojiList.map((emoji, index) => (
            <button
              className="emojiList"
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              style={{ fontSize: '20px', margin: '5px' }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
