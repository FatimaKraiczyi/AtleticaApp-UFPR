import axios from "axios";
import { toast } from "react-toastify";
import type { IResponse } from "../interfaces";
import { getToken } from "./token";

const API = axios.create();

API.interceptors.request.use(
  async (config) => {
    config.baseURL = "http://localhost:3001";

    const token = await getToken();
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    if (response.data?.msg) {
      toast.success(response.data.msg);
    }
    return response;
  },
  (error) => {
    const msg =
      error.response?.data?.msg || "Erro inesperado, tente novamente.";
    toast.error(msg);

    return Promise.reject(error);
  }
);

const objectCatch: IResponse.Default<{}> = {
  data: {},
  success: false,
  message: "Falha na requisição, tente novamente.",
};

const arrayCatch: IResponse.Default<[]> = {
  data: [],
  success: false,
  message: "Falha na requisição, tente novamente.",
};

export { API, objectCatch, arrayCatch };
