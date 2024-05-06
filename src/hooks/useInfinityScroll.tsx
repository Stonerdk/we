import { PropsWithChildren, SetStateAction, useCallback, useEffect, useState } from "react";
import {
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
} from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingComponent from "@/components/common/loading";

export const useInfinityScroll = <T,>(
  querySnapshot: () => Promise<QuerySnapshot>,
  queryMoreSnapshot: (lastVisible: QueryDocumentSnapshot | null) => Promise<QuerySnapshot>,
  lim: number = 5
) => {
  const [entries, setEntries] = useState<(T & { id: string })[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchEntries = async () => {
    const snapshot = await querySnapshot();
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    setLastVisible(lastVisible);
    setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) })));
  };

  const fetchMoreEntries = async () => {
    if (!lastVisible) return;
    const snapshot = await queryMoreSnapshot(lastVisible);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setEntries([...entries, ...snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }))]);
    setHasMore(snapshot.docs.length >= lim);
  };

  const WrappedInfiniteScroll = ({ children }: PropsWithChildren) => {
    return (
      <InfiniteScroll
        dataLength={entries.length}
        next={fetchMoreEntries}
        hasMore={hasMore}
        loader={<LoadingComponent />}
        endMessage={<hr />}
      >
        {children}
      </InfiniteScroll>
    );
  };

  return {
    WrappedInfiniteScroll,
    entries,
    setEntries,
    lastVisible,
    setLastVisible,
    hasMore,
    setHasMore,
    fetchEntries,
    fetchMoreEntries,
  };
};
