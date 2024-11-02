import { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { Icon, ChevronRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useRouter from "@unitools/router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { MobileFooter } from "../../sections/MobileFooter";
import { LayoutComponents } from "../../sections/LayoutComponents";
import { LoadingState } from "../../sections/LoadingState";

interface CardData {
  bannerUri: string;
  title: string;
  description: string;
  userType?: string;
  route: string;
}

const HeadingCards: CardData[] = [
  {
    bannerUri: require("@/shared/assets/dashboard/image3.png"),
    title: "Gerenciar Jogos",
    description: "Add your details",
    route: "/dashboard/admin/jogos",
  },
  {
    bannerUri: require("@/assets/dashboard/image.png"),
    title: "Gerenciar Eventos",
    description: "Add your skills here",
    route: "/dashboard/admin/eventos",
  },
  {
    bannerUri: require("@/assets/dashboard/image4.png"),
    title: "Gerenciar Loja",
    description: "Set a target to accomplish",
    route: "/dashboard/admin/loja",
  },
  {
    bannerUri: require("@/assets/dashboard/image5.png"),
    title: "Gerenciar Planos de assinatura",
    description: "Set a target to accomplish",
    route: "/dashboard/admin/plano-assinatura",
  },
  {
    bannerUri: require("@/assets/dashboard/image6.png"),
    title: "Gerenciar Membros",
    description: "Set a target to accomplish",
    route: "/dashboard/admin/membros",
  }
];

const MainContent = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = sessionStorage.getItem("userType");
      setUserType(storedUserType);
    }
    setLoading(false);
  }, []);

  const filteredCards = HeadingCards.filter((card) => {
    if (card.userType && card.userType !== userType) {
      return false;
    }
    return true;
  });

  const handleCardPress = (route: string) => {
    router.push(route);
  };

  if (loading) {
    return <LoadingState />;
  }

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
            AQUI SERA O NOME DA ATLÉTICA
          </Heading>

          <Grid _extra={{ className: "gap-5" }}>
            {filteredCards.map((item, index) => {
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
                          source={{ uri: item.bannerUri }}
                        />
                      </Avatar>
                      <VStack>
                        <Text className="font-semibold text-typography-900 line-clamp-1">
                          {item.title}
                        </Text>
                        <Text className="line-clamp-1">{item.description}</Text>
                      </VStack>
                    </HStack>
                    <Pressable onPress={() => handleCardPress(item.route)}>
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

export const AdminAtletica = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Administrar Atlética" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
