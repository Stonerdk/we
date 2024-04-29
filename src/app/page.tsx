"use client";

import { BackgroundComponent } from "@/components/background/background";
import { MainButtons } from "@/components/background/mainbuttons";
import Protected from "./protected";

export default function Home() {
  return (
    <Protected>
      <BackgroundComponent>
        <MainButtons />
      </BackgroundComponent>
    </Protected>
  );
}
