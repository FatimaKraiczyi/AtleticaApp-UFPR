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
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";

interface ViewJogoProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  eventoData?: any;
}

export const ViewJogo = ({
  showModal,
  setShowModal,
  eventoData,
}: ViewJogoProps) => {

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
      <ModalBackdrop />
      {eventoData && (
				
        <ModalContent>
          <Box className={"w-full h-[110px] "}>
            <Image
              source={require("@/assets/profile-screens/profile/image2.png")}
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
              {eventoData.descricao}
            </Heading>
          </Center>

          <ModalBody className="max-h-[80vh] overflow-y-auto">
            <Box className="w-full h-40 rounded-lg overflow-hidden mb-4">
              <Image
                source={require("@/assets/dashboard/image2.png")}
                alt={eventoData.modalidade}
                size="full"
              />
            </Box>
            <VStack space="sm" className="text-center">
              <Text className="text-sm text-gray-600">
                Endereço: {eventoData.endereco}
              </Text>
              <Text className="text-sm text-gray-600">
                {eventoData.data} às {eventoData.hora}
              </Text>
              <Text className="text-sm font-semibold text-gray-800">
                Vagas Disponíveis: {eventoData.qtdeVagas}
              </Text>
            </VStack>
            <Button
              className="mt-4 w-full bg-primary-500 hover:bg-primary-600"
              onPress={() =>
                window.open(eventoData.linkPlataformaIngressos, "_blank")
              }
            >
              <ButtonText className="text-white">Participar</ButtonText>
            </Button>
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
};
