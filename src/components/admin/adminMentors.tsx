import React, { useEffect, useState, memo } from "react";
import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  deleteDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { Button, Modal, Form } from "react-bootstrap";
import { useMentoringSchedule } from "@/hooks/useMentoringSchedule";
import { ClassesDoc } from "@/types/classesDoc";
import { AdminClassCard } from "@/components/student/adminClassCard";
import LoadingComponent from "@/components/common/loading";
import { StudentCard } from "../student/studentCard";
import { useUser } from "@/hooks/useUser";
import { FaStar } from "react-icons/fa";
import { ReviewsDoc } from "@/types/reviewsDoc";
import { ReviewCard } from "../student/reviewCard";

export const AdminMentors = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useUser(setLoading);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [mentors, setMentors] = useState<(UserDoc & { id: string })[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<(UserDoc & { id: string }) | null>(null);
  const [reviews, setReviews] = useState<(ReviewsDoc & { id: string })[]>([]);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      const q = query(collection(db, "users"), where("isMentor", "==", true));
      const docs = await getDocs(q);
      const mentorList = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as UserDoc & { id: string });

      setMentors(mentorList);
      setLoading(false);
    };

    if (user) {
      fetchMentors();
    }
  }, [user]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const q = query(
        collection(db, "reviews"),
        where("mentorID", "==", selectedMentor?.id ?? ""),
        orderBy("datetime", "desc")
      );
      const docs = await getDocs(q);
      const reviews = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ReviewsDoc & { id: string });
      const reviewsWithMenteeInfo = await Promise.all(
        reviews.map(async (review) => {
          const menteeDoc = await getDoc(doc(db, "users", review.menteeID));
          const menteeData = menteeDoc.data() as UserDoc;
          return {
            ...review,
            menteeName: menteeData.name,
            menteeProfileURL: menteeData.profileURL,
          };
        })
      );
      setReviews(reviewsWithMenteeInfo);
      setLoading(false);
    };
    fetchReviews();
  }, [selectedMentor]);

  return (
    <>
      {loading && <LoadingComponent />}
      <Modal show={showModal} centered>
        <Modal.Header>리뷰 - {selectedMentor?.name ?? ""}</Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: "410px", overflowY: "scroll" }}>
            {loading ? (
              <LoadingComponent />
            ) : (
              reviews.map((review, idx) => (
                <ReviewCard
                  username={review.menteeName}
                  profileURL={review.menteeProfileURL}
                  score={review.score}
                  date={review.datetime.toDate().toLocaleDateString()}
                  review={review.review}
                  key={idx}
                />
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
            style={{ width: 100 }}
          >
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="flex flex-column overflow-y-scroll" style={{ maxHeight: "80vh" }}>
        {mentors.map((mentor) => {
          return (
            <StudentCard
              key={mentor.id}
              user={mentor}
              onClick={() => {
                setSelectedMentor(mentor);
                setShowModal(true);
              }}
            >
              <div className="flex gap-1 align-items-center">
                <FaStar color="gold" />
                <span style={{ color: (mentor?.reviewCnt ?? 0) > 0 ? "black" : "gray" }}>
                  {mentor?.avgScore?.toFixed(1) ?? "0.0"}
                  <small>{` (${mentor?.reviewCnt ?? 0})`}</small>
                </span>
              </div>
            </StudentCard>
          );
        })}
      </div>
    </>
  );
};
