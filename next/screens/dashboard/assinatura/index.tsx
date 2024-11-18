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
import { assinaturaUsuarioId } from "@/api/assinatura";
import { Assinatura } from "@/interfaces/assinatura";

const Main = ({ usuarioId }: { usuarioId: number }) => {
  const [loading, setLoading] = useState(true);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);

  const fetchAssinatura = async () => {
    setLoading(true);
    try {
      const response = await assinaturaUsuarioId(usuarioId);
      if (response.success) {
        setAssinaturas(response.data);
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
    fetchAssinatura();
  }, [usuarioId]);

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
            <Grid
              className="gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              _extra={{
                className: "",
              }}
            >
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
                    <Text className="font-bold text-xl mt-2  mb-4">
                      Status: {assinatura.statusAssinatura}
                    </Text>
                  </VStack>
                  <VStack className="items-center">
                    <Button variant="solid" className="w-full">
                      <ButtonText>Efetuar pagamento</ButtonText>
                    </Button>
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
  // Exemplo: Aqui você deve obter o ID do usuário autenticado
  const usuarioId = 2; // Substitua pelo ID dinâmico obtido do contexto ou autenticação

  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Minhas Assinaturas" isSidebarVisible={true}>
        <Main usuarioId={usuarioId} />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
