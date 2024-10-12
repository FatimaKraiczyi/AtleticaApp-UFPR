import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { useState } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Grid, GridItem } from "@/components/ui/grid";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Button, ButtonText } from "@/components/ui/button";
import { MobileFooter } from "../../components/MobileFooter";
import { ModalMembros } from "./membro-modal";
import { useMembros } from "../../../hooks/MembrosContext";
import { LayoutComponents } from "../../components/LayoutComponents";
import { DeleteMembro } from "./delete-membro";
import { NoItemsFound } from "../../components/NoItemsFound";

const MainContent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [membroToEdit, setMembroToEdit] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [membroEmailToDelete, setMembroEmailToDelete] = useState<string | null>(
    null
  );
  const { membros, setMembros } = useMembros();

  const handleCadastrarMembroPress = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    setMembroToEdit(null);
  };

  const handleEditMembroPress = (membro: any) => {
    setIsModalVisible(true);
    setIsEditMode(true);
    setMembroToEdit(membro);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleOpenDeleteModal = (email: string) => {
    setMembroEmailToDelete(email);
    setIsDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setMembroEmailToDelete(null);
  };

  const renderNoMembers = () => (
    <NoItemsFound message="Nenhum membro encontrado." />
  );

  const renderMembers = () => (
    <Grid _extra={{ className: "gap-5" }}>
      {membros.map((item, index) => (
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
                  <Text className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {item.Usuario.nome}
                  </Text>
                  <Text className="italic text-gray-700 dark:text-gray-300 line-clamp-1">
                    {item.Usuario.email}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 line-clamp-1">
                    {item.administrador ? "Administrador" : "Membro"}
                  </Text>
                </VStack>
              </HStack>
              <HStack space="md">
                <Pressable
                  onPress={() =>
                    item.Usuario?.email !== undefined &&
                    handleEditMembroPress(item)
                  }
                >
                  <Icon as={EditIcon} className="text-typography-600" />
                </Pressable>
                <Pressable
                  onPress={() =>
                    item.Usuario?.email !== undefined &&
                    handleOpenDeleteModal(item.Usuario.email)
                  }
                >
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
            className="gap-3 relative"
            onPress={handleCadastrarMembroPress}
          >
            <ButtonText>Cadastrar Membro</ButtonText>
          </Button>
        </VStack>
        {membros.length === 0 ? (
          renderNoMembers()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: isWeb ? 0 : 100,
              flexGrow: 1,
            }}
            className="flex-1 mb-20 md:mb-2"
          >
            {renderMembers()}
          </ScrollView>
        )}
      </VStack>
      <ModalMembros
        showModal={isModalVisible}
        setShowModal={handleCloseModal}
        editMembro={(membroEditado) => {
          const novosMembros = membros.map((membro) =>
            membro.email === membroEditado.email ? membroEditado : membro
          );
          setMembros(novosMembros);
        }}
        membroData={isEditMode && membroToEdit ? membroToEdit : undefined}
        addMembros={handleCadastrarMembroPress}
      />

      <DeleteMembro
        showModal={isDeleteModalVisible}
        setShowModal={handleCloseDeleteModal}
        email={membroEmailToDelete!}
        setMembros={setMembros}
      />
    </Box>
  );
};

export const GerenciarMembros = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Membros" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
