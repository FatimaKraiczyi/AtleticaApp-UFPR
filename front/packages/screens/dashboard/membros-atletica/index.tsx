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
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Button, ButtonText } from "@/components/ui/button";
import { MobileHeader } from "../../components/MobileHeader";
import { WebHeader } from "../../components/WebHeader";
import { Sidebar } from "../../components/Sidebar";
import { MobileFooter } from "../../components/MobileFooter";
import { ModalMembros } from "./membro-modal";
import { DeleteModal } from "../gerenciar-atleticas/delete-modal";
import { useMembros } from "../../../hooks/MembrosContext";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [membroToEdit, setMembroToEdit] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [membroEmailToDelete, setMembroEmailToDelete] = useState<string | null>(
    null
  );
  const { membros, setMembros } = useMembros();
  console.log("membros", membros);

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
              onPress={handleCadastrarMembroPress}
            >
              <ButtonText>Cadastrar Membro</ButtonText>
            </Button>
          </VStack>

          <Grid _extra={{ className: "gap-5" }}>
            {membros && membros.length > 0 ? (
              membros.map((item, index) => (
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
                          <Icon
                            as={TrashIcon}
                            className="text-typography-600"
                          />
                        </Pressable>
                      </HStack>
                    </HStack>
                  </VStack>
                </GridItem>
              ))
            ) : (
              <Text className="text-center">Nenhum membro encontrado.</Text>
            )}
          </Grid>
        </VStack>
      </ScrollView>

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

      {/* <DeleteModal
        showModal={isDeleteModalVisible}
        setShowModal={handleCloseDeleteModal}
        membroEmail={membroEmailToDelete!}
        updateMembrosList={updateMembrosList}
      /> */}
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
