import Link from "next/link";
import "./common.css";
import { FiChevronLeft } from "react-icons/fi";

export const CommonLayout = ({ children, title }: Readonly<{ title: string; children: React.ReactNode }>) => (
  <div className="container">
    <div className="header">
      <div className="flex text-align-left">
        <Link href="/">
          <FiChevronLeft />
        </Link>
      </div>
      <div className="flex text-align-center">{title}</div>
      <div className="flex"></div>
    </div>
    <div className="content">{children}</div>
  </div>
);
