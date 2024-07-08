import { db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { collection, doc, getDoc, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";

interface ChatRoomDoc {
  profileURL: string;
  otherID: string;
  name: string;
  content: string;
  count: number;
  id: string;
  lastViewed: Timestamp;
}

export const useChatroom = (
  user: UserDoc | null,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [chatRoomList, setChatRoomList] = useState<ChatRoomDoc[]>([]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const q = query(collection(db, "chats"), where(user.isMentor ? "mentor" : "mentee", "==", user.id));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const roomPromises = querySnapshot.docs.map(async (d) => {
          const { mentee, mentor, lastMessage, menteeLastViewed, mentorLastViewed } = d.data();
          const otherUserID = user.isMentor ? mentee : mentor;
          const lastViewed = user.isMentor ? mentorLastViewed : menteeLastViewed;
          const otherUserDoc = await getDoc(doc(db, "users", otherUserID));
          const otherUserData = otherUserDoc.data();

          if (!otherUserData) {
            return null;
          }

          const { profileURL, name } = otherUserData as UserDoc;

          return {
            id: d.id,
            profileURL,
            name,
            otherID: otherUserDoc.id,
            content: lastMessage ?? "",
            count: 0,
            lastViewed,
          };
        });

        const rooms = await Promise.all(roomPromises);

        function isChatRoomDoc(room: ChatRoomDoc | null): room is ChatRoomDoc {
          return room !== null;
        }
        const filteredRooms: ChatRoomDoc[] = rooms.filter(isChatRoomDoc);

        setChatRoomList(filteredRooms);
        setLoading(false);

        filteredRooms.forEach((room) => {
          const messagesQuery = query(
            collection(db, "chats", room.id, "messages"),
            where("timestamp", ">", room.lastViewed)
          );

          onSnapshot(messagesQuery, (messagesSnapshot) => {
            const unreadCount = messagesSnapshot.size;
            setChatRoomList((prevRooms) =>
              prevRooms.map((r) => (r.id === room.id ? { ...r, count: unreadCount } : r))
            );
          });
        });
      });

      return () => unsubscribe();
    }
  }, [setLoading, user]);

  return { chatRoomList };
};
