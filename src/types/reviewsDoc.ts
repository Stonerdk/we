import { Timestamp } from "firebase/firestore";

export interface ReviewsDoc {
  classID: string;
  menteeName: string;
  menteeProfileURL: string;
  menteeID: string;
  mentorID: string;
  review: string;
  score: number;
  datetime: Timestamp;
}
// denormalized

export const defaultReviewsDoc: ReviewsDoc = {
  classID: "",
  menteeID: "",
  menteeName: "",
  menteeProfileURL: "",
  mentorID: "",
  review: "",
  score: 5,
  datetime: Timestamp.now(),
};
