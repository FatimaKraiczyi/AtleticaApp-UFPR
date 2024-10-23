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
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ViewProdutoProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
	produtoData?: any;
}

export const ViewProduto = ({
  showModal,
  setShowModal,
	produtoData,
}: ViewProdutoProps) => {



  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton onPress={() => setShowModal(false)}>
            <Icon as={CloseIcon} size="md" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          {produtoData && (
            <VStack space="lg">
              <Center>
                <Heading size="lg">{produtoData.nome}</Heading>
              </Center>
              <Box className="w-full overflow-hidden rounded-md h-72">
                <Image
                  source={
                    produtoData.imagem ||
                    require("@/shared/assets/dashboard/dashboard-layout/image2.png")
                  }
                  alt={produtoData.nome}
                  height={"100%"}
                  width={"100%"}
                />
              </Box>
              <Text className="font-semibold text-typography-900">
                R$ {produtoData.valor.toFixed(2)}
              </Text>
              <Text className="line-clamp-1">
                Quantidade: {produtoData.quantidade}
              </Text>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};