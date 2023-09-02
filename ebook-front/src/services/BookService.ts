import axios, { AxiosResponse } from "axios";
import { BookDTO } from "../model/book-dto";
import { BooksDTO } from "../model/books-dto";
import { baseUrl } from "./AxiosConfiguration";

export const getBooks = ({
  pageNumber,
  pageLength,
}: {
  pageNumber: number;
  pageLength: number;
}) => {
  return axios.get<BooksDTO>(baseUrl + "api/books/", {
    params: {
      pageNum: pageNumber,
      limit: pageLength,
    },
  });
};

export const getBookById = (
  bookId: number
): Promise<AxiosResponse<BookDTO, any>> => {
  return axios.get<BookDTO>(`${baseUrl}api/books/${bookId}`);
};
