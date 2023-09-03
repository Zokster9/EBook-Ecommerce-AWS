import { ReactNode, createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { UserContextModel } from "../model/user-context";
import { UserDTO } from "../model/user-dto";

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext({} as UserContextModel);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useLocalStorage<Partial<UserDTO>>("user", {});

  const loginUser = (newUser: UserDTO): void => {
    setUser(newUser);
  };

  const logoutUser = (): void => {
    setUser({});
  };

  const updateUser = (updatedUser: Partial<UserDTO>): void => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
