import { CartItem } from "./cart-item";

export interface ShoppingCartContextModel {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (bookId: number) => number;
  increaseCartQuantity: (bookId: number) => void;
  decreaseCartQuantity: (bookId: number) => void;
  removeFromCart: (bookId: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
}
