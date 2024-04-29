import { Layout } from "../layout";
import Protected from "../protected";

const Page = () => (
  <Protected>
    <Layout title="메타버스">
      <div>이 페이지는 메타버스 페이지입니다.</div>
    </Layout>
  </Protected>
);

export default Page;
