"use client";
import { getToken } from "@/api/token";
import { LoadingState } from "@/components/sections/LoadingState";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();

      if (token) {
        router.replace("dashboard");
      } else {
        router.replace("auth/signin");
      }

      setLoading(false);
    };

    checkToken();
  }, [router]);

  if (loading) {
    return <LoadingState />;
  }

  return null;
};

export default Page;