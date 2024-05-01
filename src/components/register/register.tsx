import { useState, SetStateAction } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";

import { PhaseBar } from "./phasebar";
import Phase1 from "./phase1";
import Phase2 from "./phase2";
import Phase3 from "./phase3";
import Phase4 from "./phase4";
import Phase5 from "./phase5";
import { defaultUserDoc, UserDoc } from "@/types/userDoc";

import "./register.css";

export type FormData = UserDoc & { password: string };
type EventHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

export type PhaseComponent = (
  props: {
    formData: FormData;
    handleChange: EventHandler;
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
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [phase, setPhase] = useState(0);

  const handleChange: EventHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitRegister = async () => {
    try {
      const response = await axios.post("/api/register", formData);
      console.log(response.data);
      router.push("/");
    } catch (error) {
      console.error(error);
      router.push("/");
    }
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
        <Phase1 formData={formData} handleChange={handleChange} setPhase={setPhase} />
      ) : phase == 1 ? (
        <Phase2 formData={formData} handleChange={handleChange} setPhase={setPhase} />
      ) : phase == 2 ? (
        <Phase3
          formData={formData}
          handleChange={handleChange}
          setPhase={setPhase}
          profileImageUrl={profileImageUrl}
          setProfileImageUrl={setProfileImageUrl}
        />
      ) : phase == 3 ? (
        <Phase4
          formData={formData}
          handleChange={handleChange}
          setPhase={setPhase}
          setFormData={setFormData}
        />
      ) : phase == 4 ? (
        <Phase5 formData={formData} router={router} submitRegister={submitRegister} />
      ) : null}
    </div>
  );
};
