import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ProdutosList } from "./produt-list";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";

export const GerenciarLoja = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Loja" isSidebarVisible={true}>
        <ProdutosList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
