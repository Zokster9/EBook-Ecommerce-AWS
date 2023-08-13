export interface UserDB {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_password: string;
  role_id: number;
  avatar?: string;
  user_name: string;
  coins: number;
}
