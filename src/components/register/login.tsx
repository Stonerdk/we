import { useEffect, useState, useMemo, SetStateAction, FormEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { signIn } from "next-auth/react";

export const LoginComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin: FormEventHandler = async (event) => {
    event.preventDefault();

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (res?.ok) {
      console.log("Login Success", res);
      router.push("/");
    } else {
      console.log("Login Failed", res);
      // TODO: toast
    }
  };

  return (
    <div
      style={{
        top: "75%",
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
              borderColor: "black",
              borderRadius: "10px",
              borderWidth: "2px",
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
              borderColor: "black",
              borderRadius: "10px",
              borderWidth: "2px",
            }}
          />
        </Form.Group>
        <Button
          variant="success"
          style={{
            width: "100%",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
          onClick={handleLogin}
        >
          로그인
        </Button>
        <Button
          variant="link"
          style={{
            width: "100%",
            marginBottom: "10px",
            borderRadius: "10px",
            color: "black",
          }}
          onClick={() => router.push("/register")}
        >
          계정 만들기
        </Button>
      </Form>
    </div>
  );
};
