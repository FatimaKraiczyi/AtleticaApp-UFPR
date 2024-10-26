"use client";
import { LoadingState } from "@/screens/components/LoadingState";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "../../../api/token";

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