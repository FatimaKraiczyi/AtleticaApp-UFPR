import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import {
  pagamentoPedidoId,
  pedidoUsuario,
  visualizarPedidoId,
} from "@/api/pedidos";
import { Modal } from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";
import { ViewProduto } from "../../gerenciar/loja/view-produto";

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [expand, setExpand] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any | null>(null);

  const usuarioId =
    typeof window !== "undefined" ? sessionStorage.getItem("usuarioId") : null;

  const fetchPedidos = async () => {
    if (!usuarioId) return;

    setLoading(true);
    try {
      const response = await pedidoUsuario();
      if (response.success && response.data) {
        setPedidos(response.data);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const visualizarPedido = async (pedidoId: number) => {
    setLoading(true);
    try {
      const response = await visualizarPedidoId(pedidoId);
      if (response.success && response.data) {
        setPedidoSelecionado(response.data);
        setExpand(true);
      } else {
        alert("Erro ao visualizar pedido.");
      }
    } catch (error) {
      console.error("Erro ao visualizar pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (id?: any) => {
    setPedidoSelecionado(id);
    setShowModal(true);
  };

  useEffect(() => {
    if (usuarioId) {
      fetchPedidos();
    } else {
      setLoading(false);
    }
  }, [usuarioId]);

  if (loading) {
    return <LoadingState />;
  }

  const renderNoPedido = () => (
    <NoItemsFound message="Nenhum pedido encontrado." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {pedidos.length === 0 ? (
          renderNoPedido()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
            {pedidos.map((pedido) => (
              <Box key={pedido.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                <Box className="flex justify-between">
                  <Box className="grid grid-cols-5 gap-4 items-center">
                    <Box>
                      <Text className="font-medium">Data</Text>
                      <Text className="text-gray-500">{pedido.data}</Text>
                    </Box>
                    <Box>
                      <Text className="font-medium">Número do pedido</Text>
                      <Text className="text-gray-500"># {pedido.id}</Text>
                    </Box>
                    <Box>
                      <Text className="font-medium">Valor total</Text>
                      <Text className="text-gray-500">{pedido.valorTotal}</Text>
                    </Box>
                    <Box
                      className={`flex items-end gap-2 ${
                        pedido.status === "CONCLUIDO" ? "invisible" : ""
                      }`}
                    >
                      <Button
                        variant="solid"
                        className="bg-violet-500 text-white"
                        onPress={async () => {
                          const response = await pagamentoPedidoId(pedido.id);
                          if (response.success && response?.data) {
                            window.location.href = response.data.url;
                          } else {
                            alert("Erro ao iniciar pagamento.");
                          }
                        }}
                      >
                        <ButtonText>Efetuar pagamento</ButtonText>
                      </Button>
                    </Box>
                    <Box className="flex items-end gap-2">
                      <Button
                        variant="outline"
                        onPress={() => visualizarPedido(pedido.id)}
                      >
                        <ButtonText>Ver Pedido</ButtonText>
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {pedidoSelecionado && pedidoSelecionado.id === pedido.id && (
                  <Box className="bg-white flex border rounded-lg p-4 mt-4">
                    <Box className="grid grid-cols-4 py-4 border-b">
                      <Box className="flex gap-2">
                        <Text className="font-medium">Produto</Text>
                      </Box>
                      <Box className="flex items-center gap-2">
                        <Text className="font-medium">Valor</Text>
                      </Box>
                      <Box className="flex items-center gap-2">
                        <Text className="font-medium">Status</Text>
                      </Box>
                      <Box className="flex items-center gap-2">
                        <Text className="font-medium">Ações</Text>
                      </Box>
                    </Box>
                    {pedidoSelecionado.produtos.map(
                      (produto: any, index: any) => (
                        <Box
                          key={index}
                          className="grid grid-cols-4 gap-4 py-4 border-b"
                        >
                          <Box className="flex gap-2">
                            <Text>{produto.nome}</Text>
                          </Box>
                          <Box className="flex items-center gap-2">
                            <Text>R$ {produto.valor}</Text>
                          </Box>
                          <Box className="flex items-center gap-2">
                            <Text>{pedidoSelecionado.status}</Text>
                          </Box>
                          <Box className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              onPress={() => openViewModal(true)}
                            >
                              <ButtonText>Ver Produto</ButtonText>
                            </Button>
                          </Box>
                        </Box>
                      )
                    )}
                  </Box>
                )}
              </Box>
            ))}

            {showModal && (
              <Modal onClose={() => setShowModal(false)}>
                <Box className="p-4">
                  <Text className="text-xl font-bold">Detalhes do Produto</Text>
                  <Text className="mt-4">
                    Informações adicionais sobre o produto selecionado.
                  </Text>
                  <Button className="mt-4" onPress={() => setShowModal(false)}>
                    <ButtonText>Fechar</ButtonText>
                  </Button>
                </Box>
              </Modal>
            )}
          </ScrollView>
        )}
      </VStack>

      <ViewProduto
        showModal={showModal}
        setShowModal={setShowModal}
        produtoData={setPedidoSelecionado}
      />
    </Box>
  );
};

export const Pedidos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Meus Pedidos" isSidebarVisible={true}>
        <Main />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
