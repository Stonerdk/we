export interface UserDoc {
  name: string;
  birthday: string;
  gender: string;
  bio: string;
  email: string;
  ktalkID: string;
  desiredSubjects: string[];
}

export const defaultUserDoc: UserDoc = {
  name: "",
  birthday: "",
  gender: "",
  bio: "",
  email: "",
  ktalkID: "",
  desiredSubjects: [],
};
