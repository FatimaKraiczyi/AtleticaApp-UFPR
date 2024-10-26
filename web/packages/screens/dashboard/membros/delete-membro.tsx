import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { CloseIcon, Icon } from "@/components/ui/icon";
import Image from "@unitools/image";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { deletarMembro } from "../../../../api/membros";
import { useMembros } from "../../../hooks/MembrosContext";

interface DeleteMembroProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  email: string;
}

export const DeleteMembro = ({
  showModal,
  setShowModal,
  email,
}: DeleteMembroProps) => {
  const { setMembros } = useMembros();

  const handleDelete = async () => {
    try {
      const response = await deletarMembro(email);
      if (response.success) {
        setMembros((prevMembros) =>
          prevMembros.filter((membro) => membro.Usuario?.email !== email)
        );
      }
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao deletar membro:", error);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
      <ModalBackdrop />
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
          <Heading size="2xl" className="text-typography-800">
            Deletar Membro
          </Heading>
        </Center>
        <ModalBody className="px-10 py-6">
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
