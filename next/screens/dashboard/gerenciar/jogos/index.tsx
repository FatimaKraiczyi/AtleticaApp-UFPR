import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { EventsList } from "../eventos/event-list";

export const GerenciarJogos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Jogos" isSidebarVisible={true}>
        <EventsList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
