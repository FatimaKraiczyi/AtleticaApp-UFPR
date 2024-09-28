import axios from "axios";
import type { IResponse } from "../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';

const API = axios.create();

API.interceptors.request.use(
  async (config) => {
    config.baseURL = Platform.OS === 'web' ? "http://localhost:3001" : `http://'192.168.15.6':3001`;

    let token: string | null = null;

    if (Platform.OS === 'web') {
      token = sessionStorage.getItem('authToken');
    } else {
      token = await AsyncStorage.getItem("x-access-token");
    }

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

export { API, objectCatch, arrayCatch };