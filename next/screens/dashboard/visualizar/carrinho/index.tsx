import { useEffect, useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Image } from "@/components/ui/image";
import { SafeAreaView, ScrollView } from "react-native";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { Produto } from "@/interfaces/produto";
import { LoadingState } from "@/components/sections/LoadingState";
import { Trash } from "lucide-react-native";
import { getCart, deleteCartProdut } from "@/api/carrinho";

interface ProdutoCarrinho extends Produto {
  produtoId: number;
  carrinhoCompraId: number;
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
      } catch (error) {
        console.error("Erro ao buscar dados do carrinho:", error);
      } finally {
        hasFetchedCart.current = true;
        setLoading(false);
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

  const desconto = subtotal * 0.05;
  const totalComDesconto = subtotal - desconto;

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {produtosCarrinho.length === 0 ? (
          renderNoItems()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
            {produtosCarrinho.map((produto) => (
              <HStack
                key={produto.produtoId}
                className="border-b  py-4  border-gray-200 flex flex-row md:flex-row gap-4"
              >
                <HStack className="flex-1 gap-4">
                  <Image
                    source={
                      produto.imagem || require("@/assets/dashboard/image2.png")
                    }
                    alt={produto.produtoNome}
                    className="w-20 h-25 object-cover rounded"
                  />
                  <VStack className="flex-1">
                    <Text className="font-bold">{produto.produtoNome}</Text>
                    <Text className="text-sm text-gray-500">Size: Medium</Text>
                    <Text className="text-sm text-gray-500">
                      Delivery by Mon 27
                    </Text>
                    <Text className="text-lg font-semibold text-green-500">
                      R$ {produto.produtoValor.toFixed(2)}
                    </Text>
                  </VStack>
                </HStack>

                <VStack className="items-center gap-2">
                  <Pressable onPress={() => removerProduto(produto.produtoId)}>
                    <Trash className="text-red-500" />
                  </Pressable>
                  <HStack space="md" className="items-center gap-2">
                    <Button
                      onPress={() =>
                        atualizarQuantidade(produto.produtoId, false)
                      }
                      variant="link"
                    >
                      -
                    </Button>
                    <Text>{produto.quantidade}</Text>
                    <Button
                      onPress={() =>
                        atualizarQuantidade(produto.produtoId, true)
                      }
                      variant="link"
                    >
                      +
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            ))}

            <VStack className="bg-gray-50 gap-4 md:pt-6 w-full space-y-4">
              <Text className="font-semibold text-lg">Detalhes do pedido</Text>
              <HStack className="justify-between">
                <Text>Subtotal</Text>
                <Text>R$ {subtotal.toFixed(2)}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text>Desconto para sócios</Text>
                <Text className="text-lg font-semibold text-green-500">
                  R$ {desconto.toFixed(2)}
                </Text>
              </HStack>
              <HStack className="justify-between font-bold">
                <Text>Total</Text>
                <Text>R$ {totalComDesconto.toFixed(2)}</Text>
              </HStack>
            </VStack>
            <HStack
              space="xs"
              className="md:mt-40 mt-auto items-right justify-end"
            >
              <Button className="bg-purple-500 text-white py-3 rounded-md">
                Fazer pedido
              </Button>
            </HStack>
          </ScrollView>
        )}
      </VStack>
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
