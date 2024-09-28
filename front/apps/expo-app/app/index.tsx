import React, { useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import SignIn from "./auth/signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem("x-access-token"); 

      if (token) {
        router.replace("dashboard/dashboard-layout");
      } else {
        router.replace("auth/signin");
      }
    };

    checkAuthentication();
  }, []);

  return (
    <SafeAreaView className="md:flex flex-col items-center justify-center md:w-full h-full">
      <SignIn/>
    </SafeAreaView>
  );
};

export default index;
