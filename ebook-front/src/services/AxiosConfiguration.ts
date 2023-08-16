import axios from "axios";

export const baseUrl: string = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL
  : "";
export const ROLE_KEY =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export const configureAxiosRequestInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
