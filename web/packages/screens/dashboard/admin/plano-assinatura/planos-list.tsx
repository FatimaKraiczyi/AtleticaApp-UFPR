import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { LayoutComponents } from "../../../components/LayoutComponents";
import { MobileFooter } from "../../../components/MobileFooter";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { CartIcon } from "../../assets/cart/index.web";
import { NoItemsFound } from "../../../components/NoItemsFound";
import { LoadingState } from "../../../components/LoadingState";
import Image from "@unitools/image";
import { getProdutoById, getProdutos } from "../../../../../api/produtos";
import type { PlanoAssinatura } from "../../../../../interfaces/planos";
import { ModalPlano } from "./modal-plano";
import { DeletePlano } from "./delete-plano";
import { ViewAssinatura } from "./view-plano";
import { getAllPlanosAssinatura } from "../../../../../api/planos";

export const PlanosList = ({ showActions = false }) => {
  const atleticaId = sessionStorage.getItem("atleticaId");
  const [loading, setLoading] = useState(true);
  const [planoAssinatura, setPlanoAssinatura] = useState<PlanoAssinatura[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanoAssinatura, setSelectedPlanoAssinatura] = useState<
    PlanoAssinatura | undefined
  >(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assinaturaIdToDelete, setAssinaturaIdToDelete] = useState<
    number | null
  >(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchPlanos = async () => {
    setLoading(true);

    try {
      let response;

      if (showActions && atleticaId) {
        response = await getAllPlanosAssinatura();
        if (response.success && response.data?.planoAssinatura) {
          setPlanoAssinatura(response.data.planoAssinatura.atleticaId);
        }
      } else {
        response = await getAllPlanosAssinatura();
        if (response.success && response.data) {
          setPlanoAssinatura(response.data);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  const openModal = (id?: PlanoAssinatura) => {
    setSelectedPlanoAssinatura(id);
    setShowModal(true);
  };

  const openViewModal = (id?: PlanoAssinatura) => {
    setSelectedPlanoAssinatura(id);
    setShowViewModal(true);
  };

  const handleEditProduto = (id: PlanoAssinatura) => {
    openModal(id);
  };

	const handleOpenDeleteModal = (id: number) => {
    setAssinaturaIdToDelete(id);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  const renderNoAssinatura = () => (
    <NoItemsFound message="Nenhum plano de assinatura encontrado." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
        {showActions && (
          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative" onPress={() => openModal()}>
              <ButtonText>Adicionar Plano de Assinatura</ButtonText>
            </Button>
          </VStack>
        )}
        {planoAssinatura.length === 0 ? (
          renderNoAssinatura()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
            <Grid
              className="gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              _extra={{
                className: "",
              }}
            >
              {planoAssinatura.map((plano) => (
                <GridItem
                  key={plano.id}
                  _extra={{ className: "flex-1 p-4 relative" }}
                >
                  <HStack className="w-full justify-between mt-2">
                    <VStack>
                      <Text className="font-semibold text-typography-900">
                        {plano.nome}
                      </Text>
                      <Text className="line-clamp-1">
                        R$ {plano.valor.toFixed(2)}
                      </Text>
                      <Text className="line-clamp-1">
                        Quantidade: {plano.duracao}
                      </Text>
                    </VStack>
                    {showActions && (
                      <HStack space="md" className="mt-2">
                        <Pressable onPress={() => handleEditProduto(plano)}>
                          <Icon as={EditIcon} className="text-typography-600" />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            plano.id !== undefined &&
                            handleOpenDeleteModal(plano.id)
                          }
                        >
                          <Icon
                            as={TrashIcon}
                            className="text-typography-600"
                          />
                        </Pressable>
                      </HStack>
                    )}
                  </HStack>
                  <HStack className="w-full items-center mt-2">
                    <Button
                      variant="outline"
                      className="w-full gap-3 center"
                      onPress={() => openViewModal(plano)}
                    >
                      <ButtonText>Visualizar</ButtonText>
                    </Button>
                  </HStack>
                </GridItem>
              ))}
            </Grid>
          </ScrollView>
        )}
      </VStack>
      <ModalPlano
        showModal={showModal}
        setShowModal={setShowModal}
        refreshPlanos={fetchPlanos}
        planoData={selectedPlanoAssinatura}
      />

      <DeletePlano
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        assinaturaId={assinaturaIdToDelete!}
        refreshPlanos={fetchPlanos}
      />
      <ViewAssinatura
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        planosData={selectedPlanoAssinatura}
      />
    </Box>
  );
};
