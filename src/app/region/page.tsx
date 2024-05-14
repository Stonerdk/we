"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import { db } from "@/firebase/firebaseClient";
import { collection } from "firebase/firestore";
import Image from "next/image";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FiChevronLeft } from "react-icons/fi";

type FarmDoc = {
  name: string;
  description: string;
  imageUrl: string;
  gallery: { name: string; description: string; imageUrl: string }[];
};

const Page = () => {
  const [selectedFarm, setSelectedFarm] = useState<FarmDoc | null>(null);
  const [farm, loading, e] = useCollectionData(collection(db, "region"), {});

  const showFarmDetails = (farm: FarmDoc) => {
    setSelectedFarm(farm);
    console.log(farm);
  };

  const goBackToList = () => {
    setSelectedFarm(null);
  };
  return (
    <CommonLayout title="지역상생" loading={loading}>
      {selectedFarm ? (
        <div>
          <div className="flex gap-2">
            <FiChevronLeft size="1.5em" color="black" onClick={goBackToList} />
            <h5>
              <b>{selectedFarm.name}</b>
            </h5>
          </div>

          <p>{selectedFarm.description}</p>
          <div className="flex flex-column gap-2 overflow-y-scroll" style={{ maxHeight: "700px" }}>
            {selectedFarm?.gallery?.map?.((item, idx) => (
              <Card key={idx}>
                <div className="flex justify-content-center" style={{ width: "100%" }}>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={360}
                    height={150}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <Card.Body>
                  <Card.Title>
                    <b>{item.name}</b>
                  </Card.Title>
                  <small style={{ whiteSpace: "pre-line" }}>{item.description}</small>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        ((farm as FarmDoc[]) ?? []).map((t, idx) => (
          <Card key={idx} onClick={() => showFarmDetails(t)}>
            <div className="flex justify-content-center" style={{ width: "100%" }}>
              <Image src={t.imageUrl} alt={t.name} width={360} height={200} />
            </div>
            <Card.Body>
              <Card.Title>
                <b>{t.name}</b>
              </Card.Title>
              <small>
                {
                  t.description.split("\\n").map((text, i) =>
                    i ? (
                      <React.Fragment key={i}>
                        <br />
                        {text}
                      </React.Fragment>
                    ) : (
                      <React.Fragment key={i}>{text}</React.Fragment>
                    )
                  ) /*eslint-disable-next-line react/jsx-key */
                }
              </small>
            </Card.Body>
          </Card>
        ))
      )}
    </CommonLayout>
  );
};

export default Page;
