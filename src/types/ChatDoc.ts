import { Timestamp } from "firebase/firestore";

export interface ChatDoc {
  mentee: string;
  mentor: string;
  id?: string;
}

export interface MessageDoc {
  message: string;
  sender: string;
  timestamp: Timestamp;
  id?: string;
}
