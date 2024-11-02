import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "../../sections/LayoutComponents";
import { MobileFooter } from "../../sections/MobileFooter";
import { PlanosList } from "../admin/plano-assinatura/planos-list";

export const Planos = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Planos de assinatura" isSidebarVisible={true}>
        <PlanosList showActions={false} />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>
  );
};
