import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Trash } from "lucide-react";
import { HStack } from "@/components/ui/hstack";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { ModalJogo } from "./jogo-modal";
import { DeleteJogo } from "./delete-jogo";
import { getAllEventosAPI } from "@/api/evento";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { ViewJogo } from "./view-jogo";
import { getJogosImage } from "@/mock/imagens_jogos";
import { getEventosByUserAPI } from "@/api/evento";

export const JogosList = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atletica") : null;
  const [loading, setLoading] = useState(true);
  const [jogos, setEventos] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventoToDeleteId, setEventoToDeleteId] = useState<number | undefined>(
    undefined
  );
  const [eventoData, setEventoData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/gerenciar/jogos";

  const showMeusJogosButton =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/visualizar/jogos";

  const fetchEventos = async () => {
    setLoading(true);

    try {
      let response;
      if (window.location.pathname === "/dashboard/visualizar/meus-jogos") {
        response = await getEventosByUserAPI();
      } else {
        response = await getAllEventosAPI();
      }

      if (response.success && response.data) {
        const eventosFiltrados = response.data.filter((jogo: any) =>
          showActions
            ? jogo.modalidade === "JOGO" &&
              jogo.atleticaId.toString() === atleticaId
            : jogo.modalidade === "JOGO"
        );

        setEventos(eventosFiltrados);
      } else {
        console.log("Nenhum jogo encontrado");
        setEventos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    } finally {
      setLoading(false);
    }
  };

  const openViewJogoModal = (jogo: any) => {
    setEventoData(jogo);
    setShowViewModal(true);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  const openModal = () => setShowModal(true);

  const handleOpenDeleteModal = (id: number) => {
    setEventoToDeleteId(id);
    setShowDeleteModal(true);
  };

  const renderNoItems = () => (
    <NoItemsFound message={`Nenhum jogo encontrado`} />
  );

  const formatHora = (hora: string) => {
    const [hh, min] = hora.split(":");
    return `${hh}:${min} horas`;
  };

  const getMesPorExtenso = (mes: string) => {
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    const mesIndex = parseInt(mes, 10) - 1;
    return meses[mesIndex] || "Mês inválido";
  };

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {showMeusJogosButton && (
          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative">
              <ButtonText>Meus jogos</ButtonText>
            </Button>
          </VStack>
        )}
        {showActions && (
          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative" onPress={() => openModal()}>
              <ButtonText>Adicionar Jogo</ButtonText>
            </Button>
          </VStack>
        )}
        {jogos.length === 0 ? (
          renderNoItems()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
            <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-5 gap-10">
              {jogos.map((jogo) => {
                const eventoData = jogo.data;
                const [ano, mes, dia] = eventoData.split("-");
                const mesPorExtenso = getMesPorExtenso(mes);
                const diaNumerico = parseInt(dia, 10);

                return (
                  <Box
                    key={jogo.id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <Box className="w-full h-36 bg-violet-600 flex items-center justify-center">
                      <Image
                        source={jogo.titulo ? getJogosImage(jogo.titulo) : ""}
                        size="sm"
                        alt="Imagem do jogo"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </Box>

                    <Card
                      className="p-4 rounded-lg max-w-[360px] space-y-3"
                      key={jogo.id}
                    >
                      <Box>
                        <Heading size="md">{jogo.titulo}</Heading>
                        <HStack>
                          <Text size="sm">Realização: </Text>{" "}
                          <Heading size="xs" className="color-violet-600">
                            {jogo.atleticaName}
                          </Heading>
                        </HStack>
                      </Box>

                      <VStack>
                        <HStack className="space-4 items-center justify-between">
                          <HStack className="align-center">
                            <Text className="text-gray-600 text-typography-400">
                              Dia {diaNumerico} de {mesPorExtenso} às{" "}
                              {formatHora(jogo.hora)}
                            </Text>
                          </HStack>
                        </HStack>

                        <Text className="text-md text-gray-600  pt-2 sm:text-left">
                          Local: {jogo.endereco}
                        </Text>
                      </VStack>
                    </Card>
                    <VStack className="items-center px-4 pb-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onPress={() => openViewJogoModal(jogo)}
                      >
                        <ButtonText>Ver mais</ButtonText>
                      </Button>

                      {showActions && (
                        <HStack space="md" className="p-2 mt-2">
                          <Pressable
                            onPress={() =>
                              jogo.id !== undefined &&
                              handleOpenDeleteModal(jogo.id)
                            }
                          >
                            <Trash className="text-typography-600" />
                          </Pressable>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </Grid>
          </ScrollView>
        )}
      </VStack>

      <ModalJogo
        showModal={showModal}
        setShowModal={setShowModal}
        refreshEventos={fetchEventos}
      />

      <DeleteJogo
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        id={eventoToDeleteId}
        refreshEventos={fetchEventos}
      />
      <ViewJogo
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        eventoData={eventoData}
        refreshEventos={fetchEventos}
      />
    </Box>
  );
};
