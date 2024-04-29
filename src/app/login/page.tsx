"use client";

import { BackgroundComponent } from "@/components/background/background";
import { LoginComponent } from "@/components/register/login";

export default function Home({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <BackgroundComponent>
      <LoginComponent />
    </BackgroundComponent>
  );
}
