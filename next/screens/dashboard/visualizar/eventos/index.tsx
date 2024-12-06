import { SafeAreaView } from "@/components/ui/safe-area-view";

import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { EventsList } from "../../gerenciar/eventos/event-list";

export const Eventos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Festas" isSidebarVisible={true}>
				<EventsList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
