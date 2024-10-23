import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { LayoutComponents } from "../../../components/LayoutComponents";
import { MobileFooter } from "../../../components/MobileFooter";
import { NoItemsFound } from "../../../components/NoItemsFound";
import { LoadingState } from "../../../components/LoadingState";
import Image from "@unitools/image";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import type { Produto } from "../../../../../interfaces/produto";
import { getProdutoById } from "../../../../../api/produtos";
import { ModalProduto } from "./produto-modal";
import { HStack } from "@/components/ui/hstack";
import { DeleteProduto } from "./delete-produto";

const MainContent = () => {
  const atleticaId = sessionStorage.getItem("atleticaId");
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtoToDeleteId, setProdutoToDeleteId] = useState<number | undefined>(undefined);

  const fetchProdutos = async () => {
    setLoading(true);

    if (atleticaId) {
      const response = await getProdutoById(atleticaId);
      if (response.success && response.data?.produto) {
        setProdutos(response.data.produto);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProdutos();
  }, [atleticaId]);

  const openModal = (produto?: Produto) => {
    setSelectedProduto(produto);
    setShowModal(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  const renderNoItems = () => (
    <NoItemsFound message="Nenhum produto encontrado." />
  );

  const handleEditProduto = (produto: Produto) => {
    openModal(produto);
  };

  const handleOpenDeleteModal = (id: number) => {
    setProdutoToDeleteId(id);
    setShowDeleteModal(true);
  };

  const renderItems = () => (
    <Grid className="gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {produtos.map((produto) => (
        <GridItem
          key={produto.id}
          _extra={{
            className: "flex-1 p-4 relative",
          }}
        >
          <Pressable className="w-full" onPress={() => openModal(produto)}>
            <Box className="overflow-hidden rounded-md h-72">
              <Image
                source={
                  produto.imagem ||
                  require("@/shared/assets/dashboard/dashboard-layout/image2.png")
                }
                alt={produto.nome}
                height={"100%"}
                width={"100%"}
              />
            </Box>
            <Box className="mt-2">
              <Text className="font-semibold text-typography-900">
                {produto.nome}
              </Text>
              <Text size="sm" className="text-typography-500">
                R$ {produto.valor.toFixed(2)}
              </Text>
              <Text size="sm" className="text-typography-500">
                Quantidade: {produto.quantidade}
              </Text>
              <HStack space="md">
                <Pressable onPress={() => handleEditProduto(produto)}>
                  <Icon as={EditIcon} className="text-typography-600" />
                </Pressable>
                <Pressable
                  onPress={() =>
                    produto.id !== undefined &&
                    handleOpenDeleteModal(produto.id)
                  }
                >
                  <Icon as={TrashIcon} className="text-typography-600" />
                </Pressable>
              </HStack>
            </Box>
          </Pressable>
        </GridItem>
      ))}
    </Grid>
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
        <VStack space="lg" className="items-center">
          <Button className="gap-3 relative" onPress={() => openModal()}>
            <ButtonText>Adicionar Produto</ButtonText>
          </Button>
        </VStack>
        {produtos.length === 0 ? (
          renderNoItems()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
            {renderItems()}
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
    </Box>
  );
};

export const AdminLoja = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Loja" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
