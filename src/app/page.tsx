"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BackgroundComponent } from "@/components/background/background";
import { MainButtons } from "@/components/background/mainbuttons";
import { LoginComponent } from "@/components/register/login";

export default function Home({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     router.push("/login");
  //   }
  // }, [ isLoggedIn, router ]);

  return (
    <BackgroundComponent>
      <LoginComponent />
    </BackgroundComponent>
  );
}
