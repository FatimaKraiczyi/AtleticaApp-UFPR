import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import useRouter from "@unitools/router";
import { useState } from "react";
import { HomeIcon } from "../dashboard/assets/home";
import { InboxIcon } from "../dashboard/assets/inbox";
import { GlobeIcon } from "../dashboard/assets/globe";
import { HeartIcon } from "../dashboard/assets/heart";
import { LucideIcon } from "lucide-react-native";

type Icons = {
  iconName: LucideIcon | typeof Icon;
};

const list: Icons[] = [
  {
    iconName: HomeIcon,
  },
  {
    iconName: InboxIcon,
  },
  {
    iconName: GlobeIcon,
  },
  {
    iconName: HeartIcon,
  },
];

export const Sidebar = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handlePress = (index: number) => {
    setSelectedIndex(index);
    // router.push("/dashboard/dashboard-layout");
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
