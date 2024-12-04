import { SafeAreaView } from "@/components/ui/safe-area-view";
import { AtleticasList } from "../../gerenciar/atleticas/atleticas-list";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";

export const Atleticas = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Atléticas" isSidebarVisible={true}>
        <AtleticasList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
