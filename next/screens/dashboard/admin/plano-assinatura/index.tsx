import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "../../../sections/LayoutComponents";
import { MobileFooter } from "../../../sections/MobileFooter";
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
