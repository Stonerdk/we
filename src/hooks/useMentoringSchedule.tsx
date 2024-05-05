import { mentoringDates } from "@/utils/mentoringDates";
import { PropsWithChildren, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSwipeable } from "react-swipeable";
import { iso2kor, nextClosestDate } from "@/utils/dateUtil";

export const useMentoringSchedule = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(nextClosestDate(mentoringDates));
  const [selectedDate, setSelectedDate] = useState(mentoringDates[selectedDateIndex]);

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => {
      nextDate();
    },
    onSwipedRight: () => {
      prevDate();
    },
    onSwiping: (event) => {
      const miDistance = 50;
      const { deltaX } = event;
      if (deltaX > miDistance) {
        prevDate();
      } else if (deltaX < -miDistance) {
        nextDate();
      }
    },
  });

  const nextDate = () => {
    if (selectedDateIndex === mentoringDates.length - 1) return;
    const newIndex = selectedDateIndex + 1;
    setSelectedDateIndex(newIndex);
    setSelectedDate(mentoringDates[newIndex]);
  };

  const prevDate = () => {
    if (selectedDateIndex === 0) return;
    const newIndex = selectedDateIndex - 1;
    setSelectedDateIndex(newIndex);
    setSelectedDate(mentoringDates[newIndex]);
  };

  const ScheduleSelector = ({ children }: PropsWithChildren) => {
    return (
      <div {...swipeHandler} style={{ height: "100%" }}>
        <div className="flex justify-content-center align-items-center gap-2">
          <div className="flex text-align-left" onClick={prevDate}>
            <FiChevronLeft />
          </div>
          <div className="flex text-align-center">{iso2kor(selectedDate)}</div>
          <div className="flex" onClick={nextDate}>
            <FiChevronRight />
          </div>
        </div>
        {children}
      </div>
    );
  };

  return { selectedDate, nextDate, prevDate, ScheduleSelector };
};
