import { PropsWithChildren, SetStateAction, useCallback, useEffect, useState } from "react";
import {
  CollectionReference,
  getDocs,
  limit,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingComponent from "@/components/common/loading";
import { Session } from "next-auth";

export const useInfinityScroll = <T,>(
  ref: CollectionReference,
  queries: QueryConstraint[],
  setLoading?: React.Dispatch<SetStateAction<boolean>>,
  session?: Session | null,
  lim: number = 5
) => {
  const [entries, setEntries] = useState<(T & { id: string })[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchEntries = async () => {
    setLoading?.(true);
    const q = query(ref, ...queries, limit(lim));

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisible(lastVisible);
    setEntries(querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) })));
    setLoading?.(false);
  };

  const fetchMoreEntries = async () => {
    if (!lastVisible) return;
    const q = query(ref, ...queries, startAfter(lastVisible), limit(lim));
    const querySnapshot = await getDocs(q);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setEntries([...entries, ...querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }))]);
    setHasMore(querySnapshot.docs.length >= lim);
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
