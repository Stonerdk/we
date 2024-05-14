"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseClient";
import { BackgroundComponent } from "@/components/background/background";
import { Container, Spinner } from "react-bootstrap";
import styled from "styled-components";

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

const Protected = ({ children }: PropsWithChildren): JSX.Element => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <BackgroundComponent>
        <Overlay isactive={loading ? "true" : "false"}>
          <Spinner animation="border" variant="white" />
        </Overlay>
      </BackgroundComponent>
    );
  }

  return <div className="cont">{children}</div>;
};

export default Protected;
