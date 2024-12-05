import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { useState, useEffect } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import { Image } from "@/components/ui/image";
import useRouter from "@unitools/router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Button, ButtonText } from "@/components/ui/button";
import { ModalAtletica } from "./atletica-modal";
import { DeleteAtletica } from "./delete-atletica";
import { getAtletica, getAtleticaById } from "@/api/atleticas";
import { getMembros } from "@/api/membros";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { LoadingState } from "@/components/sections/LoadingState";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { Atletica, AtleticaResponse } from "@/interfaces/atleticas";
import { useAtletica } from "@/hooks/AtleticaContex";
import { Heading } from "@/components/ui/heading";
import { useMembros } from "@/hooks/MembrosContext";
import { Edit, Trash } from "lucide-react-native";

const AllAtleticas = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atleticaId") : null;
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedAtletica, setSelectedAtletica] = useState<
    Atletica | undefined
  >(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [atleticaToDeleteId, setAtleticaToDeleteId] = useState<
    number | undefined
  >(undefined);
  const [atleticas, setAtleticas] = useState<AtleticaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { setAtleticaData } = useAtletica();

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/gerenciar/atleticas";

  const fetchAtleticas = async () => {
    setLoading(true);

    const response = await getAtletica();
    if (response.success && response.data) {
      setAtleticas(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAtleticas();
  }, []);

  const openModal = (atletica?: Atletica) => {
    setSelectedAtletica(atletica?.id ? atletica : undefined);
    setShowModal(true);
  };

  const handleEditAtletica = (atletica: AtleticaResponse) => {
    openModal(atletica.atletica);
  };

  const handleOpenDeleteModal = (id: number) => {
    setAtleticaToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCardPress = async (atletica: AtleticaResponse) => {
    try {
      const response = await getAtleticaById(atletica.atletica.id);
      if (response.success && response.data) {
        setAtleticaData(response.data);
        router.push("/dashboard/visualizar/perfil");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  const renderNoItems = () => (
    <NoItemsFound message="Nenhuma atlética encontrada." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {showActions && (
          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative" onPress={() => openModal()}>
              <ButtonText>Adicionar Atletica</ButtonText>
            </Button>
          </VStack>
        )}
        {atleticas.length === 0 ? (
          renderNoItems()
        ) : (
					<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ flexGrow: 1 }}
					className="p-4"
          >
            <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {atleticas.map((atletica) => (
                <GridItem className="shadow-md rounded-lg">
                  <Box className="bg-violet-600 p-4 md:h-[120px] rounded-t-lg">
                    <Image
                      source={
                        atletica.atletica.imagem ||
                        require("@/assets/dashboard/image2.png")
                      }
                      alt={atletica.atletica.imagem}
                      className=" mx-auto 	rounded-full"
                    />
                  </Box>
                  <Box className="p-4 md:h-[180px]">
                    <Text className="text-lg font-semibold">
                      {atletica.atletica.nome}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {atletica.atletica.descricao}
                    </Text>
                    <Button
                      className="md:mt-auto mt-4 hover:bg-primary-500 py-2"
                      variant="outline"
                      onPress={() => handleCardPress(atletica)}
                    >
                      <ButtonText className="text-secondary-600 group-hover/button:text-white">
                        Ver Mais
                      </ButtonText>
                    </Button>
                  </Box>
                  {showActions && (
                    <HStack className="w-full items-center justify-between mt-4">
                      <HStack className="items-center">
                        <Pressable onPress={() => handleEditAtletica(atletica)}>
                          <Edit className="text-typography-600 mr-4" />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            atletica.atletica.id !== undefined &&
                            handleOpenDeleteModal(atletica.atletica.id)
                          }
                        >
                          <Trash className="text-typography-600" />
                        </Pressable>
                      </HStack>
                    </HStack>
                  )}
                </GridItem>
              ))}
            </Grid>
          </ScrollView>
        )}
      </VStack>
      <ModalAtletica
        showModal={showModal}
        setShowModal={setShowModal}
        refreshAtleticas={fetchAtleticas}
        atleticaData={selectedAtletica}
      />
      <DeleteAtletica
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        id={atleticaToDeleteId}
        refreshAtleticas={fetchAtleticas}
      />
    </Box>
  );
};

export const AtleticasList = () => {
  return <AllAtleticas />;
};
