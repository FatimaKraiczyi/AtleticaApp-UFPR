import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Edit, Trash, Eye } from "lucide-react";
import { HStack } from "@/components/ui/hstack";
import { ModalMembros } from "./membro-modal";
import { DeleteMembro } from "./delete-membro";
import { Image } from "@/components/ui/image";
import { getMembros } from "@/api/membros";
import { Membro, MembrosResponse } from "@/interfaces/membros";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { addCartProduct } from "@/api/carrinho";
import { useCarrinho } from "@/hooks/CarrinhoContext";

const AllMembros = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atleticaId") : null;
  const [loading, setLoading] = useState(true);
  const [membros, setMembros] = useState<MembrosResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMembro, setSelectedMembro] = useState<Membro | undefined>(
    undefined
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [membroToDelete, setMembroToDelete] = useState<string | undefined>(
    undefined
  );

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/gerenciar/membros";

  const fetchMembros = async () => {
    setLoading(true);

    if (atleticaId) {
      const response = await getMembros(atleticaId);
      if (response.success && response.data) {
        setMembros(response.data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembros();
  }, []);

  const openModal = (membro?: Membro) => {
    setSelectedMembro(membro);
    setShowModal(true);
  };

  const handleEditMembro = (membro?: Membro) => {
    openModal(membro);
  };

  const handleOpenDeleteModal = (email: string) => {
    setMembroToDelete(email);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  const renderNoItems = () => (
    <NoItemsFound message="Nenhum membro encontrado." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {showActions && (
          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative" onPress={() => openModal()}>
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
            <Grid
              className="gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              _extra={{
                className: "",
              }}
            >
              {membros.map((membro) => (
                <GridItem
                  key={membro.email}
                  className="flex flex-col p-4 bg-white rounded-md shadow-md"
                  _extra={{
                    className: "",
                  }}
                >
                  <VStack className="py-2">
                    <HStack>
                      <Text className="text-sm">Nome: {""}</Text>
                      <Text className="text-sm font-bold">
                        {membro.Usuario?.nome}
                      </Text>
                    </HStack>
                    <Text className="font-semibold text-xl mt-4">
                      {membro.email}
                    </Text>
                    <Text className="text-sm">
                      {membro.administrador ? "Administrador" : "Membro"}
                    </Text>
                  </VStack>

                  {showActions && (
                    <HStack className="w-full items-center justify-between mt-4">
                      <HStack className="items-center">
                        <Pressable onPress={() => handleEditMembro()}>
                          <Edit className="text-typography-600 mr-4" />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            membro.email !== undefined &&
                            handleOpenDeleteModal(membro.email)
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
      <ModalMembros
        showModal={showModal}
        setShowModal={setShowModal}
        refreshMembros={fetchMembros}
        membroData={selectedMembro}
      />
      <DeleteMembro
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        email={membroToDelete}
        refreshMembros={fetchMembros}
      />
    </Box>
  );
};

export const MembrosList = () => {
  return <AllMembros />;
};
