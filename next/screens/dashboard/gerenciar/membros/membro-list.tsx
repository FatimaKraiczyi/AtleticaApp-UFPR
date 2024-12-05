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
import { Membro, MembrosResponse } from "@/interfaces/membros";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";

const AllMembros = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atleticaId") : null;
  const [loading, setLoading] = useState(true);
  const [membros, setMembros] = useState<MembrosResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMembro, setSelectedMembro] = useState<MembrosResponse | undefined>(
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

	const openModal = (membro?: MembrosResponse) => {
		setSelectedMembro(membro);
		setShowModal(true);
	};

  const handleEditMembro = (membro: MembrosResponse) => {
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
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
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
              {" "}
              {membros.map((membro) => (
                <GridItem
                  key={membro.email}
                  className="flex flex-col p-4 bg-white rounded-md shadow-md"
                  _extra={{
                    className: "",
                  }}
                >
                  <VStack className="py-2">
                    <HStack space="xl" className="items-center justify-between">
                      <HStack space="xl" className="items-center">
                        <VStack>
                          <Text className="font-bold text-typography-900 line-clamp-1">
                            {membro.Usuario?.nome}
                          </Text>
                          <Text className="text-sm text-typography-400 line-clamp-1">
                            {membro.Usuario?.email}
                          </Text>
                          <Text className="line-clamp-1 text-md">
                            {membro.administrador === true && "Administrador"}
                          </Text>
                        </VStack>
                      </HStack>

                      {showActions && (
                        <HStack space="md">
                          <Pressable onPress={() => handleEditMembro(membro)}>
                            <Edit className="text-typography-600" />
                          </Pressable>
                          <Pressable
                            onPress={() =>
                              
                              handleOpenDeleteModal(membro.Usuario?.email ?? "")
                            }
                          >
                            <Trash className="text-typography-600" />
                          </Pressable>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
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
