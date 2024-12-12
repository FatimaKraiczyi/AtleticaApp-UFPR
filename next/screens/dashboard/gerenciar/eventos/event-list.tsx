import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Trash } from "lucide-react";
import { HStack } from "@/components/ui/hstack";
import { ModalEvento } from "./event-modal";
import { DeleteEvento } from "./delete-evento";
import { Evento, EventoResponse } from "@/interfaces/evento";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { getAllEventosAPI } from "@/api/evento";
import { getAtleticaById } from "@/api/atleticas";

interface Plataformas {
  [key: string]: any;
}

const plataformas = {
  sympla:
    "https://blog.sympla.com.br/wp-content/uploads/2022/09/banner-sympla-1.jpg",
};

const plataformasTyped: Plataformas = plataformas;

export const EventsList = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atletica") : null;
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventoToDeleteId, setEventoToDeleteId] = useState<number | undefined>(
    undefined
  );
  const [showModal, setShowModal] = useState(false);

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/gerenciar/eventos";

  const fetchEventos = async () => {
    setLoading(true);

    try {
      const response = await getAllEventosAPI();

      if (response.success && response.data) {
        const eventosFiltrados = response.data.filter((evento: any) =>
          showActions
            ? evento.modalidade === "FESTA" &&
              evento.atleticaId.toString() === atleticaId
            : evento.modalidade === "FESTA"
        );

        setEventos(eventosFiltrados);
      } else {
        console.log("Nenhum evento encontrado");
        setEventos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
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
    <NoItemsFound message={`Nenhum evento encontrado`} />
  );

  const getPlatformImage = (url: string) => {
    const domain = new URL(url).hostname.replace("www.", "");
    return (
      plataformasTyped[
        Object.keys(plataformasTyped).find((key) => domain.includes(key))!
      ] ||
      "https://t3.ftcdn.net/jpg/01/22/43/68/360_F_122436844_5TQ5cZcIQI3pfxJFnU17KbWYQF8bQcSM.jpg"
    );
  };

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {showActions && (
          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative" onPress={() => openModal()}>
              <ButtonText>Adicionar Evento</ButtonText>
            </Button>
          </VStack>
        )}
        {eventos.length === 0 ? (
          renderNoItems()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
                         <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-10">

              {eventos.map((evento) => {
                const eventoData = evento.data;
                const [ano, mes, dia] = eventoData.split("-");
                const mesAbreviado = mes.substring(0, 3).toUpperCase();
                const diaNumerico = parseInt(dia, 10);

                return (
                  <Box
                    key={evento.id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <Pressable
                      onPress={() => {
                        if (evento.linkPlataformaIngressos) {
                          window.open(evento.linkPlataformaIngressos);
                        }
                      }}
                    >
                      <Box className="w-full h-36 bg-violet-600 flex items-center justify-center">
                        <Image
                          source={
                            evento.linkPlataformaIngressos
                              ? getPlatformImage(evento.linkPlataformaIngressos)
                              : ""
                          }
                          size="sm"
                          alt="Imagem do evento"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </Box>
                    </Pressable>

                    <GridItem
                      key={evento.id}
                      className="flex flex-row items-center  p-4 space-x-4"
                    >
                      <VStack>
                        <Box className="flex flex-col items-center justify-center bg-primary-100 rounded-lg px-6 py-2">
                          <Text className="text-primary-500 font-bold text-sm">
                            {mesAbreviado}
                          </Text>
                          <Text className="text-primary-900 font-extrabold text-2xl">
                            {diaNumerico}
                          </Text>
                        </Box>

                        <Text className="text-sm text-gray-600 text-center pt-2 sm:text-left">
                          Local: {evento.endereco}
                        </Text>
                      </VStack>

                      <VStack>
                        <Box className="flex flex-col items-center justify-center px-6 py-2">
                          <Text className="text-sm text-center text-gray-600">
                            Evento realizado por:{" "}
                          </Text>
                          <Text className="text-sm text-gray-600 font-semibold">
                            {evento.atleticaName}
                          </Text>
                          <Text className="text-lg font-bold text-center text-gray-900 truncate">
                            {evento.titulo}
                          </Text>

                          <Text className="text-sm text-gray-600">Valor:</Text>
                          <Text className="text-sm font-semibold text-gray-900">
                            {evento.valor}
                          </Text>
                        </Box>
                      </VStack>
                    </GridItem>
                    <VStack className="items-center p-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onPress={() => {
                          if (evento.linkPlataformaIngressos) {
                            window.open(evento.linkPlataformaIngressos);
                          }
                        }}
                      >
                        <ButtonText>Ver mais</ButtonText>
                      </Button>

                      {showActions && (
                        <HStack space="md" className="pt-4">
                          <Pressable
                            onPress={() =>
                              evento.id !== undefined &&
                              handleOpenDeleteModal(evento.id)
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

      <ModalEvento
        showModal={showModal}
        setShowModal={setShowModal}
        refreshEventos={fetchEventos}
      />

      <DeleteEvento
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        id={eventoToDeleteId}
        refreshEventos={fetchEventos}
      />
    </Box>
  );
};
