import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { signInToken } from "@/utils/auth";
import { NoCredentialError } from "@/errors/NoCredentialError";

interface LoginForm {
  email: string;
  password: string;
}

async function findUserByEmail(email: string) {
  // mocked
  if (email === "stkd97@gmail.com")
    return {
      email: "stkd97@gmail.com",
      password: "000000",
    };
  return null;
}

export async function signIn(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new NoCredentialError("Invalid Credential");
  }

  // const isValid = await bcrypt.compare(password, user.password);
  const isValid = password === user.password;
  if (!isValid) {
    throw new NoCredentialError("Invalid Credential");
  }

  const token = signInToken({ email: email });

  return { user, token };
}

export async function POST(req: Request) {
  const loginForm: LoginForm = await req.json();
  const { email, password } = loginForm;
  try {
    const { user, token } = await signIn(email, password);
    const response = NextResponse.json(user);

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 한 달
      path: "/",
    });

    return response;
  } catch (e) {
    if (e instanceof NoCredentialError) {
      return NextResponse.json({ message: e.message }, { status: 401 });
    } else if (e instanceof Error) {
      return NextResponse.json({ message: `Unknown error ${e.message}` }, { status: 500 });
    }
  }
}
