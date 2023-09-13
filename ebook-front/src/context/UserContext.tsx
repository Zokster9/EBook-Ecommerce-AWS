import { AxiosError } from "axios";
import { ReactNode, createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import WishlistBar from "../components/WishlistBar/WishlistBar";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { UserContextModel } from "../model/user-context";
import { UserDTO } from "../model/user-dto";
import { removeFromWishlist } from "../services/UserService";

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext({} as UserContextModel);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useLocalStorage<Partial<UserDTO>>("user", {});
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  const loginUser = (newUser: UserDTO): void => {
    setUser(newUser);
  };

  const logoutUser = (): void => {
    setUser({});
  };

  const updateUser = (updatedUser: Partial<UserDTO>): void => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
  };

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const removeItemFromWishlist = (bookId: number) => {
    removeFromWishlist(user.id!, bookId)
      .then(() => {
        user.wishlistBooks = user.wishlistBooks?.filter(
          (wishListBook) => wishListBook.bookId !== bookId
        );
        updateUser(user);
        toast.success("Book successfully removed from wishlist");
      })
      .catch((err: AxiosError<string>) => {
        toast.error(err.response?.data);
      });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        updateUser,
        openWishlist,
        closeWishlist,
        removeItemFromWishlist,
      }}
    >
      {children}
      <WishlistBar isOpen={isWishlistOpen} />
    </UserContext.Provider>
  );
};
