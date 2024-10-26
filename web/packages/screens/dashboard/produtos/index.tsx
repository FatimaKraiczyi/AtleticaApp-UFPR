import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@/components/ui/slider";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "../../components/LayoutComponents";
import { MobileFooter } from "../../components/MobileFooter";
import { AdminLoja } from "../admin/loja";

export const ProdutosAtletica = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <LayoutComponents title="Produtos" isSidebarVisible={true}>
        <AdminLoja isAdmin={false} />
      </LayoutComponents>
    </SafeAreaView>
  );
};
