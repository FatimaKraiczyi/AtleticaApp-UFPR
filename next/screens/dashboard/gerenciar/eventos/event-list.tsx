import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Trash } from "lucide-react";
import { HStack } from "@/components/ui/hstack";
import { ModalEvento } from "./event-modal";
import { DeleteEvento } from "./delete-evento";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { getAllEventosAPI } from "@/api/evento";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";

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
            <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-5 gap-10">
              {eventos.map((evento) => {
                const eventoData = evento.data;
                const [ano, mes, dia] = eventoData.split("-");
                const mesPorExtenso = getMesPorExtenso(mes);
                const diaNumerico = parseInt(dia, 10);

                return (
                  <Box
                    key={evento.id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <Box className="w-full h-36 bg-violet-600 flex items-center justify-center">
                      {evento.linkPlataformaIngressos ? (
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
                      ) : (
                        <Image
                          source={require("@/assets/dashboard/image2.png")}
                          alt="Imagem vazia"
                          size="sm"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      )}
                    </Box>

                    <Card
                      key={evento.id}
                      className="p-4 rounded-lg max-w-[360px] space-y-3"
                    >
                      <Box>
                        <Heading size="md">{evento.titulo}</Heading>
                        <HStack>
                          <Text size="sm">Realização: </Text>{" "}
                          <Heading size="xs" className="color-violet-600">
                            {evento.atleticaName}
                          </Heading>
                        </HStack>
                      </Box>

                      <VStack>
                        <HStack className="space-4 items-center justify-between">
                          <HStack className="align-center">
                            <Text className="text-gray-600 text-typography-400">
                              Dia {diaNumerico} de {mesPorExtenso} às{" "}
                              {formatHora(evento.hora)}
                            </Text>
                          </HStack>
                        </HStack>

                        <Text className="text-md text-gray-600  pt-2 sm:text-left">
                          Local: {evento.endereco}
                        </Text>
												<Text className="font-semibold text-2xl pt-2 text-typography-900 text-green-600">
                          R$ {evento.ingresso}
                        </Text>
                      </VStack>
                    </Card>

                    <VStack className="items-center px-4 pb-4">
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
                        <HStack space="md" className="p-2 mt-2">
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
