export interface UserCreationDTO {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}
