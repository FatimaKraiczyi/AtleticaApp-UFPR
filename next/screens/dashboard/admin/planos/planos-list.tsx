import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { ModalPlano } from "./modal-plano";
import { DeletePlano } from "./delete-plano";
import { ViewPlano } from "./view-plano";
import { getPlanoByAtleticaId, getPlanos } from "@/api/planos";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { PlanoAssinatura } from "@/interfaces/planos";
import { ChevronDown, ChevronUp } from "lucide-react-native";

const AllPlanos = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atleticaId") : null;
  const [loading, setLoading] = useState(true);
  const [planos, setPlanos] = useState<PlanoAssinatura[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlano, setSelectedPlano] = useState<
    PlanoAssinatura | undefined
  >(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planoIdToDelete, setPlanoIdToDelete] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [expandedPlanos, setExpandedPlanos] = useState<Set<number>>(new Set());

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/admin/planos";

  const fetchPlanos = async () => {
    setLoading(true);

    try {
      let response;

      if (showActions && atleticaId) {
        response = await getPlanoByAtleticaId(atleticaId);
        if (response.success && Array.isArray(response.data)) {
          setPlanos(response.data);
        }
      } else {
        response = await getPlanos();
        if (response.success && Array.isArray(response.data.planos)) {
          setPlanos(response.data.planos);
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
    setSelectedPlano(id);
    setShowModal(true);
  };

  const handleEditProduto = (id: PlanoAssinatura) => {
    openModal(id);
  };

  const handleOpenDeleteModal = (id: number) => {
    setPlanoIdToDelete(id);
    setShowDeleteModal(true);
  };

  const toggleExpand = (planoId: number) => {
    setExpandedPlanos((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(planoId)) {
        newExpanded.delete(planoId);
      } else {
        newExpanded.add(planoId);
      }
      return newExpanded;
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  const openViewModal = (plano?: PlanoAssinatura) => {
    setSelectedPlano(plano);
    setShowViewModal(true);
  };

  const renderNoAssinatura = () => (
    <NoItemsFound message="Nenhum plano de assinatura encontrado." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {showActions && (
          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative" onPress={() => openModal()}>
              <ButtonText>Adicionar Plano de Assinatura</ButtonText>
            </Button>
          </VStack>
        )}
        {planos.length === 0 ? (
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
              {planos.map((plano) => (
                <GridItem
                  key={plano.id}
                  className="flex-1 p-6 rounded-md shadow-lg bg-white"
                  _extra={{
                    className: "",
                  }}
                >
                  <VStack className="items-center">
									<Text className="text-sm font-bold">
                     {plano.atleticaNome}
                    </Text>
                    <Text className="text-gray-500 font-semibold text-sm uppercase">
                      {plano.nome.toUpperCase()}
                    </Text>
                    <Text className="font-bold text-3xl mt-2">
                      R$ {plano.valor.toFixed(2)}
                    </Text>
                    <Text className="text-gray-500 text-sm mb-4">
                      /{" "}
                      {plano.duracao === 30 ? "mês" : `${plano.duracao} meses`}
                    </Text>

                    <Button
                      variant="link"
                      className="text-gray-500 text-sm "
                      onPress={() => toggleExpand(plano.id)}
                    >
                      <span>Veja os benefícios</span>
                      {expandedPlanos.has(plano.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>

                    {expandedPlanos.has(plano.id) && (
                      <VStack space="lg" className="items-center">
                        {plano.beneficios &&
                          plano.beneficios.map((beneficio, index) => (
                            <Text key={index} className="text-gray-700 text-sm">
                              ✔️ {beneficio}
                            </Text>
                          ))}
                      </VStack>
                    )}
                  </VStack>
                  <VStack className="items-center">
                    <Button
                      variant="solid"
                      className="w-full"
                      onPress={() => openViewModal(plano)}
                    >
                      <ButtonText>Seja sócio</ButtonText>
                    </Button>

                    {showActions && (
                      <HStack space="md">
                        <Pressable onPress={() => handleEditProduto(plano)}>
                          <Icon as={EditIcon} className="text-gray-600" />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            plano.id !== undefined &&
                            handleOpenDeleteModal(plano.id)
                          }
                        >
                          <Icon as={TrashIcon} className="text-gray-600" />
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
      <ModalPlano
        showModal={showModal}
        setShowModal={setShowModal}
        refreshPlanos={fetchPlanos}
        planoData={selectedPlano}
      />
      <DeletePlano
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        planoId={planoIdToDelete!}
        refreshPlanos={fetchPlanos}
      />
      <ViewPlano
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        planosData={selectedPlano}
      />
    </Box>
  );
};

export const PlanosList = () => {
  return <AllPlanos />;
};
