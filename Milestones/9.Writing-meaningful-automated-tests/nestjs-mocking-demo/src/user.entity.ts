export class User {
  id: number;
  username: string;
  passwordHash: string;

  constructor(id: number, username: string, passwordHash: string) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
  }
}
