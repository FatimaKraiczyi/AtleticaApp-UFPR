import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ProdutosList } from "../admin/loja/produt-list";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";

export const ProdutosAtletica = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Produtos" isSidebarVisible={true}>
        <ProdutosList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
