import { SafeAreaView } from "@/components/ui/safe-area-view";
import { PlanosList } from "./planos-list";
import { LayoutComponents } from "@/components/sections/LayoutComponents";
import { MobileFooter } from "@/components/sections/MobileFooter";

export const AdminPlanos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Plano de Assinatura" isSidebarVisible={true}>
        <PlanosList showActions={true} />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
