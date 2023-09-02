import { createContext, ReactNode, useContext, useState } from "react";
import ShoppingCart from "../components/ShoppingCart/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CartItem } from "../model/cart-item";
import { ShoppingCartContextModel } from "../model/shopping-cart-context";

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
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );

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
    setCartItems((currItems) => {
      if (currItems.find((item) => item.bookId === bookId) == null) {
        return [...currItems, { bookId: bookId, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.bookId === bookId) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };
  const decreaseCartQuantity = (bookId: number) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.bookId === bookId)?.quantity === 1) {
        return currItems.filter((item) => item.bookId !== bookId);
      } else {
        return currItems.map((item) => {
          if (item.bookId === bookId) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };
  const removeFromCart = (bookId: number) => {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.bookId !== bookId);
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
