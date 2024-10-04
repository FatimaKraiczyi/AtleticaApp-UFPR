import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import useRouter from "@unitools/router";
import { useState } from "react";
import { HomeIcon } from "../dashboard/assets/home";
import { GlobeIcon } from "../dashboard/assets/globe";
import { CartIcon } from "../dashboard/assets/cart";
import type { LucideIcon } from "lucide-react-native";
import { ProfileIcon } from "../dashboard/assets/profile";

type Icons = {
  iconName: LucideIcon | typeof Icon;
};

const list: Icons[] = [
  {
    iconName: HomeIcon,
  },
  {
    iconName: GlobeIcon,
  },
  {
    iconName: CartIcon,
  },
  {
    iconName: ProfileIcon,
  },
];

export const Sidebar = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handlePress = (index: number) => {
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
  };

  return (
    <VStack
      className="w-14 pt-5 h-full items-center border-r border-border-300"
      space="xl"
    >
      {list.map((item, index) => (
        <Pressable
          key={index}
          className="hover:bg-background-50"
          onPress={() => handlePress(index)}
        >
          <Icon
            as={item.iconName}
            className={`w-[55px] h-9 stroke-background-800 ${
              index === selectedIndex ? "fill-background-800" : "fill-none"
            }`}
          />
        </Pressable>
      ))}
    </VStack>
  );
};
