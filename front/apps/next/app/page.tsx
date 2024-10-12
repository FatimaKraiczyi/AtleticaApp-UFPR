"use client";
import { LoadingState } from "@/screens/components/LoadingState";
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
    return <LoadingState />;
  }

  return null;
};

export default Page;