import { UserDTO } from "./user-dto";

export interface UserContextModel {
  getUser: () => Partial<UserDTO>;
  loginUser: (user: UserDTO) => void;
  logoutUser: () => void;
}
