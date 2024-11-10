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
import { ModalMembros } from "./membro-modal";
import { useMembros } from "../../../hooks/MembrosContext";
import { DeleteMembro } from "./delete-membro";
import { MembrosResponse } from "@/interfaces/membros";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";

const MainContent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [membroEmailToDelete, setMembroEmailToDelete] = useState<string | null>(
    null
  );
  const [membroEdicao, setMembroEdicao] = useState<MembrosResponse | null>(
    null
  );
  const { membros, setMembros } = useMembros();

  const handleCadastrarMembroPress = () => {
    setMembroEdicao(null);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setMembroEdicao(null);
  };

  const handleEditMembro = (membro: MembrosResponse) => {
    setMembroEdicao(membro);
    setIsModalVisible(true);
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
          _extra={{ className: "col-span-12 sm:col-span-6 lg:col-span-4" }}
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
                    {item.Usuario?.nome}
                  </Text>
                  <Text className="italic text-gray-700 dark:text-gray-300 line-clamp-1">
                    {item.Usuario?.email}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 line-clamp-1">
                    {item.administrador ? "Administrador" : "Membro"}
                  </Text>
                </VStack>
              </HStack>
              <HStack space="md">
                <Pressable onPress={() => handleEditMembro(item)}>
                  <Icon as={EditIcon} className="text-typography-600" />
                </Pressable>
                <Pressable
                  onPress={() =>
                    handleOpenDeleteModal(item.Usuario?.email ?? "")
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
            onPress={() => handleCadastrarMembroPress()}
          >
            <ButtonText>Cadastrar Membro</ButtonText>
          </Button>
        </VStack>
        {membros && membros.length === 0 ? (
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
        setMembros={setMembros}
        membros={membros}
        editMembro={membroEdicao}
      />
			
      <DeleteMembro
        showModal={isDeleteModalVisible}
        setShowModal={handleCloseDeleteModal}
        email={membroEmailToDelete!}
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
