"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import Protected from "../protected";

const Page = () => (
  <Protected>
    <CommonLayout title="메타버스">
      <div>이 페이지는 메타버스 페이지입니다.</div>
    </CommonLayout>
  </Protected>
);

export default Page;
