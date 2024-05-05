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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/firebase/firebaseClient";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export type FormData = UserDoc & { password: string };
type EventHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

export type PhaseComponent = (
  props: {
    formData: FormData;
    setPhase: React.Dispatch<SetStateAction<number>>;
  } & Partial<Record<string, any>>
) => JSX.Element;

const initialValues: FormData = {
  ...defaultUserDoc,
  password: "",
};

export const RegisterComponent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialValues);
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

    if (profileImage) {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, profileImage);
      const imageUrl = await getDownloadURL(storageRef);
      formDataWithoutPassword.profileURL = imageUrl;
    }

    await setDoc(doc(db, "users", user.uid), formDataWithoutPassword);
  };

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
        <Phase2 formData={formData} handleChange={handleChange} setPhase={setPhase} />
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
        />
      ) : phase == 5 ? (
        <Phase5 formData={formData} router={router} submitRegister={submitRegister} />
      ) : null}
    </div>
  );
};
