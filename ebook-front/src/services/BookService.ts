import axios from "axios";
import { BooksDTO } from "../model/books-dto";
import { baseUrl } from "./AxiosConfiguration";

export const getBooks = async ({
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
