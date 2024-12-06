import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { AtleticasList } from "./atletica-list";

export const GerenciarAtleticas = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Gerenciar Atleticas" isSidebarVisible={true}>
        <AtleticasList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
