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
import { useMembros } from "../../../hooks/MembrosContext";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { LoadingState } from "@/components/sections/LoadingState";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { Atletica, AtleticaResponse } from "@/interfaces/atleticas";

const MainContent = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [atleticaToEdit, setAtleticaToEdit] = useState<Atletica | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [atleticas, setAtleticas] = useState<AtleticaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [atleticaIdToDelete, setAtleticaIdToDelete] = useState<number | null>(
    null
  );
  const { setMembros } = useMembros();

  const userType =
    typeof window !== "undefined" ? sessionStorage.getItem("userType") : null;

  const handleCardPress = async (atleticaId: string) => {
    const response = await getMembros(atleticaId);
    if (response.success) {
      if (response.data) {
        setMembros(response.data);
      } else {
        console.error("Dados dos membros não encontrados");
      }
    }
    router.push("/dashboard/membros");
  };

  const handleViewAtletica = async (atleticaId: number) => {
    const response = await getAtleticaById(atleticaId);
    if (response.success) {
      if (response.data) {
        setMembros(response.data);
      }
    }
    router.push("/dashboard/membros");
  };

  const handleCadastrarAtleticaPress = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    setAtleticaToEdit(null);
  };

  const handleEditAtleticaPress = (atletica: Atletica) => {
    setIsModalVisible(true);
    setIsEditMode(true);
    setAtleticaToEdit(atletica);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleOpenDeleteModal = (id: number) => {
    setAtleticaIdToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setAtleticaIdToDelete(null);
  };

  const updateAtleticasList = async () => {
    try {
      const response = await getAtletica();
      if (response.success && response.data) {
        setAtleticas(response.data);
      } else {
        console.error("Erro ao buscar atléticas");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateAtleticasList();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  const renderNoAtleticas = () => (
    <NoItemsFound message="Nenhuma atlética encontrada." />
  );

  const renderAtleticas = () => (
    <Grid
      className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      _extra={{
        className: "gap-5",
      }}
    >
      {atleticas.map((item, index) => (
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
              source={
                item.atletica.imagem || require("@/assets/dashboard/image2.png")
              }
              className="w-20 h-20 mx-auto rounded-full"
            />
          </Box>
          <Box className="p-4 md:h-[180px]">
            <Text className="text-lg font-semibold">{item.atletica.nome}</Text>
            <Text className="text-sm text-gray-500">
              {item.atletica.descricao}
            </Text>
            <Text className="line-clamp-1">
              Atividades: {item.atletica.atividades}
            </Text>
            {item.cursos && (
              <Text className="line-clamp-1">
                Cursos: {item.cursos.map((curso) => curso.nome).join(", ")}
              </Text>
            )}
            {userType === "master" ? (
              <HStack space="md">
                <Pressable
                  onPress={() => handleEditAtleticaPress(item.atletica)}
                >
                  <Icon as={EditIcon} className="text-typography-600" />
                </Pressable>
                <Pressable
                  onPress={() =>
                    item.atletica.id !== undefined &&
                    handleOpenDeleteModal(item.atletica.id)
                  }
                >
                  <Icon as={TrashIcon} className="text-typography-600" />
                </Pressable>
              </HStack>
            ) : (
              <Button
                className="md:mt-auto mt-4 hover:bg-primary-500 py-2"
                variant="outline"
                onPress={() => handleViewAtletica(item.atletica.id)}
              >
                <ButtonText className="text-secondary-600 group-hover/button:text-white">
                  Ver Mais
                </ButtonText>
              </Button>
            )}
            {userType === "master" && (
              <Button
                variant="outline"
                className="gap-3 relative"
                onPress={() => handleCardPress(String(item.atletica.id))}
              >
                <ButtonText>Gerenciar Membros</ButtonText>
              </Button>
            )}
          </Box>
        </GridItem>
      ))}
    </Grid>
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        <VStack space="lg" className="items-center">
          {userType === "master" && (
            <Button
              className="gap-3 relative"
              onPress={handleCadastrarAtleticaPress}
            >
              <ButtonText>Cadastrar Atlética</ButtonText>
            </Button>
          )}
        </VStack>
        {atleticas.length === 0 ? (
          renderNoAtleticas()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: isWeb ? 0 : 100,
              flexGrow: 1,
            }}
            className="flex-1 mb-20 md:mb-2"
          >
            {renderAtleticas()}
          </ScrollView>
        )}
      </VStack>
      <ModalAtletica
        showModal={isModalVisible}
        setShowModal={handleCloseModal}
        addAtletica={updateAtleticasList}
        editAtletica={updateAtleticasList}
        atleticaData={isEditMode && atleticaToEdit ? atleticaToEdit : undefined}
      />

      <DeleteAtletica
        showModal={isDeleteModalVisible}
        setShowModal={handleCloseDeleteModal}
        atleticaId={atleticaIdToDelete!}
        updateAtleticasList={updateAtleticasList}
      />
    </Box>
  );
};

export const GerenciarAtleticas = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Atléticas" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
