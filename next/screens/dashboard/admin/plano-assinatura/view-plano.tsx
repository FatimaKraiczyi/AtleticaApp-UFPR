import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import Image from "@unitools/image";
import { Button, ButtonText } from "@/components/ui/button";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useForm } from "react-hook-form";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import type { PlanoAssinatura } from "../../../../../interfaces/planos";

interface ViewAssinaturaProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  planosData?: PlanoAssinatura;
}

export const ViewAssinatura = ({
  showModal,
  setShowModal,
  planosData,
}: ViewAssinaturaProps) => {
  const { handleSubmit } = useForm();

  const handlePurchase = () => {
    // Lógica para realizar a assinatura
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
      <ModalBackdrop />
      {planosData && (
        <ModalContent>
          <Box className={"w-full h-[110px] "}>
            <Image
              source={require("@/assets/profile-screens/profile/image2.png")}
              height={"100%"}
              width={"100%"}
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

          <Center className="w-full absolute top-10">
            <Heading size="2xl" className="text-typography-900">
              {planosData.nome}
            </Heading>
          </Center>
          <ModalBody className="px-10 py-6 max-h-[80vh] overflow-y-auto">
            <Text className="mt-4 font-semibold text-2xl text-typography-900">
              {planosData.descricao}
            </Text>
            <Text className="mt-4 font-semibold text-2xl text-typography-900 text-green-600">
              R$ {planosData.valor.toFixed(2)}
            </Text>
            <Text className="text-sm">Duração: {planosData.duracao} dias</Text>
            <VStack space="2xl">
              <HStack className="items-center justify-between mt-4">
                <Button onPress={handlePurchase} className="flex-1 ml-2">
                  <ButtonText>Comprar</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
};
