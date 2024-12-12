import { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
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
import { getAtleticaById } from "@/api/atleticas";
import { useAtletica } from "@/hooks/AtleticaContex";

interface CardData {
  bannerUri: string;
  title: string;
  description: string;
  tipo?: string;
  route: string;
}

const HeadingCards: CardData[] = [
  {
    bannerUri: require("@/assets/dashboard/image3.png"),
    title: "Jogos",
    description: "Visualizar todos os jogos",
    route: "/dashboard/visualizar/jogos",
  },
  {
    bannerUri: require("@/assets/dashboard/image.jpg"),
    title: "Eventos",
    description: "Visualizar todos os eventos",
    route: "/dashboard/visualizar/eventos",
  },
  {
    bannerUri: require("@/assets/dashboard/image4.png"),
    title: "Loja",
    description: "Visualizar todos os produtos",
    route: "/dashboard/visualizar/loja",
  },
  {
    bannerUri: require("@/assets/dashboard/image5.png"),
    title: "Planos de assinatura",
    description: "Visualizar todos os planos de assinatura",
    route: "/dashboard/visualizar/planos",
  },
  {
    bannerUri: require("@/assets/dashboard/image6.png"),
    title: "Gerenciar Atlética",
    description: "Gerenciar sua atlética e seus membros",
    tipo: "ADMIN",
    route: "/dashboard/gerenciar",
  },
  {
    bannerUri: require("@/assets/dashboard/image6.png"),
    title: "Gerenciar Atléticas",
    description: "Gerenciar as atléticas e seus membros",
    tipo: "master",
    route: "/dashboard/gerenciar/atleticas",
  },
];

const Card = ({
  card,
  onPress,
}: {
  card: CardData;
  onPress: (route: string) => void;
}) => (
  <GridItem className="shadow-md rounded-lg">
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
      <Text className="text-sm text-gray-500">{card.description}</Text>

      <Button
        className="md:mt-auto mt-4 hover:bg-primary-500 py-2"
        variant="outline"
        onPress={() => onPress(card.route)}
      >
        <ButtonText className="text-secondary-600 group-hover/button:text-white">
          Ver Mais
        </ButtonText>
      </Button>
    </Box>
  </GridItem>
);

const MainContent = () => {
  const router = useRouter();
  const [tipo, setTipo] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { atleticaData, setAtleticaData } = useAtletica();

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const storedUserType = sessionStorage.getItem("tipo");
        const usuarioNome = sessionStorage.getItem("usuarioNome");
        const atleticaId = sessionStorage.getItem("atletica");

        setTipo(storedUserType);
        if (usuarioNome) {
          const nomeArray = usuarioNome.split(" ");
          const nomeFormatado = `${nomeArray[0]} ${
            nomeArray[nomeArray.length - 1]
          }`;
          setUserName(nomeFormatado);
        }
        if (storedUserType === "ADMIN" && atleticaId) {
          const response = await getAtleticaById(atleticaId);
          if (response.success && response.data) {
            setAtleticaData(response.data.atletica.nome);
          }
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const mainCards = HeadingCards.filter((card, index) =>
    [0, 1, 2, 3].includes(index)
  );
  const adminCards = HeadingCards.filter(
    (card, index) => index === 4 && tipo === "ADMIN"
  );
  const masterCards = HeadingCards.filter(
    (card, index) => index === 5 && tipo === "master"
  );

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
        <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
          {tipo === "master" ? (
            <>
              <Heading size="2xl" className="font-roboto font-bold">
                Gerenciar Atléticas
              </Heading>
              <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {masterCards.map((card, index) => (
                  <Card key={index} card={card} onPress={handleCardPress} />
                ))}
              </Grid>
            </>
          ) : (
            <>
              <Heading size="2xl" className="font-roboto font-bold">
                Olá, {userName}
              </Heading>
              <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-10">
                {mainCards.map((card, index) => (
                  <Card key={index} card={card} onPress={handleCardPress} />
                ))}
              </Grid>

              {adminCards.length > 0 && (
                <>
                  <Heading size="xl" className="font-roboto font-bold mt-10">
                    Gerenciar: {String(atleticaData)}
                  </Heading>
              <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-10">
                    {adminCards.map((card, index) => (
                      <Card key={index} card={card} onPress={handleCardPress} />
                    ))}
                  </Grid>
                </>
              )}
            </>
          )}
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
