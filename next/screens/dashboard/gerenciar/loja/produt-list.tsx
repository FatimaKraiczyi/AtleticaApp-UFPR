import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Edit, Trash, Eye } from "lucide-react";
import { HStack } from "@/components/ui/hstack";
import { ModalProduto } from "./produto-modal";
import { DeleteProduto } from "./delete-produto";
import { ViewProduto } from "./view-produto";
import { Image } from "@/components/ui/image";
import { getProdutoById, getProdutos } from "@/api/produtos";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { addCartProduct } from "@/api/carrinho";
import { useCarrinho } from "@/hooks/CarrinhoContext";
import { Produto } from "@/interfaces/ProdutoCarrinho";

const AllProdutos = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atletica") : null;
  const { addItem } = useCarrinho();
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | undefined>(
    undefined
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtoToDeleteId, setProdutoToDeleteId] = useState<
    number | undefined
  >(undefined);
  const [showViewModal, setShowViewModal] = useState(false);
  const [quantidade, setQuantidade] = useState<number>(1);

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/gerenciar/loja";

  const fetchProdutos = async () => {
    setLoading(true);

    try {
      let response;

      if (showActions && atleticaId) {
        response = await getProdutoById(atleticaId);
        if (response.success && response.data?.produto) {
          setProdutos(response.data.produto);
        }
      } else {
        response = await getProdutos();
        if (response.success && response.data) {
          setProdutos(response.data);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleAddToCart = async (produto: Produto) => {
    try {
      const response = await addCartProduct(produto.id, quantidade);
      if (response.success) {
        addItem();
        console.log(`Produto ${produto.nome} adicionado ao carrinho`);
      }
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
    }
  };

  const openModal = (produto?: Produto) => {
    setSelectedProduto(produto);
    setShowModal(true);
  };

  const openViewModal = (produto?: Produto) => {
    setSelectedProduto(produto);
    setShowViewModal(true);
  };

  const handleEditProduto = (produto: Produto) => {
    openModal(produto);
  };

  const handleOpenDeleteModal = (id: number) => {
    setProdutoToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleIncreaseQuantity = (produto: any) => {
    if (quantidade < produto.quantidade) {
      setQuantidade((prev) => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantidade > 1) {
      setQuantidade((prev) => prev - 1);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  const renderNoItems = () => (
    <NoItemsFound message="Nenhum produto encontrado." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {showActions && (
          <VStack space="lg" className="items-center">
            <Button className="gap-3 relative" onPress={() => openModal()}>
              <ButtonText>Adicionar Produto</ButtonText>
            </Button>
          </VStack>
        )}
        {produtos.length === 0 ? (
          renderNoItems()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
            <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {produtos.map((produto) => (
                <GridItem
                  key={produto.id}
                  className="flex flex-col p-4 bg-white rounded-md shadow-md"
                  _extra={{
                    className: "",
                  }}
                >
                  <Pressable onPress={() => openViewModal(produto)}>
                    <Box className="w-full overflow-hidden rounded-md h-48 relative group">
                      <Image
                        source={
                          produto.imagem ||
                          require("@/assets/dashboard/image2.png")
                        }
                        alt={produto.nome}
                        size="full"
                        className="w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                      />
                    </Box>
                  </Pressable>

                  <VStack className="py-2">
                    <HStack>
                      <Text className="text-sm">Vendido por: {""}</Text>
                      <Text className="text-sm font-bold">
                        {produto.atleticaNome}
                      </Text>
                    </HStack>
                    <Text className="font-semibold text-xl mt-4">
                      {produto.nome}
                    </Text>
                    <HStack space="md" className="items-center gap-2">
                      <Text className="font-semibold text-2xl text-typography-900 text-green-600">
                        R$ {(produto.valor - produto.valor * 0.05).toFixed(2)}
                      </Text>
                      <Text className="text-sm text-green-900 line-clamp-1">
                        5% off para sócios
                      </Text>
                    </HStack>
                    <Text className="font-semibold  text-md text-typography-900">
                      R$ {produto.valor.toFixed(2)}
                    </Text>
                  </VStack>
                  <HStack space="md" className="items-center gap-2">
                    <Text>{quantidade}</Text>
                    <Button
                      variant="link"
                      onPress={() => handleIncreaseQuantity(quantidade)}
                    >
                      +
                    </Button>
                    <Button variant="link" onPress={handleDecreaseQuantity}>
                      -
                    </Button>

                    <Text className="text-sm">
                      Em estoque: {""}
                      {produto.quantidade}
                    </Text>
                  </HStack>

                  {showActions ? (
                    <HStack className="w-full items-center justify-between mt-4">
                      <HStack className="items-center">
                        <Pressable onPress={() => handleEditProduto(produto)}>
                          <Edit className="text-typography-600 mr-4" />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            produto.id !== undefined &&
                            handleOpenDeleteModal(produto.id)
                          }
                        >
                          <Trash className="text-typography-600" />
                        </Pressable>
                      </HStack>
                    </HStack>
                  ) : (
                    <Button
                      className="mt-auto w-full py-2 hover:bg-primary-500 "
                      variant="outline"
                      onPress={() => handleAddToCart(produto)}
                    >
                      <ButtonText className="text-secondary-600 group-hover/button:text-white">
                        Adicionar no carrinho
                      </ButtonText>
                    </Button>
                  )}
                </GridItem>
              ))}
            </Grid>
          </ScrollView>
        )}
      </VStack>
      <ModalProduto
        showModal={showModal}
        setShowModal={setShowModal}
        refreshProdutos={fetchProdutos}
        produtoData={selectedProduto}
      />
      <DeleteProduto
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        id={produtoToDeleteId}
        refreshProdutos={fetchProdutos}
      />
      <ViewProduto
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        produtoData={selectedProduto}
      />
    </Box>
  );
};

export const ProdutosList = () => {
  return <AllProdutos />;
};
