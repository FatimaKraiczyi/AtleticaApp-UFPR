import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Edit, Trash, Eye } from "lucide-react";
import { format } from "date-fns";
import { HStack } from "@/components/ui/hstack";
import { ModalEvento } from "./event-modal";
import { DeleteEvento } from "./delete-evento";
import { ViewEvento } from "./view-event";
import { Evento } from "@/interfaces/evento";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { getAllEventosAPI, getEventoByIdAPI } from "@/api/evento";
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

const AllEvents = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atleticaId") : null;
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<string | undefined>(
    undefined
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventoToDeleteId, setEventoToDeleteId] = useState<number | undefined>(
    undefined
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [atleticaName, setAtleticaName] = useState<string | null>(null);

  const showActions =
    (typeof window !== "undefined" &&
      window.location.pathname === "/dashboard/admin/eventos") ||
    "/dashboard/admin/jogos";

  const fetchEventos = async () => {
    setLoading(true);

    if (typeof window !== "undefined") {
      const atleticaId = sessionStorage.getItem("atletica");

      if (atleticaId && !atleticaName) {
        const response = await getAtleticaById(Number(atleticaId));
        if (response.success && response.data) {
          setAtleticaName(response.data.atletica.nome);
        }
      }
    }

    const response = await getAllEventosAPI();

    if (response.success && response.data) {
      const eventosFiltrados = atleticaId
        ? response.data.filter(
            (evento: Evento) => evento.atleticaId.toString() === atleticaId
          )
        : response.data;

      setEventos(eventosFiltrados);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  const openModal = () => {
    setShowModal(true);
  };

  const openViewModal = (link?: string) => {
    setSelectedEvento(link);
    setShowViewModal(true);
  };

  const handleOpenDeleteModal = (id: number) => {
    setEventoToDeleteId(id);
    setShowDeleteModal(true);
  };

  const renderNoItems = () => (
    <NoItemsFound message="Nenhum evento encontrado." />
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
            <Grid
              className="gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              _extra={{
                className: "",
              }}
            >
              {eventos.map((evento) => (
                <GridItem
                  key={evento.id}
                  className="flex flex-col p-4 bg-white rounded-md shadow-md"
                  _extra={{
                    className: "",
                  }}
                >
                  <Pressable
                    onPress={() =>
                      openViewModal(evento.linkPlataformaIngressos)
                    }
                  >
                    <Box className="w-full overflow-hidden rounded-md h-48 relative group">
                      <Image
                        source={getPlatformImage(
                          evento.linkPlataformaIngressos
                        )}
                        size="full"
                        alt="Imagem do evento"
                        className="w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                      />
                    </Box>
                  </Pressable>

                  <VStack className="py-2">
                    <HStack>
                      <Text className="text-sm">Vendido por: {""}</Text>
                      <Text className="text-sm font-bold">{atleticaName}</Text>
                    </HStack>
                    <Text className="font-semibold mt-4 text-md text-typography-900">
                      {evento.descricao}
                    </Text>
                    <Text className="font-semibold text-xl ">
                      Dia {format(new Date(evento.data), "dd/MM/yy")} a partir
                      das{" "}
                      {format(new Date(`1970-01-01T${evento.hora}`), "HH:mm")}
                    </Text>
                    <Text className="font-semibold  text-md text-typography-700">
                      R$ {evento.ingresso.toFixed(2)}
                    </Text>
                  </VStack>

                  {showActions ? (
                    <HStack className="w-full items-center justify-between mt-4">
                      <HStack className="items-center">
                        <Pressable
                          onPress={() =>
                            evento.id !== undefined &&
                            handleOpenDeleteModal(evento.id)
                          }
                        >
                          <Trash className="text-typography-600" />
                        </Pressable>
                      </HStack>
                    </HStack>
                  ) : (
                    <Button
                      className="mt-auto w-full py-2 hover:bg-primary-500 "
                      variant="outline"
                      onPress={() =>
                        openViewModal(evento.linkPlataformaIngressos)
                      }
                    >
                      <ButtonText className="text-secondary-600 group-hover/button:text-white">
                        Adquirir Ingresso
                      </ButtonText>
                    </Button>
                  )}
                </GridItem>
              ))}
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
      <ViewEvento
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        produtoData={selectedEvento}
      />
    </Box>
  );
};

export const EventsList = () => {
  return <AllEvents />;
};
