import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Edit, Trash } from "lucide-react";
import { HStack } from "@/components/ui/hstack";
import { ModalMembros } from "./membro-modal";
import { DeleteMembro } from "./delete-membro";
import { getMembros } from "@/api/membros";
import { MembrosResponse } from "@/interfaces/membros";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { useMembros } from "@/hooks/MembroContext";

const AllMembros = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atletica") : null;
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [membroEdicao, setMembroEdicao] = useState<MembrosResponse | null>(
    null
  );
  const [membroEmailToDelete, setMembroEmailToDelete] = useState<string | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { membros, setMembros } = useMembros();
  const [hasFetched, setHasFetched] = useState(false);

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/gerenciar/membros";

  const handleCadastrarMembroPress = () => {
    setMembroEdicao(null);
    setIsModalVisible(true);
  };

  const handleEditMembro = (membro: MembrosResponse) => {
    setMembroEdicao(membro);
    setIsModalVisible(true);
  };

  const handleOpenDeleteModal = (email: string) => {
    setMembroEmailToDelete(email);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    if (hasFetched || !atleticaId) return;
    const fetchMembros = async () => {
      try {
        const response = await getMembros(atleticaId);
        if (response.success && response.data) {
          setMembros(response.data);
        } else {
          console.error("Erro ao buscar membros");
        }
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };
    fetchMembros();
  }, [atleticaId, hasFetched, setMembros]);

  if (loading) {
    return <LoadingState />;
  }

  const renderNoItems = () => (
    <NoItemsFound message="Nenhum membro encontrado." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
        {showActions && (
          <VStack space="lg" className="items-center">
            <Button
              className="gap-3 relative"
              onPress={() => handleCadastrarMembroPress()}
            >
              <ButtonText>Adicionar Membro</ButtonText>
            </Button>
          </VStack>
        )}
        {membros.length === 0 ? (
          renderNoItems()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
            <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {membros.map((membro) => (
                <GridItem
                  key={membro.email}
                  className="flex flex-col p-4 bg-white rounded-md shadow-md"
                >
                  <VStack className="py-2">
                    <HStack space="xl" className="items-center justify-between">
                      <HStack space="xl" className="items-center">
                        <VStack>
                          <Text className="font-bold text-typography-900 line-clamp-1">
                            {membro.Usuario?.nome ?? membro.nome}
                          </Text>
                          <Text className="text-sm text-typography-400 line-clamp-1">
                            {membro.Usuario?.email ?? membro.email}
                          </Text>
                          <Text className="line-clamp-1 text-md">
                            {membro.administrador && "Administrador"}
                          </Text>
                        </VStack>
                      </HStack>
                    </HStack>
                    {showActions && (
                      <HStack
                        space="md"
                        className="items-center justify-center mt-4"
                      >
                        <Pressable onPress={() => handleEditMembro(membro)}>
                          <Edit className="text-typography-600" />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            handleOpenDeleteModal(
                              (membro.email ?? membro.Usuario?.email)!
                            )
                          }
                        >
                          <Trash className="text-typography-600" />
                        </Pressable>
                      </HStack>
                    )}
                  </VStack>
                </GridItem>
              ))}
            </Grid>
          </ScrollView>
        )}
      </VStack>

      <ModalMembros
        showModal={isModalVisible}
        setShowModal={setIsModalVisible}
        setMembros={setMembros}
        membros={membros}
        editMembro={membroEdicao}
      />

      <DeleteMembro
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        email={membroEmailToDelete!}
				setMembros={setMembros}
      />
    </Box>
  );
};

export const MembrosList = () => {
  return <AllMembros />;
};
