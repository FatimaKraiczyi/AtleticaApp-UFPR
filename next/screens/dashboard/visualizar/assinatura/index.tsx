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
import { assinaturaUsuario, cancelarAssinatura } from "@/api/assinatura";
import { Assinatura } from "@/interfaces/assinatura";
import { pagamentoAssinatura } from "@/api/planos";
import { ChevronDown, ChevronUp } from "lucide-react-native";

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [expandedPlanos, setExpandedPlanos] = useState<Set<number>>(new Set());
  const usuarioId =
    typeof window !== "undefined" ? sessionStorage.getItem("usuarioId") : null;

  const fetchAssinatura = async () => {
    if (!usuarioId) return;

    setLoading(true);
    try {
      const response = await assinaturaUsuario();
      if (response.success) {
        const assinaturasUsuario = response.data.assinaturas.filter(
          (assinatura: Assinatura) =>
            assinatura.usuarioId === parseInt(usuarioId, 10)
        );
        setAssinaturas(assinaturasUsuario);
      } else {
        setAssinaturas([]);
      }
    } catch (error) {
      console.error("Erro ao buscar assinaturas:", error);
      setAssinaturas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      fetchAssinatura();
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

  const renderNoAssinatura = () => (
    <NoItemsFound message="Nenhuma assinatura encontrada." />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 md:px-10 md:pt-6 w-full" space="2xl">
        {assinaturas.length === 0 ? (
          renderNoAssinatura()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="p-4"
          >
            <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
              {assinaturas.map((assinatura) => (
                <GridItem
                  key={assinatura.id}
                  className="flex-1 p-6 rounded-md shadow-lg bg-white"
                  _extra={{
                    className: "",
                  }}
                >
                  <VStack className="items-center">
                    <Text className="text-gray-700 font-semibold text-sm uppercase">
                      {assinatura.atleticaNome}
                    </Text>
                    <Text className="text-gray-500 font-semibold text-2xl uppercase">
                      {assinatura.planoNome}
                    </Text>
                    <Text className="font-bold text-xl mt-2">
                      R$ {assinatura.planoValor.toFixed(2)}
                    </Text>
                    <Text className="text-gray-500 text-sm mb-4">
                      /{" "}
                      {assinatura.planoDuracao === 30
                        ? "mês"
                        : `${assinatura.planoDuracao} meses`}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-2">
                      Início:{" "}
                      {new Date(assinatura.dataInicio).toLocaleDateString()}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Fim: {new Date(assinatura.dataFim).toLocaleDateString()}
                    </Text>
                    <Text className="font-bold text-xl mt-2 mb-4">
                      Status: {assinatura.statusAssinatura}
                    </Text>
                  </VStack>
                  <VStack className="items-center">
                    {assinatura.statusAssinatura === "PAGA" ? (
                      <VStack space="2xl">
                        <Button
                          variant="link"
                          className="text-gray-500 text-sm"
                          onPress={() => toggleExpand(assinatura.id)}
                        >
                          <span>Veja os benefícios</span>
                          {expandedPlanos.has(assinatura.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>

                        {expandedPlanos.has(assinatura.id) && (
                          <VStack space="lg" className="items-center">
                            {assinatura.planoDescricao.map((beneficio, index) => (
                              <Text key={index} className="text-gray-700 text-sm">
                                ✔️ {beneficio.beneficioDescricao}
                              </Text>
                            ))}
                          </VStack>
                        )}
                      </VStack>
                    ) : (
                      assinatura.statusAssinatura === "PENDENTE" && (
                        <Button
                          variant="solid"
                          className="w-full"
                          onPress={async () => {
                            const response = await pagamentoAssinatura(assinatura.planoId);
                            if (response.success && response?.data) {
                              window.location.href = response.data.url;
                            } else {
                              alert("Erro ao iniciar pagamento.");
                            }
                          }}
                        >
                          <ButtonText>Efetuar pagamento</ButtonText>
                        </Button>
                      )
                    )}
                    {assinatura.statusAssinatura !== "CANCELADA" && (
                      <Button
                        variant="solid"
                        className="w-full mt-4"
                        onPress={async () => {
                          const response = await cancelarAssinatura(assinatura.id);
                          if (response.success) {
                            fetchAssinatura();
                          } else {
                            alert("Erro ao cancelar assinatura.");
                          }
                        }}
                      >
                        <ButtonText>Cancelar Assinatura</ButtonText>
                      </Button>
                    )}
                  </VStack>
                </GridItem>
              ))}
            </Grid>
          </ScrollView>
        )}
      </VStack>
    </Box>
  );
};

export const Assinaturas = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Minhas Assinaturas" isSidebarVisible={true}>
        <Main />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
