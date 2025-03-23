export interface Message {
  user: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export const loadMessages = (room: string): Message[] => {
  const savedMessages = localStorage.getItem(room);
  return savedMessages ? JSON.parse(savedMessages) : [];
};

export const saveMessages = (room: string, messages: Message[]) => {
  localStorage.setItem(room, JSON.stringify(messages));
};
