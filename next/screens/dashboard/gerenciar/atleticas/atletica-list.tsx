import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { useState, useEffect } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import useRouter from "@unitools/router";
import { Button, ButtonText } from "@/components/ui/button";
import { ModalAtletica } from "./atletica-modal";
import { DeleteAtletica } from "./delete-atletica";
import { getAtletica, getAtleticaById } from "@/api/atleticas";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { Atletica, AtleticaResponse } from "@/interfaces/atleticas";
import { useAtletica } from "@/hooks/AtleticaContex";
import { Edit, Trash } from "lucide-react-native";
import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar";

const getImageUrl = (path: string | null) => {
  if (!path) return null;
  const baseUrl = "http://localhost:3001/uploads/";
  const fileName = path.split("\\").pop();
  return `${baseUrl}${fileName}`;
};

const AllAtleticas = () => {
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

  const handleEditAtletica = (atletica: Atletica) => {
    openModal(atletica);
  };

  const handleOpenDeleteModal = (id: number) => {
    setAtleticaToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleViewAtletica = async (atletica: AtleticaResponse) => {
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

  const handleCardPress = async (atletica: AtleticaResponse) => {
    const atleticaId = atletica.atletica.id.toString();

    sessionStorage.setItem("atletica", atleticaId);

    router.push("/dashboard/gerenciar/membros");
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
      <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-5  xl:grid-cols-5 gap-10">
              {atleticas.map((atletica) => (
                <GridItem
                  key={atletica.atletica.id}
                  className="shadow-md rounded-lg"
                >
                  <Box className="bg-violet-600 p-5 rounded-t-lg items-center">
                    <Avatar size="xl">
                      {atletica.atletica.imagem ? (
                        <AvatarImage
                          source={{
                            uri:
                              getImageUrl(atletica.atletica.imagem) ||
                              undefined,
                          }}
                          alt="Imagem da atlética"
                        />
                      ) : (
                        <AvatarImage
                          source={{
                            uri: "https://img.freepik.com/vetores-premium/icone-de-moldura-de-foto-foto-vazia-em-branco-vetor-em-fundo-transparente-isolado-eps-10_399089-1290.jpg",
                          }}
                        />
                      )}
                    </Avatar>
                  </Box>
                  <Box className="p-4 sm:py-4 md:h-[180px]">
                    <Text className="text-lg font-semibold">
                      {atletica.atletica.nome}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {atletica.atletica.descricao}
                    </Text>
                    <Button
                      className="mt-auto w-full hover:bg-primary-500 "
                      variant="outline"
                      onPress={() => handleViewAtletica(atletica)}
                    >
                      <ButtonText className="text-secondary-600 group-hover/button:text-white">
                        Ver Mais
                      </ButtonText>
                    </Button>
                  </Box>
                  {showActions && (
                    <Box className="px-4">
                      <Button
                        className="mb-4 w-full hover:bg-primary-500 "
                        variant="outline"
                        onPress={() => handleCardPress(atletica)}
                      >
                        <ButtonText className="text-secondary-600 group-hover/button:text-white">
                          Membros
                        </ButtonText>
                      </Button>

                      <HStack
                        space="md"
                        className="items-center justify-center mb-4"
                      >
                        <Pressable
                          onPress={() => handleEditAtletica(atletica.atletica)}
                        >
                          <Edit className="text-typography-600 " />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            atletica.atletica.id !== undefined &&
                            handleOpenDeleteModal(Number(atletica.atletica.id))
                          }
                        >
                          <Trash className="text-typography-600" />
                        </Pressable>
                      </HStack>
                    </Box>
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