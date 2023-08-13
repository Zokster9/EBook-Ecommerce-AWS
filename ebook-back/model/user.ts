export class User {
  id: number;
  email: string;
  password: string;
  username: string;
  coins: number;
  avatar?: string;
  name: { firstName: string; lastName: string };
  role: string;

  constructor(
    id: number,
    email: string,
    password: string,
    username: string,
    coins: number,
    firstName: string,
    lastName: string,
    role: string,
    avatar?: string
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.username = username;
    this.coins = coins;
    this.avatar = avatar;
    this.name = { firstName, lastName };
    this.role = role;
  }

  get firstName(): string {
    return this.name.firstName;
  }

  get lastName(): string {
    return this.name.lastName;
  }

  get fullName(): string {
    return `${this.name.firstName} ${this.name.lastName}`;
  }
}
