import { AxiosError } from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import ShoppingCart from "../components/ShoppingCart/ShoppingCart";
import { CartItem } from "../model/cart-item";
import { ShoppingCartContextModel } from "../model/shopping-cart-context";
import {
  addToCart,
  decreaseFromCart,
  removeBookFromCart,
} from "../services/UserService";
import { useUser } from "./UserContext";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

const ShoppingCartContext = createContext({} as ShoppingCartContextModel);

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, updateUser } = useUser();

  useEffect(() => {
    if (!!user.id!) {
      setCartItems([...user.shoppingCart!]);
    }
  }, [user]);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const getItemQuantity = (bookId: number) => {
    return cartItems.find((item) => item.bookId === bookId)?.quantity || 0;
  };
  const increaseCartQuantity = (bookId: number) => {
    const userCopy = { ...user };
    if (
      user.shoppingCart!.find((item) => item.bookId === bookId) === undefined
    ) {
      user.shoppingCart = [
        ...user.shoppingCart!,
        { bookId: bookId, quantity: 1 },
      ];
    } else {
      user.shoppingCart = user.shoppingCart!.map((item) => {
        if (item.bookId === bookId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    }
    const quantity = user.shoppingCart!.find(
      (item) => item.bookId === bookId
    )!.quantity;
    addToCart(user.id!, bookId, quantity)
      .then((_) => {
        updateUser({ ...user });
      })
      .catch((err: AxiosError<string>) => {
        updateUser({ ...userCopy });
        toast.error(err.response?.data);
      });
  };
  const decreaseCartQuantity = (bookId: number) => {
    const userCopy = { ...user };
    if (
      user.shoppingCart!.find((item) => item.bookId === bookId)?.quantity === 1
    ) {
      user.shoppingCart = user.shoppingCart!.filter(
        (item) => item.bookId !== bookId
      );
    } else {
      user.shoppingCart = user.shoppingCart!.map((item) => {
        if (item.bookId === bookId) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          return item;
        }
      });
    }
    const shoppingCartItem = user.shoppingCart!.find(
      (item) => item.bookId === bookId
    );
    const quantity = shoppingCartItem ? shoppingCartItem.quantity : 0;
    decreaseFromCart(user.id!, bookId, quantity)
      .then((_) => {
        updateUser({ ...user });
      })
      .catch((err: AxiosError<string>) => {
        updateUser({ ...userCopy });
        toast.error(err.response?.data);
      });
  };
  const removeFromCart = (bookId: number) => {
    const userCopy = { ...user };
    user.shoppingCart = user.shoppingCart!.filter(
      (item) => item.bookId !== bookId
    );
    removeBookFromCart(user.id!, bookId)
      .then((_) => {
        updateUser({ ...user });
      })
      .catch((err: AxiosError<string>) => {
        updateUser({ ...userCopy });
        toast.error(err.response?.data);
      });
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
};
