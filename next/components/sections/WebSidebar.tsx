import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import useRouter from "@unitools/router";
import { useState, useEffect } from "react";
import {
  House,
  UserRound,
  ShoppingCart,
  Search,
  Package,
} from "lucide-react-native";
import { Text } from "@/components/ui/text";
import type { LucideIcon } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { useCarrinho } from "@/hooks/CarrinhoContext";

type Icons = {
  iconName: LucideIcon | typeof Icon;
  label: string;
};

const list: Icons[] = [
  {
    iconName: House,
    label: "Início",
  },
  {
    iconName: Search,
    label: "Atléticas",
  },
  {
    iconName: ShoppingCart,
    label: "Carrinho",
  },
  {
    iconName: UserRound,
    label: "Assinaturas",
  },
  {
    iconName: Package,
    label: "Pedidos",
  },
];

export const WebSidebar = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { items } = useCarrinho();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const userType = sessionStorage.getItem("tipo");
      setUserType(userType);

      if (path.includes("dashboard/visualizar/atleticas")) {
        setSelectedIndex(1);
      } else if (path.includes("dashboard/visualizar/carrinho")) {
        setSelectedIndex(2);
      } else if (path.includes("dashboard/visualizar/assinatura")) {
        setSelectedIndex(3);
      } else if (path.includes("dashboard/visualizar/pedidos")) {
        setSelectedIndex(4);
      } else {
        setSelectedIndex(0);
      }
    }
  }, []);

  const handlePress = (index: number) => {
    if (index === 0) {
      router.push("/dashboard");
    } else if (index === 1) {
      router.push("/dashboard/visualizar/atleticas");
    } else if (index === 2) {
      router.push("/dashboard/visualizar/carrinho");
    } else if (index === 3) {
      router.push("/dashboard/visualizar/assinatura");
    } else if (index === 4) {
      router.push("/dashboard/visualizar/pedidos");
    }
  };

  const getBackgroundClass = (index: number) => {
    return index === selectedIndex ? "bg-violet-200" : "";
  };

  return (
    <VStack className="w-48 h-full border-r border-border-300">
      {list
        .filter((item, index) => {
          if (userType === "master" && (index === 1 || index === 2 || index === 3)) {
            return false;
          }
          return true;
        })
        .map((item, index) => (
        <Pressable
          key={index}
          className="w-full hover:bg-background-50"
          onPress={() => handlePress(index)}
        >
            <HStack
              className={`items-center px-4 py-3 h-12 w-full ${
                getBackgroundClass(index)
              }`}
              style={{ justifyContent: "flex-start" }}
            >
              <Icon
                as={item.iconName}
                className={`w-6 h-6 stroke-background-800 ${
                  index === selectedIndex ? "fill-background-800 stroke-background-800" : "fill-none"
                }`}
              />
              <Text className="ml-4 text-background-800 font-medium">
                {item.label}
              </Text>
              {item.iconName === ShoppingCart && items > 0 && (
                <Box className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Text className="text-xs">{items}</Text>
                </Box>
              )}
            </HStack>
          </Pressable>
        ))}
      <Box className="flex-grow" />
    </VStack>
  );
};