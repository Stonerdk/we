import { useEffect, useState, useMemo, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";

export const LoginComponent = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to login");
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
            placeholder="이름을 입력하세요"
            name="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
