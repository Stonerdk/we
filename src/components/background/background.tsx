"use client";

import "./background.css";
import assetGlobe from "../../../public/assets/main/asset_globe.png";
import assetLogo from "../../../public/assets/main/asset_logo.png";
import assetPeople from "../../../public/assets/main/asset_people.png";

import Image from "next/image";

export const BackgroundComponent = (props: React.PropsWithChildren<{ globe?: boolean }>) => (
  <div className="background">
    <div className="image-container">
      {props.globe && <Image src={assetGlobe} alt={"globe"} />}
      <Image src={assetLogo} alt={"logo"} style={{ width: "50%", left: "25%", top: "3%" }} />
      {props.globe && <Image src={assetPeople} alt={"people"} style={{ width: "100%" }} />}
      {props.children}
    </div>
  </div>
);
