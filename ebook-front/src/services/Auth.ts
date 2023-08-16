import axios, { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode";
import { UserCreationDTO } from "../model/user-creation-dto";
import { UserDTO } from "../model/user-dto";
import { baseUrl } from "./AxiosConfiguration";

export const login = async (
  email: string,
  password: string
): Promise<UserDTO> => {
  const credentials = {
    email,
    password,
  };
  return axios
    .post<{ token: string }>(baseUrl + "api/auth/login", credentials)
    .then((token) => {
      localStorage.setItem("token", token.data.token);
      const user = jwtDecode<UserDTO>(token.data.token);
      return user;
    })
    .catch((err) => {
      return new Promise((_, reject) => {
        reject(err);
      });
    });
};

export const register = async (
  userCreationDTO: UserCreationDTO
): Promise<AxiosResponse<string>> => {
  return axios.post<string>(baseUrl + "api/auth/register", userCreationDTO);
};
