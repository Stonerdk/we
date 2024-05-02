export function getAge(birthDateString: string): number {
  const todayYearSuffix = new Date().getFullYear().toString().substring(2, 4);
  const birthdayPrefix = birthDateString.substring(0, 2);
  const yearPrefix = birthdayPrefix >= "00" && birthdayPrefix <= todayYearSuffix ? "20" : "19";
  const formattedDate = `${yearPrefix}${birthdayPrefix}-${birthDateString.substring(2, 4)}-${birthDateString.substring(4, 6)}`;

  const birthDate = new Date(formattedDate);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
