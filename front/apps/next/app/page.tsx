"use client";
import { Center } from "@/components/ui/center";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("x-access-token");

    if (token) {
      router.replace("dashboard/dashboard-layout");
    } else {
      router.replace("auth/signin");
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <Center className="flex-1 justify-center items-center ">
        <Progress value={46} className="w-96 h-2" size="sm">
          <ProgressFilledTrack className="bg-primary-600" />
        </Progress>
      </Center>
    );
  }

  return null;
};

export default Page;
