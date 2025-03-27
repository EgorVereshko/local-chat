import { User } from '../models/User';

export class UserService {
  static createUser(name: string, room: string): User {
    if (!name || !room) {
      throw new Error("Имя и комната обязательны для пользователя");
    }
    return { name, room };
  }
}
