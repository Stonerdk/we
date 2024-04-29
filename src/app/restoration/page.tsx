import { Layout } from "../layout";
import Protected from "../protected";

const Page = () => (
  <Protected>
    <Layout title="환경정화">
      <div>이 페이지는 환경정화 페이지입니다.</div>
    </Layout>
  </Protected>
);

export default Page;
