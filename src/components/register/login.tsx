import { useEffect, useState, useMemo, SetStateAction, FormEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Spinner, Toast } from "react-bootstrap";
import { signIn } from "next-auth/react";
import { Warning } from "../common/warning";
import { useWarningToast } from "@/hooks/useWarningToast";

export const LoginComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const { openToast, WarningToast } = useWarningToast();

  const handleLogin: FormEventHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (res?.ok) {
      setLoading(false);
      router.push("/");
    } else {
      let msg =
        res?.error === "CredentialsSignin"
          ? "이메일 혹은 비밀번호가 일치하지 않습니다."
          : "알 수 없는 이유로 로그인에 실패했습니다.";
      setLoading(false);
      openToast(msg);
    }
  };

  return (
    <div
      style={{
        top: "20%",
        width: "100%",
        paddingLeft: "15%",
        paddingRight: "15%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="이메일을 입력하세요"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              marginBottom: "5px",
              borderRadius: "10px",
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="비밀번호를 입력하세요"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginBottom: "5px",
              borderRadius: "10px",
            }}
          />
        </Form.Group>
        <Button
          variant="success"
          style={{
            width: "100%",
            marginBottom: "5px",
            borderRadius: "10px",
          }}
          onClick={handleLogin}
          disabled={loading || email === "" || password === ""}
        >
          {loading ? <Spinner size="sm" /> : "로그인"}
        </Button>
        <hr />
        <div className="flex flex-column align-items-center">
          <Button
            variant="success"
            style={{
              width: "100%",
              flexGrow: 1,
              borderRadius: "10px",
              marginBottom: "5px",
            }}
            onClick={() => router.push("/register")}
          >
            계정 만들기
          </Button>
          <Button
            variant="link"
            style={{
              flexGrow: 1,
              color: "black",
              borderRadius: "10px",
            }}
            onClick={() => {
              openToast("아직 지원되지 않는 기능입니다.");
            }}
          >
            비밀번호를 잊으셨나요?
          </Button>
        </div>
      </Form>
      <WarningToast style={{ top: "-35%" }} />
    </div>
  );
};
