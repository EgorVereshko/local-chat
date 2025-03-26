import { User } from '../models/User';

class StorageService {
  static setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user.toJSON()));
  }

  static getUser(): User | null {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    const userData = JSON.parse(storedUser);
    return User.fromJSON(userData); // Восстановление объекта User
  }

  static removeUser() {
    localStorage.removeItem('user');
  }
}

export default StorageService;
