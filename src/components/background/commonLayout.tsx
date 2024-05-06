import Link from "next/link";
import "./common.css";
import { FiChevronLeft } from "react-icons/fi";
import LoadingComponent from "../common/loading";

export const CommonLayout = ({
  children,
  title,
  loading,
}: Readonly<{ title: string; children: React.ReactNode; loading?: boolean }>) => (
  <>
    <div className="container">
      <div className="header">
        <div className="flex text-align-left">
          <Link href="/">
            <FiChevronLeft size="1.5em" color="black" />
          </Link>
        </div>
        <div className="flex text-align-center">
          <b>{title}</b>
        </div>
        <div className="flex"></div>
      </div>
      <div className="content">{loading ? <LoadingComponent /> : children}</div>
    </div>
  </>
);
