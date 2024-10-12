import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Image } from "react-native";

export const NoItemsFound = ({ message }: { message: string }) => (
  <Center className="flex-1 mt-14 justify-center items-center h-full">
    <Image
      source={{
        uri: "https://img.icons8.com/external-outline-andi-nur-abdillah/100/external-Empty-empty-state-(outline)-outline-andi-nur-abdillah.png",
      }}
      style={{ width: 100, height: 100, tintColor: "#8E8E8E" }}
      resizeMode="contain"
    />
    <Text className="text-center text-gray-500 dark:text-gray-400 mt-4">
      {message}
    </Text>
  </Center>
);
