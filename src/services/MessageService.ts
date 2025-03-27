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

export const loadUsers = (room: string): string[] => {
    const savedUsers = localStorage.getItem(`${room}-users`);
    return savedUsers ? JSON.parse(savedUsers) : [];
};

export const saveUsers = (room: string, users: string[]) => {
    if (users.length === 0) {
        localStorage.removeItem(`${room}-users`);
    } else {
        localStorage.setItem(`${room}-users`, JSON.stringify(users));
    }
};
