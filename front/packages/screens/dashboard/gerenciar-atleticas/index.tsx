import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { useState, useEffect } from "react";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useRouter from "@unitools/router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Button, ButtonText } from "@/components/ui/button";
import { MobileHeader } from "../../components/MobileHeader";
import { WebHeader } from "../../components/WebHeader";
import { MobileFooter } from "../../components/MobileFooter";
import { Sidebar } from "../../components/Sidebar";
import { ModalAtletica } from "./atletica-modal";
import { getAtletica } from "../../../../api/atleticas";
import type { Atletica } from "../../../../interfaces/atleticas";

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

const MainContent = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [atleticas, setAtleticas] = useState<Atletica[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCardPress = (id: number) => {
    router.push(`/dashboard/membros-atletica/${id}`);
  };

  const handleCadastrarAtleticaPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchAtleticas = async () => {
      try {
        const response = await getAtletica();
        if (response.success && response.data) {
          setAtleticas(response.data.atletica);
        } else {
          console.error("Erro ao buscar atléticas");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAtleticas();
  }, []);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

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
            Bem-vindo, Alexander
          </Heading>

          <VStack space="lg" className="items-center">
            <Button
              className="gap-3 relative"
              onPress={handleCadastrarAtleticaPress}
            >
              <ButtonText>Cadastrar Atlética</ButtonText>
            </Button>
          </VStack>

          <Grid
            _extra={{
              className: "gap-5",
            }}
          >
            {atleticas.map((item, index) => (
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
                          source={
                            item.imagem ||
                            require("@/shared/assets/dashboard/dashboard-layout/image2.png")
                          }
                        />
                      </Avatar>
                      <VStack>
                        <Text className="font-semibold text-typography-900 line-clamp-1">
                          {item.nome}
                        </Text>
                        <Text className="line-clamp-1">{item.descricao}</Text>
                      </VStack>
                    </HStack>
                    <HStack space="md">
                      <Pressable>
                        <Icon as={EditIcon} className="text-typography-600" />
                      </Pressable>
                      <Pressable>
                        <Icon as={TrashIcon} className="text-typography-600" />
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
            ))}
          </Grid>
        </VStack>
      </ScrollView>

      <ModalAtletica
        showModal={isModalVisible}
        setShowModal={handleCloseModal}
      />
    </Box>
  );
};

export const GerenciarAtleticas = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <Atleticas title="Gerenciar Atléticas" isSidebarVisible={true}>
        <MainContent />
      </Atleticas>
      <MobileFooter />
    </SafeAreaView>
  );
};
