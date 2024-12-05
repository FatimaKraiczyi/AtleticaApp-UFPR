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
import { Evento } from "@/interfaces/evento";
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
  eventbrite: "https://cdn.worldvectorlogo.com/logos/eventbrite-1.svg",
};

const plataformasTyped: Plataformas = plataformas;

export const EventsList = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atleticaId") : null;
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventoToDeleteId, setEventoToDeleteId] = useState<number | undefined>(
    undefined
  );
  const [atleticaName, setAtleticaName] = useState<string | null>(null);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const modalidade = pathname.includes("eventos") ? "FESTA" : "JOGO";

  const showActions =
    typeof window !== "undefined" &&
    ["/dashboard/gerenciar/eventos", "/dashboard/gerenciar/jogos"].includes(pathname);

  const fetchEventos = async () => {
    setLoading(true);

    if (typeof window !== "undefined" && atleticaId && !atleticaName) {
      const response = await getAtleticaById(atleticaId);
      if (response.success && response.data) {
        setAtleticaName(response.data.atletica.nome);
      }
    }

    const response = await getAllEventosAPI();
    if (response.success && response.data) {
      const eventosFiltrados = response.data.filter((evento: Evento) =>
        showActions
          ? evento.modalidade === modalidade &&
            evento.atleticaId.toString() === atleticaId
          : evento.modalidade === modalidade
      );

      setEventos(eventosFiltrados);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEventos();
  }, [showActions, modalidade]);

  if (loading) {
    return <LoadingState />;
  }

  const openModal = () => setShowModal(true);

  const handleOpenDeleteModal = (id: number) => {
    setEventoToDeleteId(id);
    setShowDeleteModal(true);
  };

  const renderNoItems = () => (
    <NoItemsFound
      message={`Nenhum ${
        modalidade === "JOGO" ? "jogo" : "evento"
      } encontrado.`}
    />
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
            <Button className="gap-3 relative" onPress={openModal}>
              <ButtonText>
                Adicionar {modalidade === "JOGO" ? "Jogo" : "Evento"}
              </ButtonText>
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
            <Grid className="gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {eventos.map((evento) => {
                const eventoData = evento.data;
                const [ano, mes, dia] = eventoData.split("-");
                const mesAbreviado = mes.substring(0, 3).toUpperCase();
                const diaNumerico = parseInt(dia, 10);

                return (
                  <GridItem
                    key={evento.id}
                    className="flex flex-col p-4 bg-white rounded-md shadow-md"
                  >
                    <Pressable
                      onPress={() => {
                        if (evento.linkPlataformaIngressos) {
                          window.open(evento.linkPlataformaIngressos, "_blank");
                        }
                      }}
                    >
                      <Box className="w-full overflow-hidden rounded-md h-48 relative group">
                        <Image
                          source={
                            evento.linkPlataformaIngressos
                              ? getPlatformImage(evento.linkPlataformaIngressos)
                              : ""
                          }
                          size="full"
                          alt="Imagem do evento"
                          className="w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                        />
                      </Box>
                    </Pressable>

                    <GridItem
                      key={evento.id}
                      className="flex flex-row items-center pt-4 space-x-4"
                    >
                      <Box className="flex flex-col items-center justify-center bg-primary-100 rounded-lg px-6 py-2">
                        <Text className="text-primary-500 font-bold text-sm">
                          {mesAbreviado}
                        </Text>
                        <Text className="text-primary-900 font-extrabold text-2xl">
                          {diaNumerico}
                        </Text>
                      </Box>

                      <VStack className="flex-1">
                        <HStack>
                          <Text className="text-sm text-gray-600">
                            Evento realizado por: {""}
                          </Text>
                          <Text className="text-sm text-gray-600 font-semibold">
                            {atleticaName}
                          </Text>
                        </HStack>
                        <Text className="text-lg font-bold text-gray-900">
                          {evento.descricao}
                        </Text>
                        <HStack>
                          <Text className="text-sm text-gray-600">
                            Local: {""}
                          </Text>
                          <Text className="text-sm text-gray-600 font-semibold">
                            {evento.endereco}
                          </Text>
                        </HStack>
                      </VStack>
                    </GridItem>

                    <VStack className="items-center pt-4">
                      <Button
                        variant="solid"
                        className="w-full"
                        onPress={() => {
                          if (evento.linkPlataformaIngressos) {
                            window.open(
                              evento.linkPlataformaIngressos,
                              "_blank"
                            );
                          }
                        }}
                      >
                        <ButtonText>Visualizar Evento</ButtonText>
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
                  </GridItem>
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
