"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BackgroundComponent } from "@/components/background/background";
import { RegisterComponent } from "@/components/register/register";

export default function Home() {
  return (
    <BackgroundComponent>
      <RegisterComponent />
    </BackgroundComponent>
  );
}
