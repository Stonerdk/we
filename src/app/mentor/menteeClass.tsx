import { StudentCard } from "@/components/student/studentCard";
import { db } from "@/firebase/firebaseClient";
import { ClassesDoc } from "@/types/classesDoc";
import { UserDoc } from "@/types/userDoc";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FormEventHandler, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Accordion, Button, Form } from "react-bootstrap";

import { PropsWithChildren } from "react";
import { CardContainer } from "@/components/common/cardContainer";
import { formatClassDuration } from "@/utils/dateUtil";
import { FiStar } from "react-icons/fi";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { ReviewCard } from "@/components/student/reviewCard";
import { defaultReviewsDoc, ReviewsDoc } from "@/types/reviewsDoc";
import { useUser } from "@/hooks/useUser";
import { redirect, useRouter } from "next/navigation";
import { useChatroom } from "@/hooks/useChatroom";

const subjectMap: { [key: string]: string } = {
  english: "영어",
  math: "수학",
  science: "과학",
  computer: "컴퓨터",
};

const RowPanel = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <Row className="pb-1 pt-1 align-items-center">
    <Col xs={3}>
      <strong>{title}</strong>
    </Col>
    <Col>{children}</Col>
  </Row>
);
export const MenteeClass = ({
  cl,
  setCl,
}: {
  cl: ClassesDoc & { id: string };
  setCl: React.Dispatch<SetStateAction<(ClassesDoc & { id: string }) | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser(setLoading);
  const [userDoc, setUserDoc] = useState<(UserDoc & { id: string }) | null>(null);
  const [userScore, setUserScore] = useState(5);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [myReview, setMyReview] = useState("");
  const [reviews, setReviews] = useState<(ReviewsDoc & { id: string })[]>([]);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [reviewCnt, setReviewCnt] = useState<number>(0);
  const router = useRouter();

  const handleMouseOver = (index: number) => {
    setHoverScore(index);
  };

  const handleMouseLeave = () => {
    setHoverScore(null);
  };

  const handleClick = (index: number) => {
    setUserScore(index);
  };

  const getStarIcon = (index: number) => {
    const actualScore = hoverScore !== null ? hoverScore : userScore;
    if (index < actualScore) {
      if (index + 0.5 < actualScore) {
        return <FaStar color="gold" size="1.2em" />;
      } else {
        return <FaStarHalfAlt color="gold" size="1.2em" />;
      }
    } else {
      return <FaRegStar color="gold" size="1.2em" />;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (cl.menteeIDs.length === 0) return;
      const res = await getDoc(doc(db, "users", cl.mentorID));
      setUserDoc({ id: res.id, ...res.data() } as UserDoc & { id: string });
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("mentorID", "==", cl.mentorID),
        orderBy("datetime", "desc")
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        setLoading(true);

        const reviews = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as ReviewsDoc & { id: string }
        );
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

        const newAvgScore = reviews.reduce((acc, review) => acc + review.score, 0) / reviews.length;

        await updateDoc(doc(db, "users", cl.mentorID), {
          avgScore: newAvgScore,
          reviewCnt: reviews.length,
        });

        setAvgScore(newAvgScore);
        setReviewCnt(reviews.length);
        setReviews(reviewsWithMenteeInfo);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchReviews();
  }, [cl.mentorID]);

  const submitReview: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (user) {
      addDoc(collection(db, "reviews"), {
        ...defaultReviewsDoc,
        classID: cl.id,
        menteeID: user.id,
        mentorID: cl.mentorID,
        review: myReview,
        score: userScore,
        datetime: cl.datetime,
      });
    }
  };

  const startMessage = async (u: UserDoc & { id: string }) => {
    router.push(`/chat/${u.id}`);
  };

  if (loading || !userDoc) return <></>;
  return (
    <CardContainer style={{ marginTop: "5px" }}>
      <div className="m-2">
        <b>내 멘토</b>
      </div>
      {userDoc && (
        <StudentCard
          user={userDoc}
          frame={false}
          style={{ maxHeight: "80vh" }}
          onMessage={() => startMessage(userDoc)}
        >
          <FaStar color="gold" className="mr-1" />
          <span style={{ color: reviewCnt > 0 ? "black" : "gray", height: "100%" }}>
            {avgScore.toFixed(1)}
            <small>{` (${reviewCnt})`}</small>
          </span>
        </StudentCard>
      )}
      <div className="ml-2 mr-2 flex flex-column gap-2">
        <RowPanel title="시간">{formatClassDuration(cl.datetime.toDate(), cl.duration)}</RowPanel>
        <RowPanel title="과목">
          {cl.subjects.map((subject, index) => (
            <Subject key={index}>{subjectMap[subject]}</Subject>
          ))}
        </RowPanel>
        <RowPanel title="내용">{cl.description}</RowPanel>
        <RowPanel title="URL">
          <div
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              width: "100%",
            }}
          >
            {cl.associatedURL.startsWith("http") ? (
              <a href={cl.associatedURL} target="_blank" rel="noreferrer">
                {cl.associatedURL}
              </a>
            ) : (
              cl.associatedURL
            )}
          </div>
        </RowPanel>
        {cl.note && <RowPanel title="비고">{cl.note}</RowPanel>}

        <hr className="m-1" />
        <Accordion className="ml-2 mr-2" defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0" style={{ border: "none" }}>
            <CustomAccordionButton>
              <b>
                <small>리뷰 보기</small>
              </b>
            </CustomAccordionButton>
            <Accordion.Body style={{ padding: 0 }}>
              <Form onSubmit={submitReview}>
                <div className="flex flex-column" style={{ width: "100%" }}>
                  <Form.Group className="mt-1 mb-1" controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                      as="textarea"
                      size="sm"
                      placeholder="리뷰를 입력하세요"
                      rows={2}
                      value={myReview}
                      onChange={(e) => setMyReview(e.target.value)}
                    />
                  </Form.Group>
                  <div className="flex justify-content-end align-items-center gap-2">
                    <div
                      className="flex gap-1 pt-1 pb-1 ps-2 pe-2 align-items-center"
                      style={{
                        borderRadius: "2px",
                        width: "115px",
                        height: "30px",
                        border: "solid",
                        borderWidth: "1px",
                        borderColor: "#cccccc",
                      }}
                    >
                      {[0, 1, 2, 3, 4].map((index) => (
                        <span
                          key={index}
                          onClick={() => handleClick(index + 1)}
                          style={{ cursor: "pointer" }}
                        >
                          {getStarIcon(index)}
                        </span>
                      ))}
                    </div>
                    <Button variant="success" type="submit" size="sm">
                      제출ㅇㅇ
                    </Button>
                  </div>
                </div>
              </Form>
              <div style={{ maxHeight: "410px", overflowY: "scroll" }}>
                {reviews.map((review, idx) => (
                  <ReviewCard
                    username={review.menteeName}
                    profileURL={review.menteeProfileURL}
                    score={review.score}
                    date={review.datetime.toDate().toLocaleDateString()}
                    review={review.review}
                    key={idx}
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </CardContainer>
  );
};

const CustomAccordionButton = styled(Accordion.Button)`
  padding: 4px 0;
  border: none;
  margin: 0;
  background: none;
  color: black;
  &:not(.collapsed) {
    background: none;
    color: black;
    ::after {
      color: black;
    }
  }
`;

const Subject = styled.span`
  padding-left: 7px;
  padding-right: 7px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-right: 5px;
  border-radius: 5px;
  background-color: lightgray;
  color: black;
  font-size: 12px;
`;
