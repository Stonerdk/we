"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import Protected from "../protected";

const Page = () => (
  <Protected>
    <CommonLayout title="지역상생">
      <div>이 페이지는 지역상생 페이지입니다.</div>
    </CommonLayout>
  </Protected>
);

export default Page;
