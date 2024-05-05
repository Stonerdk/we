import { Timestamp } from "firebase/firestore";

export interface ClassesDoc {
  mentorID: string;
  menteeIDs: string[];
  subjects: string[];
  isAdminVerified: boolean;
  rejectedMessage: string;
  datetime: Timestamp;
  duration: number;
  title: string;
  description: string;
  associatedURL: string;
  attachedFileURLs: string[];
  note: string;
}

export const defaultClassesDoc: ClassesDoc = {
  mentorID: "",
  menteeIDs: [],
  subjects: [],
  isAdminVerified: false,
  rejectedMessage: "",
  datetime: Timestamp.now(),
  duration: 35,
  title: "",
  description: "",
  associatedURL: "",
  attachedFileURLs: [],
  note: "",
};
