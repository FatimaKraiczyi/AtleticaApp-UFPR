import type { IResponse } from "../interfaces"; // Use 'import type'
import type { UserProps } from "../interfaces/users"; // Use 'import type'
import { API, objectCatch } from './api';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage
import { Platform } from 'react-native'; // Adicione isso

export const userAuthentication = async (
  email: string,
  senha: string
): Promise<IResponse.Default<UserProps>> => {
  try {
    console.log('Iniciando autenticação'); // Log de início
    const { data, status } = await API.post('/usuario/authentication', { email, senha });
    console.log('Resposta da API:', data, status); // Log da resposta da API

    if (status === 200 && data && data.token) {
      if (Platform.OS === 'web') {
        // Estamos no navegador, use sessionStorage
        sessionStorage.setItem('authToken', data.token);
      } else {
        // Estamos em um ambiente nativo (Expo), use AsyncStorage
        await AsyncStorage.setItem("x-access-token", data.token);
      }
    }

    return { data, success: status === 200 };
        
  } catch (error) {
    console.error('Erro na chamada da API:', error); // Log de erro da API
    return { ...objectCatch };
  }
};