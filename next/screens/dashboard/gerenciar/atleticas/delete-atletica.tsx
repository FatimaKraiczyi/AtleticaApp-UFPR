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
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { deleteAtletica } from "@/api/atleticas";

interface DeleteAtleticaProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  id?: number;
  refreshAtleticas: () => void;
}

export const DeleteAtletica = ({
  showModal,
  setShowModal,
  id,
  refreshAtleticas,
}: DeleteAtleticaProps) => {
  const handleDelete = async () => {
    try {
      if (id !== undefined) {
        const response = await deleteAtletica(id);
        if (response.success) {
          setShowModal(false);
          refreshAtleticas();
        }
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
      <ModalBackdrop />
      <ModalContent>
        <Box className={"w-full h-[110px] "}>
          <Image
              source={require("@/assets/dashboard/headermodal.png")}
            alt="Imagem de fundo"
            size="full"
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
          <Heading size="2xl" className="text-typography-800">
            Deletar Atlética
          </Heading>
        </Center>
        <ModalBody>
          <Center className="w-full mb-6">
            <Box className="text-center m-6">
              Tem certeza? Essa ação não pode ser desfeita.
            </Box>
          </Center>

          <VStack space="2xl">
            <HStack className="items-center justify-between">
              <Button
                onPress={() => setShowModal(false)}
                className="flex-1 mr-2 bg-gray-200"
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>
              <Button onPress={handleDelete} className="flex-1 ml-2">
                <ButtonText>Deletar</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
