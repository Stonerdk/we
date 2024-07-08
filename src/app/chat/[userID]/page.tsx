"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import { db } from "@/firebase/firebaseClient";
import { useUser } from "@/hooks/useUser";
import { MessageDoc } from "@/types/ChatDoc";
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
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import styled from "styled-components";

interface ChatDoc {
  profileURL: string;
  name: string;
  content: string;
  count: number;
}

const Page = (props: any) => {
  const userID = usePathname().split("/")[2];
  const [loading, setLoading] = useState(false);
  const [chatID, setChatID] = useState<string>("");
  const { user } = useUser(setLoading);
  const [otherUser, setOtherUser] = useState<UserDoc | null>(null);
  const [inputText, setInputText] = useState("");
  const chatDisplayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    if (userID) {
      const fetchUser = async () => {
        const d = await getDoc(doc(db, "users", userID));
        if (d.exists()) {
          setOtherUser(d.data() as UserDoc);
        }
      };
      fetchUser();
    }
  }, [userID]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (userID && user) {
  //       try {
  //         setLoading(true);
  //         let q, chatID;
  //         if (user.isMentor) {
  //           q = query(collection(db, "chats"), where("mentor", "==", user.id), where("mentee", "==", userID));
  //         } else {
  //           q = query(collection(db, "chats"), where("mentor", "==", userID), where("mentee", "==", user.id));
  //         }
  //         const querySnapshot = await getDocs(q);

  //         if (querySnapshot.empty) {
  //           chatID = (
  //             await addDoc(collection(db, "chats"), {
  //               mentee: user.isMentor ? userID : user.id,
  //               mentor: user.isMentor ? user.id : userID,
  //               menteeLastViewed: Timestamp.now(),
  //               mentorLastViewed: Timestamp.now(),
  //               lastMessage: "",
  //             })
  //           ).id;
  //         } else {
  //           chatID = querySnapshot.docs[0].id;
  //         }
  //         setChatID(chatID);
  //         const chatQuery = query(collection(db, "chats", chatID, "messages"), orderBy("timestamp"));
  //         const unsubscribe = onSnapshot(chatQuery, async (snapshot) => {
  //           const newChats = snapshot.docs.map((doc) => doc.data() as MessageDoc);
  //           console.log("subscribe되면 안되야 하는거 아님?");
  //           await updateDoc(doc(db, "chats", chatID), {
  //             [user.isMentor ? "mentorLastViewed" : "menteeLastViewed"]: Timestamp.now(),
  //           });
  //           setMessages(newChats);
  //         });

  //         return () => unsubscribe();
  //       } catch (e) {
  //         console.error(e);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };
  //   fetchMessages();
  // }, [userID, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (userID && user) {
        try {
          setLoading(true);
          let q;
          if (user.isMentor) {
            q = query(collection(db, "chats"), where("mentor", "==", user.id), where("mentee", "==", userID));
          } else {
            q = query(collection(db, "chats"), where("mentor", "==", userID), where("mentee", "==", user.id));
          }
          const querySnapshot = await getDocs(q);

          let chatID;
          if (querySnapshot.empty) {
            const newChatRef = await addDoc(collection(db, "chats"), {
              mentee: user.isMentor ? userID : user.id,
              mentor: user.isMentor ? user.id : userID,
              menteeLastViewed: Timestamp.now(),
              mentorLastViewed: Timestamp.now(),
              lastMessage: "",
            });
            chatID = newChatRef.id;
          } else {
            chatID = querySnapshot.docs[0].id;
          }
          setChatID(chatID);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();
  }, [userID, user]);

  useEffect(() => {
    if (chatID && user) {
      const chatQuery = query(collection(db, "chats", chatID, "messages"), orderBy("timestamp"));
      const unsubscribe = onSnapshot(chatQuery, async (snapshot) => {
        const newChats = snapshot.docs.map((doc) => doc.data() as MessageDoc);
        await updateDoc(doc(db, "chats", chatID), {
          [user.isMentor ? "mentorLastViewed" : "menteeLastViewed"]: Timestamp.now(),
        });
        setMessages(newChats);
      });

      return () => unsubscribe();
    }
  }, [chatID, user]);

  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]); // chats 배열이 업데이트 될 때마다 실행

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substring(0, maxLength).trim() + "...";
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== "" && user) {
      setIsSending(true);
      await addDoc(collection(db, "chats", chatID, "messages"), {
        message: inputText,
        timestamp: Timestamp.now(),
        sender: user.id,
      });
      await updateDoc(doc(db, "chats", chatID), { lastMessage: inputText });
      setInputText("");
      setIsSending(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) {
        await handleSendMessage();
      }
    }
  };

  return (
    <CommonLayout title={otherUser?.name ?? ""} loading={loading} backroute="/chat">
      <AllContainer>
        <ChatDisplay ref={chatDisplayRef}>
          {messages.map((message, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: message.sender == user?.id ? "flex-end" : "flex-start",
              }}
            >
              {message.sender == user?.id ? (
                <MyChat
                  dangerouslySetInnerHTML={{ __html: (message.message ?? "").replace(/\n/g, "<br>") }}
                />
              ) : (
                <OtherChat
                  dangerouslySetInnerHTML={{ __html: (message.message ?? "").replace(/\n/g, "<br>") }}
                />
              )}
            </div>
          ))}
        </ChatDisplay>
        <InputContainer>
          <ChatInput
            ref={inputRef}
            placeholder="메시지를 입력하세요..."
            value={inputText}
            onChange={(e) => handleInputChange(e)}
            rows={1}
            onKeyDown={handleKeyDown}
          />
          <SendButton type="submit" onClick={handleSendMessage} value="전송" />
        </InputContainer>
      </AllContainer>
    </CommonLayout>
  );
};

const AllContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 50px);
`;

const ChatDisplay = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
  align-items: center;
  overflow-y: auto;
  padding-bottom: 5px;
  flex-grow: 1;
`;

const OtherChat = styled.div`
  gap: 4px;
  background: #e2e2e2;
  color: black;
  padding: 3px 5px;
  font-size: 12px;
  border-radius: 5px;
  max-width: 300px;
  flex-shrink: 0;
  white-space: pre-wrap;
`;

const MyChat = styled.div`
  gap: 4px;
  background: #e9ae2d;
  color: black;
  padding: 3px 5px;
  font-size: 12px;
  border-radius: 5px;
  max-width: 300px;
  flex-shrink: 0;
  white-space: pre-wrap;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 100%;
  background-color: #f0f0f0;
`;

const ChatInput = styled.textarea`
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 5px;
  margin-bottom: 5px;
  resize: none;
`;

const SendButton = styled.input`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: #ce8c00;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #e9ae2d;
  }
`;

export default Page;
