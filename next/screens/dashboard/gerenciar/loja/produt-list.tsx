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
import { AuthenticatedUser } from "@/interfaces/users";

const getImageUrl = (path: string | null) => {
  if (!path) return null;
  const baseUrl = "http://localhost:3001/uploads/";
  const fileName = path.split("\\").pop();
  return `${baseUrl}${fileName}`;
};

const AllProdutos = () => {
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
  const [quantidades, setQuantidades] = useState<{ [key: number]: number }>({});
  const route = "/dashboard/visualizar/pedidos";

  const showActions =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/gerenciar/loja";

    const atleticaIdUsuario = window.location.pathname === "/dashboard/gerenciar/loja"
      ? parseInt(sessionStorage.getItem("atletica") || "0", 10)
      : 0;
		
  const showMeusPedidosButton =
    typeof window !== "undefined" &&
    window.location.pathname === "/dashboard/visualizar/loja";

  const fetchProdutos = async () => {
    setLoading(true);

    try {
      let response;

      if (atleticaIdUsuario) {
        response = await getProdutoById(atleticaIdUsuario.toString());
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
      const quantidade = quantidades[produto.id] || 1;
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

  const handleIncreaseQuantity = (produto: Produto) => {
    setQuantidades((prev) => ({
      ...prev,
      [produto.id]: Math.min(
        (prev[produto.id] || 1) + 1,
        produto.quantidade ?? 0
      ),
    }));
  };

  const handleDecreaseQuantity = (produto: Produto) => {
    setQuantidades((prev) => ({
      ...prev,
      [produto.id]: Math.max((prev[produto.id] || 1) - 1, 1),
    }));
  };

  const valorComDesconto = (produto: any) => {
  
    const usuario: AuthenticatedUser = {
      ...JSON.parse(sessionStorage.getItem("assinaturas") || "[]"),
      atleticaId: sessionStorage.getItem("atletica"),
    };

    const isProdutoDaAtletica = produto?.atleticaId === atleticaIdUsuario;

    const assinaturaValida = usuario.assinaturas?.find(
      (assinatura: any) =>
        assinatura.statusAssinatura === "PAGA" &&
        assinatura.PlanoAssinatura?.atleticaId === produto.atleticaId
    );

    const descontoAssinante = assinaturaValida
      ? assinaturaValida.PlanoAssinatura.desconto || 0
      : 0;
    const valorDescontoAssinante = descontoAssinante
      ? produto.valor * (1 - descontoAssinante / 100)
      : null;

    const valorDescontoMembro = isProdutoDaAtletica
      ? produto.valor * 0.8
      : null;

    if (valorDescontoAssinante !== null && valorDescontoMembro !== null) {
      return valorDescontoAssinante < valorDescontoMembro
        ? {
            valor: valorDescontoAssinante.toFixed(2),
            tipo: `${descontoAssinante}% de desconto para assinantes`,
          }
        : {
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

    if (valorDescontoMembro !== null) {
      return {
        valor: valorDescontoMembro.toFixed(2),
        tipo: "20% de desconto para membros",
      };
    }

    return null;
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
        {showMeusPedidosButton && (
          <VStack space="lg" className="items-center">
            <Button
              className="gap-3 relative"
              onPress={() => (window.location.href = route)}
            >
              <ButtonText>Meus Pedidos</ButtonText>
            </Button>
          </VStack>
        )}
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
            <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-10">
						{produtos.map((produto) => (
                <GridItem
                  key={produto.id}
                  className="flex flex-col p-4 xl:h-120 xl:w-72 md:h-120 md:w-72 rounded-md shadow-md"
                >
                  <Pressable onPress={() => openViewModal(produto)}>
                    <Box className="rounded-md h-48 w-full overflow-hidden">
                      {produto.imagem ? (
                        <Image
                          source={{
                            uri: getImageUrl(produto.imagem),
                          }}
                          alt={produto.nome}
                          size="full"
                          className="transform duration-500 ease-in-out hover:scale-110 rounded-lg bg-gray-200 "
                        />
                      ) : (
                        <Image
                          source={require("@/assets/dashboard/image2.png")}
                          alt="Imagem vazia"
                          size="full"
                          className="w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                        />
                      )}
                    </Box>
                  </Pressable>

                  <VStack>
                    <VStack className="items-center">
                      <Text className="text-sm  gap-2">Vendido por:</Text>
                      <Text className="font-primary text-violet-600 text-md pb-4 font-semibold">
                        {produto.atleticaNome}
                      </Text>
                      <Text className="font-primary text-2xl font-semibold">
                        {produto.nome}
                      </Text>
                    </VStack>

                    {valorComDesconto(produto) ? (
                      <VStack space="sm" className="items-center">
                        <Text className="font-semibold text-md line-through text-red-500">
                          R$ {produto.valor.toFixed(2)}
                        </Text>
                        <Text className="font-semibold text-2xl text-typography-900 text-green-600">
                          R$ {valorComDesconto(produto)?.valor}
                        </Text>
                        <Text className="text-sm text-green-900 line-clamp-1">
                          {valorComDesconto(produto)?.tipo}
                        </Text>
                      </VStack>
                    ) : (
                      <Text className="font-semibold text-md text-typography-900">
                        R$ {produto.valor.toFixed(2)}
                      </Text>
                    )}
                  </VStack>
                  <HStack space="md" className="justify-center  items-center gap-2">
                    <Text>{quantidades[produto.id] || 1}</Text>
                    <Button
                      variant="link"
                      onPress={() => handleIncreaseQuantity(produto)}
                    >
                      +
                    </Button>
                    <Button
                      variant="link"
                      onPress={() => handleDecreaseQuantity(produto)}
                    >
                      -
                    </Button>

                    <Text className="text-sm text-gray-600 font-primary font-light">
                      Em estoque: {""}
                      {produto.quantidade}
                    </Text>
                  </HStack>

                  {showActions ? (
                    <HStack className="w-full items-center justify-center mt-4">
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
