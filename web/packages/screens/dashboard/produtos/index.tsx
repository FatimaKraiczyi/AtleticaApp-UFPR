import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ProdutosList } from "../admin/loja/produt-list";
import { LayoutComponents } from "../../components/LayoutComponents";
import { MobileFooter } from "../../components/MobileFooter";

export const ProdutosAtletica = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Produtos" isSidebarVisible={true}>
        <ProdutosList showActions={false} />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
