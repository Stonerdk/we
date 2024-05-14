"use client";
import { CommonLayout } from "@/components/background/commonLayout";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import Protected from "../protected";
import { Nav } from "react-bootstrap";
import { AdminClasses } from "@/components/admin/adminClasses";
import { AdminRestoration } from "@/components/admin/adminRestoration";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useUser(setLoading);
  const [navKey, setNavKey] = useState<string>("classes");

  if (!user || !user?.isAdmin) {
    return (
      <CommonLayout title="관리자">
        <div>관리자만 접근 가능합니다.</div>
      </CommonLayout>
    );
  }

  return (
    <Protected>
      <CommonLayout title="관리자" loading={loading}>
        <Nav
          activeKey={navKey}
          onSelect={(selectedKey) => setNavKey(selectedKey ?? "")}
          variant="tabs"
          style={{
            marginBottom: "0.5rem",
          }}
        >
          <Nav.Item>
            <Nav.Link eventKey="classes">수업 관리</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="restoration">환경 정화</Nav.Link>
          </Nav.Item>
        </Nav>
        {navKey === "classes" ? (
          <AdminClasses user={user} />
        ) : navKey === "restoration" ? (
          <AdminRestoration />
        ) : (
          <></>
        )}
      </CommonLayout>
    </Protected>
  );
};

export default Page;
