import React, { useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "react-native";
import SignIn from "./auth/signin";

const index = () => {
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await sessionStorage.getItem("x-access-token");
      
      if (token) {
        // Se o token estiver presente, redireciona para o dashboard
        router.replace("dashboard/dashboard-layout");
      } else {
        // Caso contrário, redireciona para a tela de login
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
