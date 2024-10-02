import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import useRouter from "@unitools/router";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { Platform } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { HomeIcon } from "../dashboard/assets/home";
import { GlobeIcon } from "../dashboard/assets/globe";
import { InboxIcon } from "../dashboard/assets/inbox";
import { HeartIcon } from "../dashboard/assets/heart";
import { ProfileIcon } from "../dashboard/assets/profile/index.web";
import { useState } from "react";

type BottomTabs = {
  iconName: LucideIcon | typeof Icon;
  iconText: string;
};

const bottomTabsList: BottomTabs[] = [
  {
    iconName: HomeIcon,
    iconText: "Home",
  },

  {
    iconName: GlobeIcon,
    iconText: "Community",
  },
  {
    iconName: InboxIcon,
    iconText: "Inbox",
  },
  {
    iconName: HeartIcon,
    iconText: "Favourite",
  },
  {
    iconName: ProfileIcon,
    iconText: "Profile",
  },
];

export const MobileFooter = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handlePress = (index: number) => {
    setSelectedIndex(index);
    // router.push("/dashboard/dashboard-layout");
  };

  return (
    <HStack
      className={cn(
        "bg-background-0 justify-between w-full absolute left-0 bottom-0 right-0 p-3 overflow-hidden items-center  border-t-border-300  md:hidden border-t",
        { "pb-5": Platform.OS === "ios" },
        { "pb-5": Platform.OS === "android" },
      )}
    >
      {bottomTabsList.map(
        (item: { iconText: string; iconName: any }, index) => (
          <Pressable
            className="px-0.5 flex-1 flex-col items-center"
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
          </Pressable>
        ),
      )}
    </HStack>
  );
};
