export class User {
    name: string;
    room: string;
  
    constructor(name: string, room: string) {
      if (!name || !room) throw new Error("Имя и комната обязательны для пользователя");
      this.name = name;
      this.room = room;
    }
  
    toJSON() {
      return {
        name: this.name,
        room: this.room,
      };
    }
  
    static fromJSON(data: any): User {
      const user = new User(data.name, data.room);
      return user;
    }
}
  