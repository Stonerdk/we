"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

const Protected = ({ children }: PropsWithChildren): JSX.Element => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const authorized = sessionStatus === "authenticated";
  const unAuthorized = sessionStatus === "unauthenticated";
  const loading = sessionStatus === "loading";

  useEffect(() => {
    if (loading) return;

    if (unAuthorized) {
      console.log("not authorized");
      router.push("/login");
    }
  }, [loading, unAuthorized, sessionStatus, router]);

  if (loading) {
    return <></>;
  }

  return authorized ? <div>{children}</div> : <></>;
};

export function AuthSession({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default Protected;
