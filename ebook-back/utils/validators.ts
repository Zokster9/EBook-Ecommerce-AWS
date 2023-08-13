import { NextFunction, Request, Response } from "express";
import { UserCreationDTO } from "../model/user-creation-dto";

const nameRegex = new RegExp("^[A-Z][a-z]*$");
const passwordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$"
);
const emailRegex = new RegExp(
  "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$"
);
const usernameRegex = new RegExp(
  "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
);
const EMAIL_EXCEPTION_MESSAGE = "Email wasn't entered correctly.";
const PASSWORD_EXCEPTION_MESSAGE =
  "Password or password confirmation wasn't entered correctly, or they don't match.";
const NAME_EXCEPTION_MESSAGE = "Name wasn't entered correctly.";
const SURNAME_EXCEPTION_MESSAGE = "Surname wasn't entered correctly.";
const USERNAME_EXCEPTION_MESSAGE =
  "Username wasn't entered correctly. Username must be 8-20 characters long without . and _ at certain places.";

export const isRegisterBodyValid = (
  req: Request<{}, {}, UserCreationDTO>,
  res: Response,
  next: NextFunction
) => {
  const userCreationDTO = req.body;
  if (!isEmailValid(userCreationDTO.email)) {
    return res.status(400).json(EMAIL_EXCEPTION_MESSAGE);
  }
  if (!isUsernameValid(userCreationDTO.username)) {
    return res.status(400).json(USERNAME_EXCEPTION_MESSAGE);
  }
  if (
    !isPasswordValid(
      userCreationDTO.password,
      userCreationDTO.passwordConfirmation
    )
  ) {
    return res.status(400).json(PASSWORD_EXCEPTION_MESSAGE);
  }
  if (!isNameValid(userCreationDTO.firstName)) {
    return res.status(400).json(NAME_EXCEPTION_MESSAGE);
  }
  if (!isNameValid(userCreationDTO.lastName)) {
    return res.status(400).json(SURNAME_EXCEPTION_MESSAGE);
  }
  next();
};

const isEmailValid = (email: string): boolean => {
  if (email) {
    return emailRegex.test(email);
  }
  return false;
};

const isUsernameValid = (username: string): boolean => {
  if (username) {
    return usernameRegex.test(username);
  }
  return false;
};

const isPasswordValid = (
  password: string,
  passwordConfirmation: string
): boolean => {
  if (password && passwordConfirmation) {
    return passwordRegex.test(password) && password === passwordConfirmation;
  }
  return false;
};

const isNameValid = (name: string): boolean => {
  if (name) {
    return nameRegex.test(name);
  }
  return false;
};
