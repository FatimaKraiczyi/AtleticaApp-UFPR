import axios from "axios";
import type { IResponse } from "../interfaces";
import { getToken } from "./token";
import { Platform } from "react-native";

const API = axios.create();

API.interceptors.request.use(
  async (config) => {
    config.baseURL =
      Platform.OS === "web"
        ? "http://localhost:3001"
        : `http://192.168.15.6:3001`;

				const token = await getToken();

    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
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
