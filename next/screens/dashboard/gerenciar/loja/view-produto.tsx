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
import { addCartProduct } from "@/api/carrinho";
import { useCarrinho } from "@/hooks/CarrinhoContext";
import { AuthenticatedUser } from "@/interfaces/users";

interface ViewProdutoProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  produtoData?: any;
}

const getImageUrl = (path: string | null) => {
  if (!path) return null;
  const baseUrl = "http://localhost:3001/uploads/";
  const fileName = path.split("\\").pop();
  return `${baseUrl}${fileName}`;
};

export const ViewProduto = ({
  showModal,
  setShowModal,
  produtoData,
}: ViewProdutoProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const { addItem } = useCarrinho();

  const atleticaIdUsuario = parseInt(sessionStorage.getItem("atletica") || "0");
  const usuario: AuthenticatedUser = {
    ...JSON.parse(sessionStorage.getItem("assinaturas") || "[]"),
    atleticaId: sessionStorage.getItem("atletica"),
  };

  const isProdutoDaAtletica = produtoData?.atleticaId === atleticaIdUsuario;

  const valorComDesconto = (() => {
    if (!produtoData?.valor) return null;

    const isMembroDaAtletica = isProdutoDaAtletica;

    const valorDescontoMembro = isMembroDaAtletica
      ? produtoData.valor * 0.8
      : null;

    const assinaturaValida = !isMembroDaAtletica
      ? usuario.assinaturas?.find(
          (assinatura: any) =>
            assinatura.statusAssinatura === "PAGA" &&
            assinatura.PlanoAssinatura?.atleticaId === produtoData.atleticaId
        )
      : null;

    const descontoAssinante = assinaturaValida
      ? assinaturaValida.PlanoAssinatura.desconto || 0
      : 0;
    const valorDescontoAssinante = descontoAssinante
      ? produtoData.valor * (1 - descontoAssinante / 100)
      : null;

    if (valorDescontoMembro !== null) {
      return {
        valor: valorDescontoMembro.toFixed(2),
        tipo: "20% de desconto para membros",
      };
    }

    if (valorDescontoAssinante !== null) {
      return {
        valor: valorDescontoAssinante.toFixed(2),
        tipo: `${descontoAssinante}% de desconto para assinantes`,
      };
    }

    return null;
  })();

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
  };

  const handleIncreaseQuantity = (produto: any) => {
    if (quantidade < produto.quantidade) {
      setQuantidade(quantidade + 1);
    }
  };

  const handleAddToCart = async (produto: any) => {
    try {
      const response = await addCartProduct(produto.id, quantidade);
      if (response.success) {
        addItem();
      }
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantidade > 1) {
      setQuantidade((prev) => prev - 1);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
      <ModalBackdrop />
      {produtoData && (
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

          <Center className="w-full absolute top-10">
            <Heading size="2xl" className="text-typography-900">
              {produtoData.nome}
            </Heading>
          </Center>
          <ModalBody className="max-h-[80vh] overflow-y-auto">
            <Box className="w-full overflow-hidden rounded-md h-72">
              {produtoData.imagem ? (
                <Image
                  source={{
                    uri: getImageUrl(produtoData.imagem),
                  }}
                  alt={produtoData.nome}
                  size="full"
                />
              ) : (
                <Image
                  source={require("@/assets/dashboard/image2.png")}
                  alt="Imagem vazia"
                  size="full"
                />
              )}
            </Box>
            <VStack className="py-2">
              <Text className="text-sm">
                Vendido por: {produtoData.atleticaNome}
              </Text>

              {valorComDesconto ? (
                <>
                  <VStack className="gap-2">
                    <Text className="font-semibold text-md line-through text-red-500">
                      R$ {produtoData.valor.toFixed(2)}
                    </Text>
                    <HStack className="items-center sm:flex-row sm:justify-between w-full">
                      <Text className="font-semibold text-lg text-green-600">
                        R$ {valorComDesconto.valor}
                      </Text>
                      <Text className="text-sm text-gray-600 italic">
                        ({valorComDesconto.tipo})
                      </Text>
                    </HStack>
                  </VStack>
                </>
              ) : (
                <Text className="font-semibold text-md text-typography-900">
                  R$ {produtoData.valor.toFixed(2)}
                </Text>
              )}
            </VStack>
            <HStack space="md" className="items-center gap-2">
              <Button variant="link" onPress={handleDecreaseQuantity}>
                -
              </Button>
              <Text>{quantidade}</Text>
              <Button
                variant="link"
                onPress={() => handleIncreaseQuantity(produtoData)}
              >
                +
              </Button>
              <Text className="text-sm">
                Em estoque: {produtoData.quantidade}
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
              <HStack className="items-center justify-between">
                <Button
                  className="flex-1 mr-2 hover:bg-primary-500 "
                  variant="outline"
                  onPress={() => handleAddToCart(produtoData)}
                >
                  <ButtonText className="text-secondary-600 group-hover/button:text-white">
                    Adicionar no carrinho
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
};
