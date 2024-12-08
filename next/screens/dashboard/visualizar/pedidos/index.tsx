import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { LoadingState } from "@/components/sections/LoadingState";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { pagamentoPedidoId, pedidoUsuario } from "@/api/pedidos";
import { ChevronDown, ChevronUp } from "lucide-react-native";

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [expandedPlanos, setExpandedPlanos] = useState<Set<number>>(new Set());
  const usuarioId =
    typeof window !== "undefined" ? sessionStorage.getItem("usuarioId") : null;

  const fetchPedido = async () => {
    if (!usuarioId) return;

    setLoading(true);
    try {
      const response = await pedidoUsuario();
      if (response.success) {
        const pedidosUsuario = response.data.pedidos.filter(
          (pedido: any) =>
            pedido.usuarioId === parseInt(usuarioId, 10)
        );
        setPedidos(pedidosUsuario);
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

  useEffect(() => {
    if (usuarioId) {
      fetchPedido();
    } else {
      setLoading(false);
    }
  }, [usuarioId]);

  const toggleExpand = (id: number) => {
    setExpandedPlanos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  const renderNoPedido = () => (
    <NoItemsFound message="Nenhuma pedido encontrada." />
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
            <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {pedidos.map((pedido) => (
                <GridItem
                  key={pedido.id}
                  className="flex-1 p-6 rounded-md shadow-lg bg-white"
                  _extra={{
                    className: "",
                  }}
                >
                  <VStack className="items-center">
                    <Text className="text-gray-700 font-semibold text-sm uppercase">
                      {pedido.atleticaNome}
                    </Text>
                    <Text className="text-gray-500 font-semibold text-2xl uppercase">
                      {pedido.planoNome}
                    </Text>
                    <Text className="font-bold text-xl mt-2">
                      R$ {pedido.planoValor.toFixed(2)}
                    </Text>
                    <Text className="text-gray-500 text-sm mb-4">
                      /{" "}
                      {pedido.planoDuracao === 30
                        ? "mês"
                        : `${pedido.planoDuracao} meses`}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-2">
                      Início:{" "}
                      {new Date(pedido.dataInicio).toLocaleDateString()}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Fim: {new Date(pedido.dataFim).toLocaleDateString()}
                    </Text>
                    <Text className="font-bold text-xl mt-2  mb-4">
                      Status: {pedido.statusPedido}
                    </Text>
                  </VStack>
                  
                      <Button
                        variant="solid"
                        className="w-full"
                        onPress={async () => {
                          const response = await pagamentoPedidoId(
                            pedido.pedidoId
                          );
                          if (response.success && response?.data) {
                            window.location.href = response.data.url;
                          } else {
                            alert("Erro ao iniciar pagamento.");
                          }
                        }}
                      >
                        <ButtonText>Efetuar pagamento</ButtonText>
                      </Button>
                   
                </GridItem>
              ))}
            </Grid>
          </ScrollView>
        )}
      </VStack>
    </Box>
  );
};

export const Pedidos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Meu Pedidos" isSidebarVisible={true}>
        <Main />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
