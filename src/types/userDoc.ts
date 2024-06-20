export interface UserDoc {
  name: string;
  birthday: string;
  gender: string;
  bio: string;
  email: string;
  ktalkID: string;
  avgScore: number;
  reviewCnt: number;
  desiredSubjects: string[];
  isMentor: boolean;
  grade?: string;
  isEmailVerified: boolean;
  isAdminVerified?: boolean;
  isAdmin?: boolean;
  profileURL: string;
  id?: string;
}

export const defaultUserDoc: UserDoc = {
  name: "",
  birthday: "",
  gender: "",
  bio: "",
  email: "",
  ktalkID: "",
  avgScore: 0,
  reviewCnt: 0,
  desiredSubjects: [],
  isMentor: false,
  grade: "",
  isEmailVerified: false,
  isAdminVerified: false,
  isAdmin: false,
  profileURL: "https://projectwe-421109.firebaseapp.com/assets/main/blank_profile.png",
};
