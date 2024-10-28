import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "../../../components/LayoutComponents";
import { MobileFooter } from "../../../components/MobileFooter";
import { PlanosList } from "./planos-list";

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
