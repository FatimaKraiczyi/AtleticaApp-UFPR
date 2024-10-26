import React from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import SignIn from "./auth/signin";

const index = () => {


  return (
    <SafeAreaView className="md:flex flex-col items-center justify-center md:w-full h-full">
      <SignIn />
    </SafeAreaView>
  );
};

export default index;
