import { useState, SetStateAction } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";

import { PhaseBar } from "./phasebar";
import Phase0 from "./phase0";
import Phase1 from "./phase1";
import Phase2 from "./phase2";
import Phase3 from "./phase3";
import Phase4 from "./phase4";
import Phase5 from "./phase5";
import { defaultUserDoc, UserDoc } from "@/types/userDoc";

import "./register.css";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db, storage } from "@/firebase/firebaseClient";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import LoadingComponent from "../common/loading";

export type RegisterFormData = UserDoc & { password: string; profileImage: File | null };
type EventHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

export type PhaseComponent = (
  props: {
    formData: RegisterFormData;
    setPhase: React.Dispatch<SetStateAction<number>>;
  } & Partial<Record<string, any>>
) => JSX.Element;

const initialValues: RegisterFormData = {
  ...defaultUserDoc,
  profileImage: null,
  password: "",
};

export const RegisterComponent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>(initialValues);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [phase, setPhase] = useState(0);

  const handleChange: EventHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitRegister = async () => {
    const { password, ...formDataWithoutPassword } = formData;
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
    const user = userCredential.user;

    await sendEmailVerification(auth.currentUser!, {
      url: "https://projectwe-421109.web.app/",
      handleCodeInApp: true,
    });

    if (profileImage) {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, profileImage);
      const imageUrl = await getDownloadURL(storageRef);
      formDataWithoutPassword.profileURL = imageUrl;
    }

    await setDoc(doc(db, "users", user.uid), formDataWithoutPassword);
  };

  const checkValidEmail = () =>
    getDocs(query(collection(db, "users"), where("email", "==", formData.email))).then((res) => res.empty);

  return (
    <div className="register-container">
      <div className="register-x" onClick={() => router.push("/")}>
        <FiX />
      </div>
      <div>
        <div className="register-title">계정 생성</div>
        <PhaseBar phase={phase + 1} />
      </div>
      {phase == 0 ? (
        <Phase0 formData={formData} setFormData={setFormData} setPhase={setPhase} />
      ) : phase == 1 ? (
        <Phase1 formData={formData} handleChange={handleChange} setPhase={setPhase} />
      ) : phase == 2 ? (
        <Phase2
          formData={formData}
          handleChange={handleChange}
          setPhase={setPhase}
          checkValidEmail={checkValidEmail}
        />
      ) : phase == 3 ? (
        <Phase3
          formData={formData}
          handleChange={handleChange}
          setPhase={setPhase}
          setProfileImage={setProfileImage}
        />
      ) : phase == 4 ? (
        <Phase4
          formData={formData}
          handleChange={handleChange}
          setPhase={setPhase}
          setFormData={setFormData}
          submitRegister={submitRegister}
        />
      ) : phase == 5 ? (
        <Phase5 formData={formData} router={router} />
      ) : null}
    </div>
  );
};
