import { useEffect, useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { getCart, deleteCartProdut } from "@/api/carrinho";
import { SafeAreaView, ScrollView } from "react-native";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { Produto } from "@/interfaces/produto";
import { LoadingState } from "@/components/sections/LoadingState";
import { Trash } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";

interface ProdutoCarrinho extends Produto {
  produtoId: number;
  produtoNome: string;
  produtoValor: number;
  quantidade: number;
}

export const MainContent = () => {
  const [loading, setLoading] = useState(true);
  const [produtosCarrinho, setProdutosCarrinho] = useState<ProdutoCarrinho[]>(
    []
  );
  const [subtotal, setSubtotal] = useState(0);
  const hasFetchedCart = useRef(false);

  const calcularSubtotal = (items: ProdutoCarrinho[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.quantidade * item.produtoValor,
      0
    );
    setSubtotal(total);
  };

  useEffect(() => {
    if (hasFetchedCart.current) return;

    const fetchCartData = async () => {
      try {
        const response = await getCart();
        if (response.success) {
          setProdutosCarrinho(response.data);
          calcularSubtotal(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do carrinho:", error);
      } finally {
        hasFetchedCart.current = true;
      }
    };

    fetchCartData();
  }, []);

  const atualizarQuantidade = (produtoId: number, incremento: boolean) => {
    setProdutosCarrinho((prevProdutos) => {
      const atualizados = prevProdutos.map((produto) =>
        produto.produtoId === produtoId
          ? {
              ...produto,
              quantidade: Math.max(
                1,
                produto.quantidade + (incremento ? 1 : -1)
              ),
            }
          : produto
      );
      calcularSubtotal(atualizados);
      return atualizados;
    });
  };

  const removerProduto = async (produtoId: number) => {
    try {
      const response = await deleteCartProdut(produtoId);
      if (response.success) {
        setProdutosCarrinho((prevProdutos) =>
          prevProdutos.filter((produto) => produto.produtoId !== produtoId)
        );
        calcularSubtotal(produtosCarrinho);
      } else {
        console.error("Erro ao remover produto do carrinho.");
      }
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  const renderNoItems = () => (
    <NoItemsFound message="Seu carrinho está vazio" />
  );

  return (
    <Box className="flex flex-col w-full">
      {produtosCarrinho.length === 0 ? (
        renderNoItems()
      ) : (
        <Box className="w-full p-4">
          <HStack className="hidden md:flex w-full p-4 justify-between text-sm font-semibold ">
            <Text className="w-1/4">Produto</Text>
            <Text className="w-1/4 text-center">Preço</Text>
            <Text className="w-1/4 text-center">Qtd</Text>
            <Text className="w-1/4 text-center">Total</Text>
          </HStack>

          {produtosCarrinho.map((produto) => (
            <HStack
              key={produto.produtoId}
              className="flex w-full items-center justify-between p-4 border-b border-gray-200"
            >
              <HStack className="w-1/4 items-center">
                <Image
                  source={
                    produto.imagem || require("@/assets/dashboard/image2.png")
                  }
                  alt={produto.produtoNome}
                  className="w-16 h-16 object-cover"
                />
                <VStack className="ml-4">
                  <Text className="font-semibold text-blue-500 underline">
                    {produto.produtoNome}
                  </Text>
                  <Text className="text-sm text-gray-500">Descrição breve</Text>
                </VStack>
              </HStack>

              {/* Preço */}
              <Text className="w-1/4 text-center text-gray-700">
                R$ {produto.produtoValor.toFixed(2)}
              </Text>

              {/* Quantidade */}
              <HStack className="w-1/4 justify-center items-center space-x-2">
                <Button
                  onPress={() => atualizarQuantidade(produto.produtoId, false)}
                  className="w-8 h-8 bg-gray-200 rounded-full text-center"
                >
                  -
                </Button>
                <Text className="w-8 text-center">{produto.quantidade}</Text>
                <Button
                  onPress={() => atualizarQuantidade(produto.produtoId, true)}
                  className="w-8 h-8 bg-gray-200 rounded-full text-center"
                >
                  +
                </Button>
              </HStack>

              {/* Total e lixeira */}
              <HStack className="w-1/4 justify-center items-center">
                <Text className="mr-4 font-semibold">
                  R$ {(produto.quantidade * produto.produtoValor).toFixed(2)}
                </Text>
                <Pressable onPress={() => removerProduto(produto.produtoId)}>
                  <Trash className="text-typography-600" />
                </Pressable>
              </HStack>
            </HStack>
          ))}
          <VStack className="p-4 space-y-4">
            <HStack className="justify-between">
              <Text className="text-lg font-semibold">Order Total:</Text>
              <Text className="text-lg font-semibold">
                R$ {subtotal.toFixed(2)}
              </Text>
            </HStack>
            <Button className="w-full bg-blue-500 text-white py-3 rounded">
              Finalizar Compra
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export const Carrinho = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Carrinho" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
