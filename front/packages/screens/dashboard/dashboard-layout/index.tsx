import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { Icon, ChevronRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useRouter from "@unitools/router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Sidebar } from "../../components/Sidebar";
import { WebHeader } from "../../components/WebHeader";
import { MobileFooter } from "../../components/MobileFooter";
import { MobileHeader } from "../../components/MobileHeader";

interface CardData {
  bannerUri: string;
  title: string;
  description: string;
}

const HeadingCards: CardData[] = [
  {
    bannerUri: require("@/shared/assets/dashboard/dashboard-layout/image.png"),
    title: "Jogos",
    description: "Add your details",
  },
  {
    bannerUri: require("@/assets/dashboard/dashboard-layout/image2.png"),
    title: "Festas",
    description: "Add your skills here",
  },
  {
    bannerUri: require("@/assets/dashboard/dashboard-layout/image3.png"),
    title: "Produtos",
    description: "Set a target to accomplish",
  },
  {
    bannerUri: require("@/assets/dashboard/dashboard-layout/image3.png"),
    title: "Planos de assinatura",
    description: "Set a target to accomplish",
  },
  {
    bannerUri: require("@/assets/dashboard/dashboard-layout/image3.png"),
    title: "Admin Atlética",
    description: "Set a target to accomplish",
  },
  {
    bannerUri: require("@/assets/dashboard/dashboard-layout/image3.png"),
    title: "Gerenciar Atléticas",
    description: "Set a target to accomplish",
  },
];

const DashboardLayout = (props: any) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    props.isSidebarVisible,
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

const MainContent = () => {
  const router = useRouter();

  const handleCardPress = () => {
    router.push("/dashboard/gerenciar-atleticas");
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

          <Grid className="gap-5">
            {HeadingCards.map((item, index) => {
              return (
                <GridItem
                  _extra={{
                    className: "col-span-12 sm:col-span-6 lg:col-span-4",
                  }}
                  key={index}
                >
                  <HStack
                    space="md"
                    className="border border-border-300 rounded-lg p-4 items-center justify-between"
                  >
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
                        <Text className="line-clamp-1">{item.description}</Text>
                      </VStack>
                    </HStack>
                    <Pressable onPress={() => handleCardPress()}>
                      <Icon as={ChevronRightIcon} size="md" />
                    </Pressable>
                  </HStack>
                </GridItem>
              );
            })}
          </Grid>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export const Dashboard = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title="Início" isSidebarVisible={true}>
        <MainContent />
      </DashboardLayout>
      <MobileFooter />
    </SafeAreaView>
  );
};
