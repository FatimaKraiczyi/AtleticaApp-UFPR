import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const getToken = async () => {
    if (Platform.OS === "web") {
        return sessionStorage.getItem("x-access-token");
    }
    else {
        return await AsyncStorage.getItem("x-access-token");
    }
};
export const setToken = async (token) => {
    if (Platform.OS === "web") {
        sessionStorage.setItem("x-access-token", token);
    }
    else {
        await AsyncStorage.setItem("x-access-token", token);
    }
};
