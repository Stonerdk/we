"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CommonLayout } from "@/components/background/commonLayout";
import Protected from "../protected";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { Card } from "react-bootstrap";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<number>(-1);
  const [restorations, setRestorations] = useState<RestorationDoc[]>([]);

  useEffect(() => {
    const fetchRestorations = async () => {
      setLoading(true);
      const snapshot = await getDocs(query(collection(db, "restoration")));
      setRestorations(snapshot.docs.map((doc) => doc.data() as RestorationDoc));
      setLoading(false);
    };
    fetchRestorations();
  }, []);

  return (
    <Protected>
      <CommonLayout title="환경정화" loading={loading}>
        <div style={{ width: "100%" }} className="flex justify-center position-relative">
          <Image
            src="https://cdn.jejusori.net/news/photo/202302/411949_420340_3735.png"
            alt="jejuisland"
            width={350}
            height={200}
            style={{ position: "relative", zIndex: 1 }}
          />
          {restorations.map((restoration, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: restoration.y,
                left: restoration.x,
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "red",
                cursor: "pointer",
                zIndex: 2,
                boxShadow: showTooltip === idx ? "0 0 8px 3px #ff0000" : "none", // glow 효과 조건적 추가
              }}
              onClick={() => setShowTooltip(idx)}
            />
          ))}
        </div>
        <hr />
        {showTooltip !== -1 && (
          <Card>
            <Card.Body>
              <Card.Title>
                <b>{restorations[showTooltip].title}</b>
              </Card.Title>
              <Card.Text>{restorations[showTooltip].description}</Card.Text>
            </Card.Body>
          </Card>
        )}
      </CommonLayout>
    </Protected>
  );
};

export default Page;
