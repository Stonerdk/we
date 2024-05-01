import { auth, db } from "@/firebase/firebasedb";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

interface FormData {
  name: string;
  birthday: string;
  gender: string;
  bio: string;
  email: string;
  password: string;
  ktalkID: string;
  desiredSubjects: string[];
}

export async function POST(req: Request) {
  const formData: FormData = await req.json();
  try {
    const { password, ...formDataWithoutPassword } = formData;
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), formDataWithoutPassword);
    return NextResponse.json({ message: "register successfully" });
  } catch (error) {
    return NextResponse.json({ message: "register failed: ", error }, { status: 500 });
  }
}
