import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";
import { PlanosList } from "../admin/planos/planos-list";

export const Assinaturas = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Minhas Assinaturas" isSidebarVisible={true}>
        <PlanosList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
