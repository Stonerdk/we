"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import { db } from "@/firebase/firebaseClient";
import { collection } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import { Card } from "react-bootstrap";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FiChevronLeft } from "react-icons/fi";

type TownDoc = {
  name: string;
  description: string;
  imageUrl: string;
  gallery: { name: string; description: string; imageUrl: string }[];
};

const Page = () => {
  const [selectedTown, setSelectedTown] = useState<TownDoc | null>(null);
  const [town, loading, e] = useCollectionData(collection(db, "town"), {});

  const showTownDetails = (town: TownDoc) => {
    setSelectedTown(town);
  };

  const goBackToList = () => {
    setSelectedTown(null);
  };
  return (
    <CommonLayout title="마을의 역사" loading={loading}>
      {selectedTown ? (
        <div>
          <div className="flex gap-2">
            <FiChevronLeft size="1.5em" color="black" onClick={goBackToList} />
            <h5>
              <b>{selectedTown.name}</b>
            </h5>
          </div>

          <p>{selectedTown.description}</p>
          <div className="flex flex-column gap-2 overflow-y-scroll" style={{ maxHeight: "700px" }}>
            {selectedTown.gallery.map((item, idx) => (
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
        ((town as TownDoc[]) ?? []).map((t, idx) => (
          <Card key={idx} onClick={() => showTownDetails(t)}>
            <div className="flex justify-content-center" style={{ width: "100%" }}>
              <Image src={t.imageUrl} alt={t.name} width={360} height={200} />
            </div>
            <Card.Body>
              <Card.Title>
                <b>{t.name}</b>
              </Card.Title>
              <small style={{ whiteSpace: "pre-line" }}>{t.description}</small>
            </Card.Body>
          </Card>
        ))
      )}
    </CommonLayout>
  );
};

export default Page;
