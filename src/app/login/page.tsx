"use client";

import { BackgroundComponent } from "@/components/background/background";
import { LoginComponent } from "@/components/register/login";

export default function Home() {
  return (
    <BackgroundComponent>
      <LoginComponent />
    </BackgroundComponent>
  );
}
