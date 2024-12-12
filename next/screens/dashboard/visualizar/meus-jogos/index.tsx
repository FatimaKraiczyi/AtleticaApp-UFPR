import { SafeAreaView } from "@/components/ui/safe-area-view";

import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { JogosList } from "../../gerenciar/jogos/jogos-list";

export const MeusJogos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Meus Jogos" isSidebarVisible={true}>
				<JogosList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
