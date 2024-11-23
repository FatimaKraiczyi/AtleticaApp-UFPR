import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { EventsList } from "../eventos/event-list";

export const AdminJogos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Eventos" isSidebarVisible={true}>
        <EventsList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
