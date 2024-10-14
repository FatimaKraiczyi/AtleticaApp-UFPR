import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { useState } from "react";
import { MobileHeader } from "./MobileHeader";
import { WebHeader } from "./WebHeader";
import { WebSidebar } from "./WebSidebar";
export const LayoutComponents = (props) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(props.isSidebarVisible);
    function toggleSidebar() {
        setIsSidebarVisible(!isSidebarVisible);
    }
    return (<VStack className="h-full w-full bg-background-0">
      <Box className="md:hidden">
        <MobileHeader title={props.title}/>
      </Box>
      <Box className="hidden md:flex">
        <WebHeader toggleSidebar={toggleSidebar} title={props.title}/>
      </Box>
      <VStack className="h-full w-full">
        <HStack className="h-full w-full">
          <Box className="hidden md:flex h-full">
            {isSidebarVisible && <WebSidebar />}
          </Box>
          <VStack className={`w-full ${isSidebarVisible ? "md:w-[calc(100%-12rem)]" : "md:w-full"}`}>
            {props.children}
          </VStack>
        </HStack>
      </VStack>
    </VStack>);
};
