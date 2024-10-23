import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import useRouter from "@unitools/router";
import { useState, useEffect } from "react";
import { HomeIcon } from "../dashboard/assets/home";
import { GlobeIcon } from "../dashboard/assets/globe";
import { CartIcon } from "../dashboard/assets/cart";
import { ProfileIcon } from "../dashboard/assets/profile";
import { Text } from "@/components/ui/text";
import type { LucideIcon } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { LogoutIcon } from "../dashboard/assets/logout";
import { Box } from "@/components/ui/box";

type Icons = {
  iconName: LucideIcon | typeof Icon;
  label: string;
};

const list: Icons[] = [
  {
    iconName: HomeIcon,
    label: "Início",
  },
  {
    iconName: GlobeIcon,
    label: "Atléticas",
  },
  {
    iconName: CartIcon,
    label: "Carrinho",
  },
  {
    iconName: ProfileIcon,
    label: "Meu Perfil",
  },
  {
    iconName: LogoutIcon,
    label: "Sair",
  },
];

export const WebSidebar = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("dashboard-layout")) {
        setSelectedIndex(0);
      } else if (path.includes("atleticas")) {
        setSelectedIndex(1);
      } else if (path.includes("carrinho")) {
        setSelectedIndex(2);
      } else if (path.includes("meu-perfil")) {
        setSelectedIndex(3);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userType");
			sessionStorage.removeItem("atleticaId");
    }
    router.push("/auth/signin");
  };

  const handlePress = (index: number) => {
    if (index === 4) {
      handleLogout();
    } else {
      setSelectedIndex(index);
      if (index === 0) {
        router.push("/dashboard/dashboard-layout");
      } else if (index === 1) {
        router.push("/dashboard/atleticas");
      } else if (index === 2) {
        router.push("/dashboard/carrinho");
      } else if (index === 3) {
        router.push("/dashboard/meu-perfil");
      }
    }
  };

  return (
    <VStack className="w-48 h-full border-r border-border-300">
      {list.slice(0, -1).map((item, index) => (
        <Pressable
          key={index}
          className="w-full hover:bg-background-50"
          onPress={() => handlePress(index)}
        >
          <HStack
            className={`items-center px-4 py-3 h-12 w-full ${
              index === selectedIndex ? "bg-background-200" : ""
            }`}
            style={{ justifyContent: "flex-start" }}
          >
            <Icon
              as={item.iconName}
              className={`w-6 h-6 stroke-background-800 ${
                index === selectedIndex ? "fill-background-800" : "fill-none"
              }`}
            />
            <Text className="ml-4 text-background-800 font-medium">
              {item.label}
            </Text>
          </HStack>
        </Pressable>
      ))}
      <Box className="flex-grow" />
      <Pressable
        className="w-full hover:bg-background-50"
        onPress={handleLogout}
      >
        <HStack
          className="items-center px-4 py-3 h-12 w-full"
          style={{ justifyContent: "flex-start" }}
        >
          <Icon
            as={LogoutIcon}
            className="w-6 h-6 stroke-background-800 fill-background-800"
          />
          <Text className="ml-4 text-background-800 font-medium">Sair</Text>
        </HStack>
      </Pressable>
    </VStack>
  );
};