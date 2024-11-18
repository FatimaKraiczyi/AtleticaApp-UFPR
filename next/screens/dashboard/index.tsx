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
import useRouter from "@unitools/router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LoadingState } from "@/components/sections/LoadingState";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";

interface CardData {
  bannerUri: string;
  title: string;
  description: string;
  userType?: string;
  route: string;
}

const HeadingCards: CardData[] = [
  {
    bannerUri: require("@/assets/dashboard/image2.png"),
    title: "Jogos",
    description: "Visualizar todos os jogos",
    route: "/dashboard/jogos",
  },
  {
    bannerUri: require("@/assets/dashboard/image.png"),
    title: "Eventos",
    description: "Visualizar todos os eventos",
    route: "/dashboard/eventos",
  },
  {
    bannerUri: require("@/assets/dashboard/image4.png"),
    title: "Produtos",
    description: "Visualizar todos os produtos",
    route: "/dashboard/produtos",
  },
  {
    bannerUri: require("@/assets/dashboard/image5.png"),
    title: "Planos de assinatura",
    description: "Visualizar todos os planos de assinatura",
    route: "/dashboard/planos",
  },
  {
    bannerUri: require("@/assets/dashboard/image6.png"),
    title: "Admin Atlética",
    description: "Administrar sua atlética e seus membros",
    userType: "ADMIN",
    route: "/dashboard/admin",
  },
  {
    bannerUri: require("@/assets/dashboard/image6.png"),
    title: "Gerenciar Atléticas",
    description: "Cadastrar e gerenciar as atléticas e seus membros",
    userType: "master",
    route: "/dashboard/atleticas",
  },
];

const MainContent = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = sessionStorage.getItem("userType");
      setUserType(storedUserType);
    }
    setLoading(false);
  }, []);

  const filteredCards = HeadingCards.filter((card) => {
    if (userType === "master" && card.userType !== "master") {
      return false;
    }
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
        <VStack className="p-4  md:px-10 md:pt-6  w-full" space="2xl">
          <Heading size="2xl" className="font-roboto font-bold">
            Bem-vindo
          </Heading>
					<Grid
            className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            _extra={{
              className: "gap-5",
            }}
          >
            {filteredCards.map((card, index) => (
              <GridItem
                key={index}
                className="shadow-md  rounded-lg"
                _extra={{
                  className: "",
                }}
              >
                <Box className="bg-violet-600 p-5 rounded-t-lg">
                  <Image
                    size="sm"
                    source={card.bannerUri}
                    alt={card.title}
                    className="w-20 h-20 mx-auto rounded-full"
                  />
                </Box>
                <Box className="p-4 md:h-[180px]">
                  <Text className="text-lg font-semibold">{card.title}</Text>
                  <Text className="text-sm text-gray-500">
                    {card.description}
                  </Text>

                  <Button
                    className="md:mt-auto mt-4 hover:bg-primary-500 py-2"
                    variant="outline"
                    onPress={() => handleCardPress(card.route)}
                  >
                    <ButtonText className="text-secondary-600 group-hover/button:text-white">
                      Ver Mais
                    </ButtonText>
                  </Button>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export const Dashboard = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Início" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
