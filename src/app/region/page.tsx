import { Layout } from "../layout";
import Protected from "../protected";

const Page = () => (
  <Protected>
    <Layout title="지역상생">
      <div>이 페이지는 지역상생 페이지입니다.</div>
    </Layout>
  </Protected>
);

export default Page;
