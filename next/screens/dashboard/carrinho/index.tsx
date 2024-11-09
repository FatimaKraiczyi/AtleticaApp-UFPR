import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { LoadingState } from "@/components/sections/LoadingState";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { NoItemsFound } from "@/components/sections/NoItemsFound";
import { Produto } from "@/interfaces/produto";

export const MainContent = () => {
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  if (loading) {
    return <LoadingState />;
  }

  const renderNoItems = () => (
    <NoItemsFound message="Seu carrinho está vazio" />
  );

  return (
    <Box className="flex-1">
      <VStack className="p-4 pb-0 md:px-10 md:pt-6 w-full" space="2xl">
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
                  _extra={{ className: "flex-1 p-4 relative" }}
                >
                  <Box className="w-full overflow-hidden rounded-md h-72">
                    <Image
                      source={
                        produto.imagem ||
                        require("@/assets/dashboard/image2.png")
                      }
                      alt={produto.nome}
                      size="full"
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
                  </HStack>
                </GridItem>
              ))}
            </Grid>
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
