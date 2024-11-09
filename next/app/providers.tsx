import React from "react";
import { GluestackUIProvider as NativewindUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "nativewind";

export function Providers({ children }: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <NativewindUIProvider mode={colorScheme}>{children}</NativewindUIProvider>
  );
}
