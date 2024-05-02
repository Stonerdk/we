import { auth, db } from "@/firebase/firebasedb";
import { UserDoc, defaultUserDoc } from "@/types/userDoc";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const reqFormData: Partial<UserDoc> & { password: string } = await req.json();
  const formData = { ...defaultUserDoc, ...reqFormData };
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
