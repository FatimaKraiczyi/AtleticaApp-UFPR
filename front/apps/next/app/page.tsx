"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  
  useEffect(() => {
    const token = sessionStorage.getItem("x-access-token");
    
    if (token) {
      router.replace("dashboard/dashboard-layout");
    } else {
      router.replace("auth/signin");
    }
  }, [router]);

  return null;
};

// outras rotas do front

/* 
router.push("auth/signup");
router.push("auth/forgot-password");
router.push("auth/create-password");
router.push("news-feed/news-and-feed");
router.push("profile/profile");


 */
export default Page;
