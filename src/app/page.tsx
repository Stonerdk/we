"use client";

import { BackgroundComponent } from "@/components/background/background";
import Protected from "./protected";

import Image from "next/image";

import btnCoexistence from "/public/assets/main/btn_coexistence.png";
import btnMentor from "/public/assets/main/btn_mentor.png";
import btnMetaverse from "/public/assets/main/btn_metaverse.png";
import btnRestoration from "/public/assets/main/btn_restoration.png";
import btnStudent from "/public/assets/main/btn_student.png";
import btnTown from "/public/assets/main/btn_town.png";
import btnAdmin from "/public/assets/main/btn_admin.png";
import { Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useWarningToast } from "@/hooks/useWarningToast";
import styled from "styled-components";
import { auth } from "@/firebase/firebaseClient";
import { signOut } from "firebase/auth";
import { useChatroom } from "@/hooks/useChatroom";

const Overlay = styled.div<{ isactive: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${(props) => (props.isactive === "true" ? 1000 : -1)};
  opacity: ${(props) => (props.isactive === "true" ? 1 : 0)};
  backdrop-filter: blur(3px);
  transition: opacity 0.2s ease-in-out;
`;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser(setLoading);
  const { chatRoomList } = useChatroom(user, setLoading);
  const { openToast, WarningToast } = useWarningToast();
  const [chatCount, setChatCount] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    setChatCount(chatRoomList.reduce((acc, cur) => acc + cur.count, 0));
  }, [chatRoomList]);

  return (
    <Protected>
      {/* {loading && ( */}
      <Overlay isactive={loading ? "true" : "false"}>
        <Spinner animation="border" variant="white" />
      </Overlay>
      {/* )} */}
      <BackgroundComponent globe>
        <Image
          src={btnStudent}
          alt={"희망학생"}
          onClick={() => {
            setLoading(true);
            router.push("/student");
          }}
          style={{ width: "22%", left: "2%", top: "20%" }}
        />

        <div
          style={{
            width: "25%",
            left: "37%",
            top: "15%",
          }}
        >
          <Image
            src={btnMentor}
            alt={"멘토/멘티"}
            onClick={() => {
              setLoading(true);
              router.push("/mentor");
            }}
          />

          {chatCount > 0 && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "#ce2222",
                color: "white",
                right: "3%",
                top: "3%",
                textAlign: "center",
                borderRadius: "15px",
                paddingLeft: "7px",
                paddingRight: "7px",
                fontSize: "13pt",
                fontStyle: "bold",
              }}
            >
              {chatCount}
            </div>
          )}
        </div>

        <Image
          src={btnTown}
          alt={"마을의 역사"}
          onClick={() => {
            setLoading(true);
            router.push("/town");
          }}
          style={{ width: "25%", left: "72%", top: "20%" }}
        />

        <Image
          src={btnRestoration}
          alt={"환경 정화"}
          onClick={() => {
            setLoading(true);
            router.push("/restoration");
          }}
          style={{ width: "25%", left: "0%", top: "70%" }}
        />

        <Image
          src={btnCoexistence}
          alt={"지역상생"}
          onClick={() => {
            setLoading(true);
            router.push("/region");
          }}
          style={{ width: "25%", left: "26%", top: "75%" }}
        />

        <Image
          src={btnMetaverse}
          alt={"메타버스"}
          onClick={() => {
            window.open("https://web.zepeto.me/ko/detail/w8mWG3wK879tPz52NOtKste?referrer=search", "_blank");
          }}
          style={{ width: "25%", left: "52%", top: "77%" }}
        />

        <Image
          src={btnAdmin}
          alt={"관리자"}
          style={{ width: "25%", left: "75%", top: "71%" }}
          onClick={() => {
            if (user?.isAdmin) {
              setLoading(true);
              router.push("/admin");
            } else {
              openToast("관리자만 접근 가능합니다.");
            }
          }}
        />

        <Button
          variant="link"
          onClick={async () => {
            setLoading(true);
            await signOut(auth);
            setLoading(false);
          }}
          style={{
            position: "absolute",
            width: "40%",
            left: "30%",
            top: "90%",
            color: "white",
          }}
        >
          로그아웃
        </Button>
        <WarningToast style={{ top: "5%" }} />
      </BackgroundComponent>
    </Protected>
  );
}
