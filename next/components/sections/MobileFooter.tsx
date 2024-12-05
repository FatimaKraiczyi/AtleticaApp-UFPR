import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import useRouter from "@unitools/router";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { Platform } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { House, UserRound, ShoppingCart, Search } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useCarrinho } from "@/hooks/CarrinhoContext";
import { Box } from "../ui/box";

type BottomTabs = {
  iconName: LucideIcon;
  iconText: string;
};

const bottomTabsList: BottomTabs[] = [
  {
    iconName: House,
    iconText: "Início",
  },
  {
    iconName: Search,
    iconText: "Atléticas",
  },
  {
    iconName: ShoppingCart,
    iconText: "Carrinho",
  },
  {
    iconName: UserRound,
    iconText: "Assinaturas",
  },
];

export const MobileFooter = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { items } = useCarrinho();
  const [userType, setUserType] = useState<string | null>(null);

	useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const userType = sessionStorage.getItem("userType");
      setUserType(userType);

      if (path.includes("dashboard")) {
        setSelectedIndex(0);
      } else if (path.includes("visualizar/atleticas")) {
        setSelectedIndex(1);
      } else if (path.includes("visualizar/carrinho")) {
        setSelectedIndex(2);
      } else if (path.includes("visualizar/assinatura")) {
        setSelectedIndex(3);
      }
    }
  }, []);

  const handlePress = (index: number) => {
    if (index === 0) {
      router.push("/dashboard/");
    } else if (index === 1) {
      router.push("/dashboard/visualizar/atleticas");
    } else if (index === 2) {
      router.push("/dashboard/visualizar/carrinho");
    } else if (index === 3) {
      router.push("/dashboard/visualizar/assinatura");
    }
  };

  return (
    <HStack
      className={cn(
        "bg-background-0 justify-between w-full absolute left-0 bottom-0 right-0 p-3 overflow-hidden items-center  border-t-border-300  md:hidden border-t",
        { "pb-5": Platform.OS === "ios" },
        { "pb-5": Platform.OS === "android" }
      )}
    >
      {bottomTabsList
        .filter((item, index) => {
          if (userType === "master" && (index === 1 || index === 2 || index === 3)) {
            return false;
          }
          return true;
        })
        .map((item: { iconText: string; iconName: any }, index) => (
          <Pressable
            className="px-0.5 flex-1 flex-col items-center  hover:bg-background-50"
            key={item.iconName}
            onPress={() => handlePress(index)}
          >
            <Icon
              as={item.iconName}
              size="md"
              className={`h-[32px] w-[65px] stroke-background-800 ${
                index === selectedIndex ? "fill-background-800" : "fill-none"
              }`}
            />
            <Text className="text-xs text-center text-typography-600">
             {item.iconText}
            </Text>
            {item.iconName === ShoppingCart && items > 0 && (
              <Box className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <Text className="text-xs">{items}</Text>
              </Box>
            )}
          </Pressable>
        ))}
    </HStack>
  );
};
