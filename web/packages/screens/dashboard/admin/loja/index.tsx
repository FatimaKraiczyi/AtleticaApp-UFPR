import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "../../../components/LayoutComponents";
import { ProdutosList } from "./produt-list";
import { MobileFooter } from "../../../components/MobileFooter";

export const AdminLoja = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Loja" isSidebarVisible={true}>
        <ProdutosList showActions={true} />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
