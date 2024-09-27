import axios from "axios";
import { IResponse } from "../interfaces";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const objectCatch: IResponse.Default<undefined> = {
  data: undefined,
  success: false,
  message: 'Falha na requisição, tente novamente.'
}

const arrayCatch: IResponse.Default<[]> = {
  data: [],
  success: false,
  message: 'Falha na requisição, tente novamente.'
}

export { API, objectCatch, arrayCatch }