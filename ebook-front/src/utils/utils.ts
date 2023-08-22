export const nameRegex = new RegExp("^[A-Z][a-z]*$");
export const passwordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$"
);
export const usernameRegex = new RegExp(
  "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
);

export const convertDateToString = (date: Date) => {
  return new Intl.DateTimeFormat("sr-RS", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};
