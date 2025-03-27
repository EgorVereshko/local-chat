import { User } from '../models/User';

class StorageService {
  // Устанавливаем пользователя в sessionStorage
  static setUser(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  // Получаем пользователя из sessionStorage
  static getUser(): User | null {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  }

  // Удаляем пользователя из sessionStorage
  static removeUser() {
    sessionStorage.removeItem('user');
  }
}

export default StorageService;
