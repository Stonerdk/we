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
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), formData);
    return NextResponse.json({ message: "register successfully" });
  } catch (error) {
    return NextResponse.json({ message: "register failed: ", error }, { status: 500 });
  }
}
