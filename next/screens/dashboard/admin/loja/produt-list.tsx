import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Edit, Trash, ShoppingCart, Eye } from "lucide-react";
import { HStack } from "@/components/ui/hstack";
import { ModalProduto } from "./produto-modal";
import { DeleteProduto } from "./delete-produto";
import { ViewProduto } from "./view-produto";
import { Image } from "@/components/ui/image";
import { getProdutoById, getProdutos } from "@/api/produtos";
import { Produto } from "@/interfaces/produto";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";

const AllProdutos = () => {
  const atleticaId =
    typeof window !== "undefined" ? sessionStorage.getItem("atleticaId") : null;
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

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/admin/loja";

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

  if (loading) {
    return <LoadingState />;
  }

  const renderNoItems = () => (
    <NoItemsFound message="Nenhum produto encontrado." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
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
            <Grid
              className="gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              _extra={{
                className: "",
              }}
            >
              {produtos.map((produto) => (
                <GridItem
                  key={produto.id}
                  className="flex-1 p-4 relative rounded-md shadow-md bg-white"
                  _extra={{
                    className: "",
                  }}
                >
                  <Pressable onPress={() => openViewModal(produto)}>
                    <Box className="w-full overflow-hidden rounded-md h-72 relative group">
                      <Image
                        source={
                          produto.imagem ||
                          require("@/assets/dashboard/image2.png")
                        }
                        alt={produto.nome}
                        size="full"
                      />
                      <Eye className="absolute w-40 h-40 inset-0 m-auto text-white opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    </Box>
                  </Pressable>
                  <Text className="text-sm mt-2">
                    Vendido por: {produto.vendedor}
                  </Text>
                  <VStack className="py-2">
                    <Text className="font-semibold text-lg text-typography-900">
                      {produto.nome}
                    </Text>
                    <Text className="font-semibold text-2xl text-typography-900 text-green-600">
                      R$ {produto.valor.toFixed(2)}
                    </Text>
                    <Text className="text-sm text-typography-600">
                      Quantidade: {produto.quantidade}
                    </Text>
                  </VStack>
                  <HStack className="w-full items-center justify-between">
                    <HStack className="items-center  ">
                      {showActions && (
                        <>
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
                        </>
                      )}
                    </HStack>
                    <Pressable
                      onPress={() =>
                        console.log("Adicionar ao carrinho", produto)
                      }
                    >
                      <ShoppingCart className="text-typography-600" />
                    </Pressable>
                  </HStack>
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
