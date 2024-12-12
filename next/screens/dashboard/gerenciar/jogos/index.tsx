import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { JogosList } from "./jogos-list";

export const GerenciarJogos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Jogos" isSidebarVisible={true}>
        <JogosList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
