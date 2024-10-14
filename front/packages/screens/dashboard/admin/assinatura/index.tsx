
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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useRouter from "@unitools/router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Button, ButtonText } from "@/components/ui/button";
import { MobileFooter } from "../../../components/MobileFooter";
import { ModalAssinatura } from "./modal-assinatura";
import { DeleteAssinaturas } from "./delete-assinatura";
import { getAssinatura } from "../../../api/assinatura";
import type { Assinatura, AssinaturaResponse } from "../../../interfaces/assinatura";
import { LayoutComponents } from "../../../components/LayoutComponents";
import { LoadingState } from "../../../components/LoadingState";
import { NoItemsFound } from "../../../components/NoItemsFound";

const MainContent = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [assinaturaToEdit, setAssinaturaToEdit] = useState<Assinatura | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [assinaturaIdToDelete, setAssinaturaIdToDelete] = useState<number | null>(null);

  const handleCadastrarAssinaturaPress = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    setAssinaturaToEdit(null);
  };

  const handleEditAssinaturaPress = (assinatura: Assinatura) => {
    setIsModalVisible(true);
    setIsEditMode(true);
    setAssinaturaToEdit(assinatura);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleOpenDeleteModal = (id: number) => {
    setAssinaturaIdToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setAssinaturaIdToDelete(null);
  };

  const updateAssinaturasList = async () => {
    try {
      const response = await getAssinatura();
      if (response.success && response.data) {
        setAssinaturas(response.data);
      } else {
        console.error("Erro ao buscar assinaturas");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateAssinaturasList();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  const renderNoAssinaturas = () => (
    <NoItemsFound message="Nenhuma assinatura encontrada." />
  );

  const renderAssinaturas = () => (
    <Grid _extra={{ className: "gap-5" }}>
      {assinaturas.map((item, index) => (
        <GridItem _extra={{className: "col-span-12 sm:col-span-6 lg:col-span-4",}}key={index}>
          <VStack
            space="md" className="border border-border-300 rounded-lg p-4">
            <HStack space="xl" className="items-center justify-between">
              <HStack space="xl" className="items-center">
                <VStack>
                  <Text className="font-semibold text-typography-900 line-clamp-1">{item.assinatura.nome}</Text>
                  <Text className="line-clamp-1">{item.assinatura.descricao}</Text>
                  <Text className="line-clamp-1">{item.assinatura.valor}</Text>
                  <Text className="line-clamp-1">{item.assinatura.duracao}</Text>
                </VStack>
              </HStack>

                <HStack space="md">
                  <Pressable onPress={() => handleEditAssinaturaPress(item.assinatura)}>
                    <Icon as={EditIcon} className="text-typography-600" />
                  </Pressable>
                  <Pressable onPress={() =>
                      item.assinatura.id !== undefined && handleOpenDeleteModal(item.assinatura.id)}>
                    <Icon as={TrashIcon} className="text-typography-600" />
                  </Pressable>
                </HStack>
            </HStack>
          </VStack>
        </GridItem>
      ))}
    </Grid>
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
        <VStack space="lg" className="items-center">
            <Button
              className="gap-3 relative" onPress={handleCadastrarAssinaturaPress}>
              <ButtonText>Cadastrar Assinatura</ButtonText>
            </Button>
        </VStack>
        {assinaturas.length === 0 ? renderNoAssinaturas() : (
          <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
              paddingBottom: isWeb ? 0 : 100,
              flexGrow: 1,
            }} className="flex-1 mb-20 md:mb-2">
            {renderAssinaturas()}
          </ScrollView>
        )}
      </VStack>
      <ModalAssinatura
        showModal={isModalVisible}
        setShowModal={handleCloseModal}
        addAssinatura={updateAssinaturasList}
        editAssinatura={updateAssinaturasList}
        assinaturaData={isEditMode && assinaturaToEdit ? assinaturaToEdit : undefined}
      />

      <DeleteAssinaturas
        showModal={isDeleteModalVisible}
        setShowModal={handleCloseDeleteModal}
        assinaturaId={assinaturaIdToDelete!}
        updateAssinaturaList={updateAssinaturasList}
      />
    </Box>
  );
};

export const Assinaturas = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Assinaturas" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
