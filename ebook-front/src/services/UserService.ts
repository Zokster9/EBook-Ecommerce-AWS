import axios from "axios";
import { RentedBookDTO } from "../model/rentedBook-dto";
import { baseUrl } from "./AxiosConfiguration";

export const rentBook = (userId: number, rentedBookDTO: RentedBookDTO) => {
  return axios.post<string>(
    `${baseUrl}api/users/${userId}/rent-book`,
    rentedBookDTO
  );
};

export const returnBook = (userId: number, rentedBookDTO: RentedBookDTO) => {
  return axios.put<string>(
    `${baseUrl}api/users/${userId}/return-book`,
    rentedBookDTO
  );
};

export const addToWishlist = (userId: number, bookId: number) => {
  return axios.post(`${baseUrl}api/users/${userId}/wishlist/${bookId}`);
};

export const removeFromWishlist = (userId: number, bookId: number) => {
  return axios.delete(`${baseUrl}api/users/${userId}/wishlist/${bookId}`);
};

export const addToCart = (userId: number, bookId: number, quantity: number) => {
  return axios.post(`${baseUrl}api/users/${userId}/add-to-cart`, {
    bookId,
    quantity,
  });
};

export const decreaseFromCart = (
  userId: number,
  bookId: number,
  quantity: number
) => {
  return axios.post(`${baseUrl}api/users/${userId}/decrease-from-cart`, {
    bookId,
    quantity,
  });
};

export const removeBookFromCart = (userId: number, bookId: number) => {
  return axios.delete(
    `${baseUrl}api/users/${userId}/remove-from-cart/${bookId}`
  );
};

export const buyItems = (
  userId: number,
  friendEmail: string,
  totalPrice: number
) => {
  return axios.post<string>(`${baseUrl}api/users/${userId}/buy`, {
    friendEmail,
    totalPrice,
  });
};
