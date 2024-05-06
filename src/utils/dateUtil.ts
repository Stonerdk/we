export const iso2kor = (datestring: string) => {
  const date = new Date(datestring);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

export const nextClosestDate = (mentoringDates: string[]) => {
  const currentDateString = new Date().toISOString().slice(0, 10);
  let nextDateIndex = mentoringDates.findIndex((date) => date > currentDateString);
  return nextDateIndex === -1 ? mentoringDates.length - 1 : nextDateIndex;
};

export const formatClassDuration = (startTime: Date, durationMinutes: number) => {
  // 시작 시간을 12시간제로 변환하고 AM 또는 PM을 결정합니다.
  const startHour = startTime.getHours() % 12 || 12; // 12시간제로 변환
  const startMinutes = startTime.getMinutes();
  const startSuffix = startTime.getHours() >= 12 ? "오후" : "오전";

  // 종료 시간 계산
  const endMinutes = (startMinutes + durationMinutes) % 60;
  const endHour = startHour + Math.floor((startMinutes + durationMinutes) / 60);
  const endSuffix = endHour >= 12 ? "오후" : "오전";

  // 시작 시간 및 종료 시간을 출력 형식에 맞게 조정
  const formattedStartTime = `${startSuffix} ${startHour}시 ${String(startMinutes).padStart(2, "0")}분`;
  const formattedEndTime = `${endSuffix} ${endHour % 12 || 12}시 ${String(endMinutes).padStart(2, "0")}분`;

  return `${formattedStartTime} ~ ${formattedEndTime} (${durationMinutes}분)`;
};
