"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import { db } from "@/firebase/firebaseClient";
import { useChatroom } from "@/hooks/useChatroom";
import { useUser } from "@/hooks/useUser";
import { UserDoc } from "@/types/userDoc";
import { collection, doc, getDoc, getDocs, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import styled from "styled-components";

interface ChatRoomDoc {
  profileURL: string;
  otherID: string;
  name: string;
  content: string;
  count: number;
  id: string;
  lastViewed: Timestamp;
}

const Page = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser(setLoading);
  const router = useRouter();
  const { chatRoomList } = useChatroom(user, setLoading);

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substring(0, maxLength).trim() + "...";
    }
  }

  return (
    <CommonLayout title="채팅" loading={loading}>
      <AllContainer>
        {chatRoomList.map((chat, idx) => (
          <ChatContainer key={idx} onClick={() => router.push(`/chat/${chat.otherID}`)}>
            <ProfileImageContainer>
              <ProfileImage src={chat.profileURL} roundedCircle alt="profile" />
            </ProfileImageContainer>
            <div className="flex flex-column gap-1" style={{ width: "100%" }}>
              <ChatNameWrapper>
                <ChatName>{chat.name}</ChatName>
                {chat.count > 0 && <ChatCount>{chat.count}</ChatCount>}
              </ChatNameWrapper>
              <ChatContent>{truncateText(chat.content, 60)}</ChatContent>
            </div>
          </ChatContainer>
        ))}
      </AllContainer>
    </CommonLayout>
  );
};

const AllContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  overflow-y: scroll;
`;

const ChatContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
`;

const ProfileImageContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  flex-shrink: 0;
`;

const ProfileImage = styled(Image)`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
`;

const ChatNameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: "100%";
`;

const ChatName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ChatCount = styled.div`
  background: #dd2222;
  border-radius: 13px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 8px;
`;

const ChatContent = styled.div`
  font-size: 12px;
  color: gray;
  white-space: break-spaces;
`;

export default Page;
