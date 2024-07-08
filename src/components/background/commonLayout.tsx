import Link from "next/link";
import "./common.css";
import { FiChevronLeft } from "react-icons/fi";
import LoadingComponent from "../common/loading";
import { BsChat, BsChatFill } from "react-icons/bs";

export const CommonLayout = ({
  children,
  title,
  loading,
  chat,
  chatCount,
  backroute,
}: Readonly<{
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  chat?: boolean;
  chatCount?: number;
  backroute?: string;
}>) => (
  <>
    <div className="container">
      <div className="header">
        <div className="flex text-align-left">
          <Link href={backroute ?? "/"}>
            <FiChevronLeft size="1.5em" color="black" />
          </Link>
        </div>
        <div className="flex text-align-center">
          <b>{title}</b>
        </div>
        <div className="flex text-align-center">
          {chat && (
            <Link href="/chat">
              <BsChat size="1.5em" color="black" />
              {chatCount && chatCount > 0 ? (
                <div
                  style={{
                    position: "absolute",
                    backgroundColor: "#dd2222",
                    color: "white",
                    right: "1%",
                    top: "10%",
                    textAlign: "center",
                    borderRadius: "15px",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    fontSize: "9pt",
                    fontStyle: "bold",
                  }}
                >
                  {chatCount}
                </div>
              ) : (
                ""
              )}
            </Link>
          )}
        </div>
      </div>
      <div className="content">
        {loading ? (
          <div
            className="flex align-items-center justify-content-center"
            style={{ width: "100%", height: "100%" }}
          >
            <LoadingComponent />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  </>
);
