import axios from "axios";
import type { IResponse } from "../interfaces"; // Use 'import type'
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage
import { Platform } from 'react-native'; // Adicione isso
import * as Network from 'expo-network';

// Cria uma instância do Axios
const API = axios.create();

// Função assíncrona para obter o endereço IP
const getIpAddress = async (): Promise<string | null> => {
  const ipAddress = await Network.getIpAddressAsync();
  console.log('IP Address:', ipAddress); // Log do IP
  return ipAddress; // Retorna o IP ou null se não houver
};

// Interceptor de requisições
API.interceptors.request.use(
  async (config) => {
    // Obtem o IP dinâmico e define a baseURL
    const ipAddress = await getIpAddress();
    config.baseURL = Platform.OS === 'web' ? "http://localhost:3001" : `http://${'192.168.15.6'}:3001`;
    console.log('Base URL:', config.baseURL); // Log da baseURL

    // Configuração do token
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

// Configurações de captura de erros
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