import { SafeAreaView } from "@/components/ui/safe-area-view";

import { PlanosList } from "../../gerenciar/planos/planos-list";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";

export const Planos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Planos de assinatura" isSidebarVisible={true}>
        <PlanosList />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
