export interface UserDoc {
  name: string;
  birthday: string;
  gender: string;
  bio: string;
  email: string;
  ktalkID: string;
  desiredSubjects: string[];
  isMentor: boolean;
  grade?: string;
  isEmailVerified: boolean;
  isAdminVerified?: boolean;
}

export const defaultUserDoc: UserDoc = {
  name: "",
  birthday: "",
  gender: "",
  bio: "",
  email: "",
  ktalkID: "",
  desiredSubjects: [],
  isMentor: false,
  grade: "",
  isEmailVerified: false,
  isAdminVerified: false,
};
