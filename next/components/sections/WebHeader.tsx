import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon, MenuIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Avatar } from "@/components/ui/avatar";
import { LogOut } from "lucide-react-native";
import useRouter from "@unitools/router";

type HeaderProps = {
  title: string;
  toggleSidebar: () => void;
};

export const WebHeader = (props: HeaderProps) => {
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
    <HStack className="p-3 bg-background-0 items-center justify-between border-b border-border-300">
      <HStack className="items-center">
        <Pressable
          onPress={() => {
            props.toggleSidebar();
          }}
        >
          <Icon as={MenuIcon} size="lg" className="mx-5" />
        </Pressable>
        <Text className="text-2xl">{props.title}</Text>
      </HStack>
      <HStack className="items-center">
        <Avatar>
          <Image source={require("@/assets/auth/logo.png")} size="xs" />
        </Avatar>
        <Pressable onPress={handleLogout}>
          <Icon as={LogOut} size="lg" className="mx-5" />
        </Pressable>
      </HStack>
    </HStack>
  );
};
