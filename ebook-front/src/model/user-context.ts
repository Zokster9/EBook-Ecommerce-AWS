import { UserDTO } from "./user-dto";

export interface UserContextModel {
  user: Partial<UserDTO>;
  loginUser: (user: UserDTO) => void;
  logoutUser: () => void;
  updateUser: (user: Partial<UserDTO>) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  removeItemFromWishlist: (bookId: number) => void;
}
