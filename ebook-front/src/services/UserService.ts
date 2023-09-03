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
