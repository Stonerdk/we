"use client";

import "./background.css";
import assetGlobe from "../../../public/assets/main/asset_globe.png";
import assetLogo from "../../../public/assets/main/asset_logo.png";
import assetPeople from "../../../public/assets/main/asset_people.png";

import Image from "next/image";

export const BackgroundComponent = (props: React.PropsWithChildren) => (
  <div className="background">
    <Image src="/assets/main/background.png" fill={true} alt={"background"} />
    <Image src={assetLogo} alt={"logo"} style={{ width: "50%", left: "25%", top: "2%" }} />
    {props.children}
  </div>
);
