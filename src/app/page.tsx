import Image, { StaticImageData } from "next/image";
import "./main.css";

import assetGlobe from "../../public/assets/main/asset_globe.png";
import assetLogo from "../../public/assets/main/asset_logo.png";
import assetPeople from "../../public/assets/main/asset_people.png";

import btnCoexistence from "../../public/assets/main/btn_coexistence.png";
import btnMentor from "../../public/assets/main/btn_mentor.png";
import btnMetaverse from "../../public/assets/main/btn_metaverse.png";
import btnRestoration from "../../public/assets/main/btn_restoration.png";
import btnStudent from "../../public/assets/main/btn_student.png";
import btnTown from "../../public/assets/main/btn_town.png";
import btnAdmin from "../../public/assets/main/btn_admin.png";
import Link from "next/link";

export default function Home() {
  return (
      <div className="background">
        <Image src="/assets/main/background.png" fill={true} alt={"background"}/>

        <Image src={assetGlobe} alt={"globe"} />
        <Image src={assetLogo} alt={"logo"} style={{ width: "50%", left: "25%", top: "2%" }}/>
        <Image src={assetPeople} alt={"people"} />
        <Link href="/student" style={{width: "25%", left: "2%", top: "20%"}}>
          <Image src={btnStudent} alt={"희망학생"}  />
        </Link>
        <Link href="/mentor" style={{width: "25%", left: "37%", top: "15%"}}>
          <Image src={btnMentor} alt={"멘토/멘티"} />
        </Link>
        <Link href="/town" style={{width: "25%", left: "72%", top: "20%"}}>
          <Image src={btnTown} alt={"마을의 역사"} />
        </Link>

        <Link href="/restoration" style={{width: "25%", left: "0%", top: "75%"}}>
          <Image src={btnRestoration} alt={"환경 정화"} />
        </Link>
        <Link href="/region" style={{width: "25%", left: "26%", top: "80%"}}>
          <Image src={btnCoexistence} alt={"지역상생"} />
        </Link>
        <Link href="/metaverse" style={{width: "25%", left: "52%", top: "82%"}}>
          <Image src={btnMetaverse} alt={"메타버스"} />
        </Link>
        <Link href="/admin" style={{width: "25%", left: "75%", top: "76%"}}>
          <Image src={btnAdmin} alt={"관리자"} />
        </Link>

      </div>
  );
}
