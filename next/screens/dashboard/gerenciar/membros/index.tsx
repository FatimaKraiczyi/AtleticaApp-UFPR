import { SafeAreaView } from "@/components/ui/safe-area-view";
import { MembrosList } from "./membro-list";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";

export const GerenciarMembros = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Membros" isSidebarVisible={true}>
        <MembrosList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
