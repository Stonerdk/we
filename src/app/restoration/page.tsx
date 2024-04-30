import { CommonLayout } from "@/components/background/commonLayout";
import Protected from "../protected";

const Page = () => (
  <Protected>
    <CommonLayout title="환경정화">
      <div>이 페이지는 환경정화 페이지입니다.</div>
    </CommonLayout>
  </Protected>
);

export default Page;
