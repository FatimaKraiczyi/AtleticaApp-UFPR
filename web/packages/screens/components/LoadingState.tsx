import { Center } from "@/components/ui/center";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

export const LoadingState = () => (
  <Center className="flex-1 justify-center items-center ">
    <Progress value={46} className="w-96 h-2" size="sm">
      <ProgressFilledTrack className="bg-primary-600" />
    </Progress>
  </Center>
);
