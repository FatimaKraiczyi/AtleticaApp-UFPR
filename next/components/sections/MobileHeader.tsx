import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { ChevronLeftIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { LogOut } from "lucide-react-native";
import useRouter from "@unitools/router";

type MobileHeaderProps = {
  title: string;
};

export const MobileHeader = (props: MobileHeaderProps) => {
  const router = useRouter();

	const handleLogout = () => {
		if (typeof window !== "undefined") {
			sessionStorage.removeItem("userType");
			sessionStorage.removeItem("atletica");
			sessionStorage.removeItem("x-access-token");
		}
		router.push("/auth/signin");
	};

  return (
    <HStack
      className="py-4 px-4 mt-10 border-b border-border-50 bg-background-0 items-center"
      space="md"
    >
      <Pressable onPress={() => router.back()}>
        <Icon as={ChevronLeftIcon} />
      </Pressable>
      <Text className="text-xl flex-1 text-center">{props.title}</Text>
      <Pressable onPress={handleLogout}>
        <Icon as={LogOut} />
      </Pressable>
    </HStack>
  );
};