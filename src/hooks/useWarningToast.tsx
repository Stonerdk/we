import { Warning } from "@/components/common/warning";
import { useState } from "react";
import { Toast } from "react-bootstrap";

export const useWarningToast = () => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<JSX.Element>(<></>);

  const openToast = (message: string | JSX.Element) => {
    setToastMessage(<>{message}</>);
    setShowToast(true);
  };

  const WarningToast = ({ style }: { style?: React.CSSProperties }) => (
    <>
      <Toast
        onClose={() => {
          setShowToast(false);
          setToastMessage(<></>);
        }}
        delay={3000}
        show={showToast}
        autohide
        className="fade"
        style={{ position: "absolute", left: "5%", width: "90%", ...style }}
      >
        <Toast.Body>
          <Warning>{toastMessage}</Warning>
        </Toast.Body>
      </Toast>
    </>
  );

  return { openToast, WarningToast };
};
