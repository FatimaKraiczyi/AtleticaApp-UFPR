import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { ChevronLeftIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import useRouter from "@unitools/router";
export const MobileHeader = (props) => {
    const router = useRouter();
    return (<HStack className="py-4 px-4 mt-10 border-b border-border-50 bg-background-0 items-center" space="md">
      <Pressable onPress={() => router.back()}>
        <Icon as={ChevronLeftIcon}/>
      </Pressable>
      <Text className="text-xl">{props.title}</Text>
    </HStack>);
};
