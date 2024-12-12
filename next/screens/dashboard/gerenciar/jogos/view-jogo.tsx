import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { inscricaoEventoAPI } from "@/api/evento";
import { getJogosImage } from "@/mock/imagens_jogos";
import { HStack } from "@/components/ui/hstack";
import useRouter from "@unitools/router";
import { cancelarInscricaoAPI } from "@/api/evento";

interface ViewJogoProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  eventoData?: any;
	refreshEventos: () => void; 
}

export const ViewJogo = ({
  showModal,
  setShowModal,
  eventoData,
	refreshEventos,
}: ViewJogoProps) => {
  const [isParticipando, setIsParticipando] = useState(false);
  const [isCancelando, setIsCancelando] = useState(false);
  const router = useRouter();

  const showMeusJogosButton =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/visualizar/meus-jogos";

  const handleParticipar = async () => {
    if (eventoData) {
      setIsParticipando(true);
      const response = await inscricaoEventoAPI(eventoData.id);
      setIsParticipando(false);

      if (response.success) {
        setShowModal(false);
				refreshEventos();
        router.push("/dashboard/visualizar/meus-jogos");
      }
    }
  };

  const handleCancelarParticipacao = async () => {
    if (eventoData) {
      setIsCancelando(true);
      const response = await cancelarInscricaoAPI(eventoData.id);
      setIsCancelando(false);

      if (response.success) {
        setShowModal(false);
				refreshEventos();
        router.push("/dashboard/visualizar/meus-jogos");
      }
    }
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

  const formatData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia} de ${getMesPorExtenso(mes)}`;
  };

  const formatHora = (hora: string) => {
    const [hh, min] = hora.split(":");
    return `${hh}:${min} horas`;
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
      <ModalBackdrop />
      {eventoData && (
        <ModalContent>
          <Box className={"w-full h-[110px] "}>
            <Image
              source={require("@/assets/dashboard/headermodal.png")}
              size="full"
              alt="Banner Image"
            />
          </Box>
          <ModalHeader className="absolute w-full flex justify-end">
            <ModalCloseButton onPress={() => setShowModal(false)}>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>

          <Center className="w-full absolute top-10 align-center">
            <Heading size="2xl" className="text-typography-900">
              {eventoData.titulo}
            </Heading>
          </Center>

          <ModalBody className="max-h-[80vh] overflow-y-auto p-4">
            <HStack space="md" className="w-full items-center justify-start">
              <Image
                source={
                  eventoData.titulo ? getJogosImage(eventoData.titulo) : ""
                }
                size="xl"
                alt="Imagem do jogo"
                className=" rounded-full"
              />
              <VStack className="p-4 rounded-lg max-w-[360px] space-y-3 text-left">
                <HStack>
                  <Text size="sm">Realização: </Text>{" "}
                  <Heading size="xs" className="color-violet-600">
                    {eventoData.atleticaName}
                  </Heading>
                </HStack>
                <Text size="sm" className="text-typography-400">
                  {eventoData.descricao}
                </Text>
                <Text className="text-gray-600 text-typography-400">
                  Dia {formatData(eventoData.data)} às{" "}
                  {formatHora(eventoData.hora)}
                </Text>
                <Text className="text-md text-gray-600 sm:text-left">
                  Local: {eventoData.endereco}
                </Text>
                <Text className="text-sm font-semibold text-gray-900 pt-2">
                  {eventoData.qtdeVagas} vagas disponíveis
                </Text>
              </VStack>
            </HStack>

            {showMeusJogosButton ? (
              <Button
                className="mt-4 w-full bg-red-500 hover:bg-red-600"
                onPress={handleCancelarParticipacao}
                disabled={isCancelando}
              >
                <ButtonText className="text-white">
                  Cancelar Participação
                </ButtonText>
              </Button>
            ) : (
              <Button
                className="mt-4 w-full bg-primary-500 hover:bg-primary-600"
                onPress={handleParticipar}
                disabled={isParticipando}
              >
                <ButtonText className="text-white">Participar</ButtonText>
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
};
