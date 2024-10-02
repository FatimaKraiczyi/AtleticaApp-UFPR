import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return sessionStorage.getItem("x-access-token");
  } else {
    return await AsyncStorage.getItem("x-access-token");
  }
};

export const setToken = async (token: string): Promise<void> => {
  if (Platform.OS === "web") {
    sessionStorage.setItem("x-access-token", token);
  } else {
    await AsyncStorage.setItem("x-access-token", token);
  }
};
