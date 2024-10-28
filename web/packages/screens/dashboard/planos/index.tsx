import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "../../components/LayoutComponents";
import { MobileFooter } from "../../components/MobileFooter";
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
