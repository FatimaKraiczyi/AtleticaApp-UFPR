import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import Image from "@unitools/image";
import { Button } from "@/components/ui/button";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@/components/ui/box";

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
  const valorParcela = (produtoData?.valor / 6).toFixed(2);

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
      <ModalBackdrop />
      <ModalContent className={"w-full"}>
        <ModalHeader className="absolute top-0 right-0 p-4">
          <ModalCloseButton onPress={() => setShowModal(false)}>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        {produtoData && (
          <ModalBody className="px-4 py-6 max-h-[110vh] overflow-y-auto">
            <VStack className="w-full space-y-4">
              <Box className="w-full flex justify-center">
                <Image
									source={produtoData.imagem ||
										require("@/shared/assets/dashboard/dashboard-layout/image2.png")}
									alt={produtoData.nome} height={""} width={""}                />
              </Box>
              <Heading size="lg">{produtoData.nome}</Heading>
              <Text className="font-semibold text-xl text-green-700">
                R$ {valorDesconto}{" "}
                <span className="text-sm">5% desconto no PIX</span>
              </Text>
              <Text className="text-lg text-gray-900">
                R$ {produtoData.valor.toFixed(2)}
              </Text>
              <Text className="text-sm text-gray-500">
                Em até 6x de R$ {valorParcela} sem juros
              </Text>
              <Text className="mt-2">
                Quantidade disponível: {produtoData.quantidade}
              </Text>

              <HStack space="md" className="mt-4 flex-wrap gap-2">
                {produtoData.tamanhos?.map((tamanho: string) => (
                  <Button
                    key={tamanho}
                    variant={selectedSize === tamanho ? "solid" : "outline"}
                    onPress={() => handleSizeSelection(tamanho)}
                    className={`px-4 py-2 ${
                      selectedSize === tamanho
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-700"
                    } rounded-md`}
                  >
                    {tamanho}
                  </Button>
                ))}
              </HStack>

              <HStack space="md" className="mt-4 items-center gap-2">
                <Button
                  className="w-10 h-10"
                  variant="outline"
                  onPress={handleDecreaseQuantity}
                >
                  -
                </Button>
                <Text>{quantidade}</Text>
                <Button
                  className="w-10 h-10"
                  variant="outline"
                  onPress={handleIncreaseQuantity}
                >
                  +
                </Button>
              </HStack>

              <Button
                className="mt-4 w-full py-3 bg-green-600 text-white font-bold rounded-md"
                variant="solid"
                onPress={handlePurchase}
              >
                COMPRAR
              </Button>
            </VStack>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};