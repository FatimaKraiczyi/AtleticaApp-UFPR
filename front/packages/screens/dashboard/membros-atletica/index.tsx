import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import useRouter from "@unitools/router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Button, ButtonText } from "@/components/ui/button";
import { MobileHeader } from "../../components/MobileHeader";
import { WebHeader } from "../../components/WebHeader";
import { Sidebar } from "../../components/Sidebar";
import { MobileFooter } from "../../components/MobileFooter";
import { ModalMembros } from "./membro-modal";

interface CardData {
  id: number;
  nome: string;
  cargo?: string;
}

const HeadingCards: CardData[] = [
  {
    id: 1,
    nome: "Membro 1",
    cargo: "Presidente",
  },
  {
    id: 2,
    nome: "Membro 2",
  },
];

const Membros = (props: any) => {
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

const MainContent = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCardPress = (id: number) => {
    router.push(`/dashboard/membros-atletica/${id}`);
  };

  const handleCadastrarMembroPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Box className="flex-1">
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
            <Button
              className="gap-3 relative"
              onPress={handleCadastrarMembroPress}
            >
              <ButtonText>Cadastrar Membro</ButtonText>
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
                        <VStack>
                          <Text className="font-semibold text-typography-900 line-clamp-1">
                            {item.nome}
                          </Text>
                          <Text className="line-clamp-1">
                            {item.cargo ? item.cargo : ""}
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
                  </VStack>
                </GridItem>
              );
            })}
          </Grid>
        </VStack>
      </ScrollView>

      <ModalMembros
        showModal={isModalVisible}
        setShowModal={handleCloseModal}
      />
    </Box>
  );
};

export const GerenciarMembros = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <Membros title="Gerenciar Membros" isSidebarVisible={true}>
        <MainContent />
      </Membros>
      <MobileFooter />
    </SafeAreaView>
  );
};
