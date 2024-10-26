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
import { ViewProduto } from "./view-produto";
import { CartIcon } from "../../assets/cart/index.web";

interface AdminLojaProps  {
  isAdmin: boolean;
}

const MainContent = ({ isAdmin }: AdminLojaProps ) => {
  const atleticaId = sessionStorage.getItem("atleticaId");
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

  const openViewModal = (produto?: Produto) => {
    setSelectedProduto(produto);
    setShowViewModal(true);
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
    <Grid
      className="gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      _extra={{ className: "" }}
    >
      {produtos.map((produto) => (
        <GridItem
          key={produto.id}
          _extra={{ className: "flex-1 p-4 relative" }}
        >
          <Box className="w-full overflow-hidden rounded-md h-72">
            <Image
              source={
                produto.imagem ||
                require("@/shared/assets/dashboard/image2.png")
              }
              alt={produto.nome}
              height={"100%"}
              width={"100%"}
            />
          </Box>
          <HStack className="w-full justify-between mt-2">
            <VStack>
              <Text className="font-semibold text-typography-900">
                {produto.nome}
              </Text>
              <Text className="line-clamp-1">
                R$ {produto.valor.toFixed(2)}
              </Text>
              <Text className="line-clamp-1">
                Quantidade: {produto.quantidade}
              </Text>
            </VStack>
            {isAdmin ? (
              <HStack space="md" className="mt-2">
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
            ) : (
              <Pressable onPress={() => openViewModal(produto)}>
                <Icon as={CartIcon} className="text-typography-600" />
              </Pressable>
            )}
          </HStack>
          <HStack className="w-full items-center mt-2">
            <Button
              variant="outline"
              className="w-full gap-3 center"
              onPress={() => openViewModal(produto)}
            >
              <ButtonText>Visualizar</ButtonText>
            </Button>
          </HStack>
        </GridItem>
      ))}
    </Grid>
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
        {isAdmin && (
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
      <ViewProduto
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        produtoData={selectedProduto}
      />
    </Box>
  );
};

export const AdminLoja = ({ isAdmin }: AdminLojaProps) => {
  return (
    <SafeAreaView className="h-full w-full">
      {isAdmin ? (
        <LayoutComponents title="Loja" isSidebarVisible={true}>
          <MainContent isAdmin={isAdmin} />
        </LayoutComponents>
      ) : (
        <MainContent isAdmin={isAdmin} />
      )}
      <MobileFooter />
    </SafeAreaView>
  );
};