import bcrypt from "bcrypt";

export class UserCreation {
  email: string;
  password: string | undefined;
  username: string;
  coins: number;
  avatar?: string;
  firstName: string;
  lastName: string;

  constructor(
    email: string,
    username: string,
    coins: number,
    firstName: string,
    lastName: string,
    avatar?: string
  ) {
    this.email = email;
    this.username = username;
    this.coins = coins;
    this.avatar = avatar;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  async setPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
