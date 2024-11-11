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
import { useForm } from "react-hook-form";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";

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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const { handleSubmit } = useForm();

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
  };

  const handlePurchase = () => {
    // Lógica para realizar a compra
    console.log("Produto comprado:", produtoData);
  };

  const handleIncreaseQuantity = () => {
    setQuantidade((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantidade > 1) {
      setQuantidade((prev) => prev - 1);
    }
  };

  const valorDesconto = (produtoData?.valor * 0.95).toFixed(2);

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
      <ModalBackdrop />
      {produtoData && (
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

          <Center className="w-full absolute top-10">
            <Heading size="2xl" className="text-typography-900">
              {produtoData.nome}
            </Heading>
          </Center>
          <ModalBody className="max-h-[80vh] overflow-y-auto">
            <Box className="w-full overflow-hidden rounded-md h-72">
              <Image
                source={
                  produtoData.imagem || require("@/assets/dashboard/image2.png")
                }
                alt={produtoData.nome}
                size="full"
              />
            </Box>
            <Text className="text-sm mt-2">Vendido por: {produtoData.vendedor}</Text>
            <Text className="mt-4 font-semibold text-2xl text-typography-900 text-green-600">
              R$ {valorDesconto}
            </Text>
            <Text className="text-sm text-green-900 line-clamp-1">
              5% desconto para assinantes
            </Text>

            <Text className="mt-4 font-semibold  text-md text-typography-900">
              R$ {produtoData.valor.toFixed(2)}
            </Text>

            <HStack space="md" className="mt-4 items-center gap-2">
              <Button
                className="w-4 h-6"
                variant="outline"
                onPress={handleDecreaseQuantity}
              >
                -
              </Button>
              <Text>{quantidade}</Text>
              <Button
                className="w-4 h-6"
                variant="outline"
                onPress={handleIncreaseQuantity}
              >
                +
              </Button>
              <Text className="text-sm">
                Quantidade disponível: {produtoData.quantidade}
              </Text>
            </HStack>

            <HStack space="md" className="mt-4 flex-wrap">
              {produtoData.tamanhos?.map((tamanho: string) => (
                <Button
                  key={tamanho}
                  variant={selectedSize === tamanho ? "solid" : "outline"}
                  onPress={() => handleSizeSelection(tamanho)}
                  className={`m-1 ${
                    selectedSize === tamanho
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {tamanho}
                </Button>
              ))}
            </HStack>

            <VStack space="2xl">
              <HStack className="items-center justify-between mt-4">
                <Button
                  className="flex-1 mr-2 hover:bg-primary-500 "
                  variant="outline"
                >
                  <ButtonText className="text-secondary-600 group-hover/button:text-white">
                    Adicionar no carrinho
                  </ButtonText>
                </Button>
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
