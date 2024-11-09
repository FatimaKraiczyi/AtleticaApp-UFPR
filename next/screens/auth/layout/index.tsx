import React from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { ScrollView, StatusBar } from "react-native";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout(props: AuthLayoutProps) {
  return (
    <Box className="h-full web:h-[100vh] overflow-hidden w-full">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "center",
        }}
        className="flex-1 bg-violet-600
            dark:bg-background-0 md:bg-violet-900 md:dark:bg-background-100"
        bounces={false}
      >
        <VStack className="w-full flex-1 overflow-hidden md:max-w-[840px] md:flex-row md:rounded-xl md:flex-none">
          {props.children}
        </VStack>
      </ScrollView>
    </Box>
  );
}
