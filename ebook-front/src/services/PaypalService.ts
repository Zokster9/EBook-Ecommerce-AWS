import axios from "axios";
import { baseUrl } from "./AxiosConfiguration";

export const updateCoinStatus = (coins: number, userId: number) => {
  return axios.put<string>(`${baseUrl}api/paypal/update-coins/${userId}`, {
    coins,
  });
};
