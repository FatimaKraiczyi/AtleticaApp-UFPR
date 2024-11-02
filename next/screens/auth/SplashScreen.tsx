import React from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Center } from "@/components/ui/center";
import Link from "@unitools/link";
import useRouter from "@unitools/router";
import AuthLayout from "./layout";

function ActionButtons() {
  const router = useRouter();

  return (
    <VStack className="space-xs mt-10 md:mt-12">
      <Button
        size="md"
        variant="solid"
        action="primary"
        isDisabled={false}
        isFocusVisible={false}
        className="hover:bg-background-100 hover:text-primary-500 bg-background-0 dark:bg-background-950"
        onPress={() => {
          router.push("/auth/signin");
        }}
      >
        <ButtonText className="font-bold decoration-0 text-primary-500 dark:text-background-100">
          LOGIN
        </ButtonText>
      </Button>
      <Button
        className="hover:bg-background-0 hover:text-primary-500 border-primary-0 my-4"
        size="md"
        variant="outline"
        action="primary"
        isDisabled={false}
        isFocusVisible={false}
        onPress={() => {
          router.push("/auth/signup");
        }}
      >
        <ButtonText className="decoration-0 text-typography-100 dark:text-typography-900">
          SIGN UP
        </ButtonText>
      </Button>
    </VStack>
  );
}

function HeaderLogo() {
  return (
    <Box className="items-center justify-center">
      <Image
        alt="gluestack-ui Pro"
        source={require("../../assets/auth/logo.png")}
        className="md:hidden flex sm:h-[40px] sm:w-[320px] md:h-[141px] md:w-[275px]"
        height={141}
        width={275}
      />
      <Image
        alt="gluestack-ui Pro"
        className="hidden md:flex sm:h-[40px] sm:w-[320px] md:h-[141px] md:w-[275px]"
        source={require("../../assets/auth/logo.png")}
        height={141}
        width={275}
      />
    </Box>
  );
}

export const SplashScreen = () => {
  return (
    <AuthLayout>
      <Center className="flex-1 w-full">
        <Box className="w-full min-h-[$authcard] md:px-8  px-4 justify-center py-2">
          <HeaderLogo />
          <ActionButtons />
        </Box>
      </Center>
    </AuthLayout>
  );
};
