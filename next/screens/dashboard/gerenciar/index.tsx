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
import { Image } from "@/components/ui/image";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { LoadingState } from "@/components/sections/LoadingState";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { Button, ButtonText } from "@/components/ui/button";
import { getAtleticaById } from "@/api/atleticas";

interface CardData {
  bannerUri: string;
  title: string;
  description: string;
  userType?: string;
  route: string;
}

const HeadingCards: CardData[] = [
  {
    bannerUri: require("@/assets/dashboard/image3.png"),
    title: "Gerenciar Jogos",
    description: "Gerencie os jogos da atlética",
    route: "/dashboard/gerenciar/jogos",
  },
  {
    bannerUri: require("@/assets/dashboard/image.jpg"),
    title: "Gerenciar Eventos",
    description: "Gerencie os eventos da atlética",
    route: "/dashboard/gerenciar/eventos",
  },
  {
    bannerUri: require("@/assets/dashboard/image4.png"),
    title: "Gerenciar Produtos",
    description: "Gerencie os produtos da atlética",
    route: "/dashboard/gerenciar/loja",
  },
  {
    bannerUri: require("@/assets/dashboard/image5.jpg"),
    title: "Gerenciar Planos de assinatura",
    description: "Gerencie os planos de assinatura da atlética",
    route: "/dashboard/gerenciar/planos",
  },
  {
    bannerUri: require("@/assets/dashboard/image6.png"),
    title: "Gerenciar Membros",
    description: "Gerencie os membros da atlética",
    route: "/dashboard/gerenciar/membros",
  },
];

const MainContent = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [atleticaName, setAtleticaName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const storedUserType = sessionStorage.getItem("tipo");
        const atleticaId = sessionStorage.getItem("atletica");

        setUserType(storedUserType);
        if (atleticaId && !atleticaName) {
          const response = await getAtleticaById(atleticaId);
          if (response.success && response.data) {
            setAtleticaName(response.data.atletica.nome);
          }
        }
      }
      setLoading(false);
    };

    fetchData();
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
        contentContainerStyle={{ flexGrow: 1 }}
        className="p-4"
      >
        <VStack className="p-4  md:px-10 md:pt-6  w-full" space="2xl">
          <Heading size="2xl" className="font-roboto">
            {atleticaName}
          </Heading>

          <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-10">
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
                    className="md:mt-auto mt-4  w-full hover:bg-primary-500 py-2"
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

export const GerenciarAtletica = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Gerenciar Atlética" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
