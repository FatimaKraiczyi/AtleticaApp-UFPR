import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "../../../sections/LayoutComponents";
import { ProdutosList } from "./produt-list";
import { MobileFooter } from "../../../sections/MobileFooter";

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
