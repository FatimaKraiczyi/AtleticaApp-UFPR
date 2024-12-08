import axios from "axios";
import { Platform } from "react-native";
import { toast } from "react-toastify";
import type { IResponse } from "../interfaces";
import { getToken } from "./token";

const API = axios.create();

API.interceptors.request.use(
  async (config) => {
    config.baseURL =
      Platform.OS === "web"
        ? "http://localhost:3001"
        : "http://192.168.15.6:3001";

    const token = await getToken();
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ** Interceptor de Resposta **
API.interceptors.response.use(
  (response) => {
    // Sucesso - Exibir mensagem se houver
    if (response.data?.msg) {
      toast.success(response.data.msg);
    }
    return response;
  },
  (error) => {
    // Erro - Exibir mensagem se houver
    const msg = error.response?.data?.msg || "Erro inesperado, tente novamente.";
    toast.error(msg);

    // Retorna erro para que chamadas específicas possam tratá-lo
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
