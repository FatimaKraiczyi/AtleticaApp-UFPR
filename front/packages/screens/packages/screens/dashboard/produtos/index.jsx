import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@/components/ui/slider";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { Checkbox, CheckboxGroup, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LayoutComponents } from "../../components/LayoutComponents";
import { MobileFooter } from "../../components/MobileFooter";
const MainContent = () => {
    const [sliderValue, setSliderValue] = useState(3500);
    const [values, setValues] = useState(["entirePlace"]);
    const handleChange = (value) => {
        setSliderValue(value);
    };
    const sidebarFiltersPriceRange = [
        {
            label: "below ₹2001",
            value: "below ₹2001",
        },
        {
            label: "₹2001 - ₹3000",
            value: "₹2001 - ₹3000",
        },
        {
            label: "₹3001 - ₹4001",
            value: "₹3001 - ₹4001",
        },
        {
            label: "above ₹3001",
            value: "above ₹3001",
        },
    ];
    return (<VStack space="md">
      <Heading size="sm">Price Range</Heading>
      <Slider minValue={800} maxValue={5000} w="100%" size="sm" value={sliderValue} onChange={(value) => {
            handleChange(value);
        }}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip placement="bottom" trigger={(triggerProps) => {
            return <SliderThumb {...triggerProps}/>;
        }}>
          <TooltipContent>
            <Text>₹{sliderValue}</Text>
          </TooltipContent>
        </Tooltip>
      </Slider>
      <CheckboxGroup value={values} onChange={setValues} className="mt-3" accessibilityLabel="price filter">
        {sidebarFiltersPriceRange.map((priceRange) => {
            return (<Checkbox value={priceRange.value} size="sm" key={priceRange.value} accessibilityLabel={priceRange.value}>
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon}/>
              </CheckboxIndicator>
              <CheckboxLabel className="ml-2">{priceRange.label}</CheckboxLabel>
            </Checkbox>);
        })}
      </CheckboxGroup>
    </VStack>);
};
export const ProdutosAtletica = () => {
    return (<SafeAreaView className="h-full w-full">
      <LayoutComponents title="Produtos" isSidebarVisible={true}>
        <MainContent />
      </LayoutComponents>
      <MobileFooter />
    </SafeAreaView>);
};
