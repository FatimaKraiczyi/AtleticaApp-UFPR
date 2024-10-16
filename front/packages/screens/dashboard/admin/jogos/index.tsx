import { useEffect, useState } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { LayoutComponents } from "../../../components/LayoutComponents";
import { MobileFooter } from "../../../components/MobileFooter";
import { NoItemsFound } from "../../../components/NoItemsFound";
import { LoadingState } from "../../../components/LoadingState";
import Image from "@unitools/image";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";

interface TabsData {
  src: string;
  title: string;
  price: string;
  location: string;
}

interface Data {
  data: TabsData[];
}

const tabsData: Data[] = [
  {
    data: [
      {
        title: "Tropical Bungalow",
        src: require("@/shared/assets/dashboard/dashboard-layout/image.png"),
        location: "401 Platte River Rd, Gothenburg, United States",
        price: "$1,481",
      },
      {
        title: "Mountain View",
        src: require("@/shared/assets/dashboard/dashboard-layout/image2.png"),
        location: "401 Platte River Rd, Gothenburg, United States",
        price: "$1,481",
      },
      {
        title: "ImageView Inn",
        src: require("@/shared/assets/dashboard/dashboard-layout/image3.png"),
        location: "401 Platte River Rd, Gothenburg, United States",
        price: "$1,481",
      },
    ],
  },
];

const MainContent = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TabsData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setItems(tabsData[0].data);
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  const handleAddEvento = () => {
    setIsModalVisible(true);
  };

  const renderNoItems = () => (
    <NoItemsFound message="Nenhum plano encontrado." />
  );

  const renderItems = () => (
    <Grid className="gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <GridItem
          key={index}
          _extra={{
            className: "flex-1 p-4 relativ",
          }}
        >
          <VStack className="border border-border-300 rounded-lg p-4">
            <Box className="overflow-hidden rounded-md h-72">
              <Image
                source={item.src}
                alt={item.title}
                height={"100%"}
                width={"100%"}
              />
            </Box>

						<VStack className="justify-between h-full" space="md">
						<Text className="font-semibold text-typography-900">
                {item.title}
              </Text>
              <Text size="sm" className="text-typography-500">
                {item.location}
              </Text>
              <Text size="sm" className="font-semibold text-typography-900">
                {item.price}
              </Text>
            </VStack>
          </VStack>
        </GridItem>
      ))}
    </Grid>
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
        <VStack space="lg" className="items-center">
          <Button onPress={handleAddEvento} className="gap-3 relative">
            <ButtonText>Adicionar Evento</ButtonText>
          </Button>
        </VStack>
        {items.length === 0 ? (
          renderNoItems()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: isWeb ? 0 : 100,
              flexGrow: 1,
            }}
            className="flex-1 mb-20 md:mb-2"
          >
            {renderItems()}
          </ScrollView>
        )}
      </VStack>
    </Box>
  );
};
export const AdminJogos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Jogos" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
