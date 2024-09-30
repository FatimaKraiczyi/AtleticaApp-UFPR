import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import {
  ChevronLeftIcon,
  EditIcon,
  Icon,
  MenuIcon,
  TrashIcon,
} from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import type { LucideIcon } from "lucide-react-native";
import { InboxIcon } from "../assets/inbox";
import { GlobeIcon } from "../assets/globe";
import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import useRouter from "@unitools/router";
import { HomeIcon } from "../assets/home";
import { HeartIcon } from "../assets/heart";
import { ProfileIcon } from "../assets/profile";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { Platform } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

type MobileHeaderProps = {
  title: string;
};

type HeaderProps = {
  title: string;
  toggleSidebar: () => void;
};

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

interface CardData {
  id: number;
  bannerUri: string;
  title: string;
  description: string;
}

const HeadingCards: CardData[] = [
  {
    id: 1,
    bannerUri: require("@/shared/assets/dashboard/dashboard-layout/image.png"),
    title: "Atletica 1",
    description: "Add your details",
  },
  {
    id: 2,
    bannerUri: require("@/shared/assets/dashboard/dashboard-layout/image.png"),
    title: "Atletica 2",
    description: "Add your details",
  },
  {
    id: 3,
    bannerUri: require("@/shared/assets/dashboard/dashboard-layout/image.png"),
    title: "Atletica 3",
    description: "Add your details",
  },
];

const Sidebar = () => {
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
      {list.map((item, index) => {
        return (
          <Pressable
            key={index}
            className="hover:bg-background-50"
            onPress={() => handlePress(index)}
          >
            <Icon
              as={item.iconName}
              className={`w-[55px] h-9 stroke-background-800 
              ${index === selectedIndex ? "fill-background-800" : "fill-none"}

              `}
            />
          </Pressable>
        );
      })}
    </VStack>
  );
};

const Atleticas = (props: any) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    props.isSidebarVisible
  );
  function toggleSidebar() {
    setIsSidebarVisible(!isSidebarVisible);
  }

  return (
    <VStack className="h-full w-full bg-background-0">
      <Box className="md:hidden">
        <MobileHeader title={props.title} />
      </Box>
      <Box className="hidden md:flex">
        <WebHeader toggleSidebar={toggleSidebar} title={props.title} />
      </Box>
      <VStack className="h-full w-full">
        <HStack className="h-full w-full">
          <Box className="hidden md:flex h-full">
            {isSidebarVisible && <Sidebar />}
          </Box>
          <VStack className="w-full">{props.children}</VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

function MobileFooter({ footerIcons }: { footerIcons: any }) {
  const router = useRouter();
  return (
    <HStack
      className={cn(
        "bg-background-0 justify-between w-full absolute left-0 bottom-0 right-0 p-3 overflow-hidden items-center  border-t-border-300  md:hidden border-t",
        { "pb-5": Platform.OS === "ios" },
        { "pb-5": Platform.OS === "android" }
      )}
    >
      {footerIcons.map((item: { iconText: string; iconName: any }) => {
        return (
          <Pressable
            className="px-0.5 flex-1 flex-col items-center"
            key={item.iconName}
            onPress={() => router.push("/dashboard/dashboard-layout")}
          >
            <Icon as={item.iconName} size="md" className="h-[32px] w-[65px]" />
            <Text className="text-xs text-center text-typography-600">
              {item.iconText}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  );
}

function WebHeader(props: HeaderProps) {
  return (
    <HStack className="pt-4  pr-10 pb-3 bg-background-0 items-center justify-between border-b border-border-300">
      <HStack className="items-center">
        <Pressable
          onPress={() => {
            props.toggleSidebar();
          }}
        >
          <Icon as={MenuIcon} size="lg" className="mx-5" />
        </Pressable>
        <Text className="text-2xl">{props.title}</Text>
      </HStack>

      <Avatar className="h-9 w-9">
        <AvatarFallbackText className="font-light">A</AvatarFallbackText>
      </Avatar>
    </HStack>
  );
}

function MobileHeader(props: MobileHeaderProps) {
  const router = useRouter();
  return (
    <HStack
      className="py-4 px-4 mt-10 border-b border-border-50 bg-background-0 items-center"
      space="md"
    >
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <Icon as={ChevronLeftIcon} />
      </Pressable>
      <Text className="text-xl">{props.title}</Text>
    </HStack>
  );
}

const MainContent = () => {
  const router = useRouter();

  const handleCardPress = (id: number) => {
    // Navegar para a página correspondente ao título do card
    router.push(`/dashboard/gerenciar-atletica/${id}`);
  };

  return (
    <Box className="flex-1 ">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isWeb ? 0 : 100,
          flexGrow: 1,
        }}
        className="flex-1 mb-20 md:mb-2"
      >
        <VStack className="p-4 pb-0 md:px-10 md:pt-6  w-full" space="2xl">
          <Heading size="2xl" className="font-roboto">
            Welcome Alexander
          </Heading>

          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative">
              <ButtonText>Cadastrar Atlética</ButtonText>
            </Button>
          </VStack>

          <Grid className="gap-5">
            {HeadingCards.map((item, index) => {
              return (
                <GridItem
                  _extra={{
                    className: "col-span-12 sm:col-span-6 lg:col-span-4",
                  }}
                  key={index}
                >
                  <VStack
                    space="md"
                    className="border border-border-300 rounded-lg p-4"
                  >
                    <HStack space="xl" className="items-center justify-between">
                      <HStack space="xl" className="items-center">
                        <Avatar>
                          <AvatarImage
                            //@ts-ignore
                            source={item.bannerUri}
                          />
                        </Avatar>
                        <VStack>
                          <Text className="font-semibold text-typography-900 line-clamp-1">
                            {item.title}
                          </Text>
                          <Text className="line-clamp-1">
                            {item.description}
                          </Text>
                        </VStack>
                      </HStack>
                      <HStack space="md">
                        <Pressable onPress={() => handleCardPress(item.id)}>
                          <Icon as={EditIcon} className="text-typography-600" />
                        </Pressable>
                        <Pressable onPress={() => handleCardPress(item.id)}>
                          <Icon
                            as={TrashIcon}
                            className="text-typography-600"
                          />
                        </Pressable>
                      </HStack>
                    </HStack>
                    <Button
                      variant="outline"
                      className="gap-3 relative"
                      onPress={() => handleCardPress(item.id)}
                    >
                      <ButtonText>Gerenciar Membros</ButtonText>
                    </Button>
                  </VStack>
                </GridItem>
              );
            })}
          </Grid>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export const GerenciarAtleticas = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <Atleticas title="Gerenciar Atléticas" isSidebarVisible={true}>
        <MainContent />
      </Atleticas>
      <MobileFooter footerIcons={bottomTabsList} />
    </SafeAreaView>
  );
};
