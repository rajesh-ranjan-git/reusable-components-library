import {
  ALLOWED_SPECIAL_CHARACTERS_REGEX,
  EMAIL_REGEX,
  LOWER_CASE_REGEX,
  NUMBER_REGEX,
  UPPER_CASE_REGEX,
  USERNAME_REGEX,
} from "@/constants/regex.constants";
import { propertyConstraints } from "@/config/common.config";

export const userNameValidator = (userName?: string) => {
  const value = userName?.trim().toLowerCase();

  if (!value) {
    return { isUserNameValid: false, message: "Please provide your username!" };
  }

  if (value.length < propertyConstraints.minUserNameLength) {
    return { isUserNameValid: false, message: "Username too short!" };
  }

  if (value.length > propertyConstraints.maxUserNameLength) {
    return { isUserNameValid: false, message: "Username too long!" };
  }

  if (!USERNAME_REGEX.test(value)) {
    return { isUserNameValid: false, message: "Invalid username format!" };
  }

  return { isUserNameValid: true, validatedUserName: value };
};

export const emailValidator = (email?: string) => {
  const value = email?.trim().toLowerCase();

  if (!value) {
    return { isEmailValid: false, message: "Please provide your email!" };
  }

  if (!EMAIL_REGEX.test(value)) {
    return { isEmailValid: false, message: "Invalid email!" };
  }

  return { isEmailValid: true, validatedEmail: value };
};

export const passwordValidator = (password?: string, type = "") => {
  const value = password?.trim();

  if (!value) {
    return {
      isPasswordValid: false,
      message: `Please provide your ${type || ""} password!`,
    };
  }

  if (
    value.length < propertyConstraints.minPasswordLength ||
    value.length > propertyConstraints.maxPasswordLength
  ) {
    return {
      isPasswordValid: false,
      message: "Invalid password length!",
    };
  }

  if (
    !UPPER_CASE_REGEX.test(value) ||
    !LOWER_CASE_REGEX.test(value) ||
    !NUMBER_REGEX.test(value) ||
    !ALLOWED_SPECIAL_CHARACTERS_REGEX.test(value)
  ) {
    return {
      isPasswordValid: false,
      message: "Password must meet complexity rules!",
    };
  }

  return { isPasswordValid: true, validatedPassword: value };
};

export const validateLogin = (data: { email: string; password: string }) => {
  const email = emailValidator(data.email);
  if (!email.isEmailValid) {
    // throw AppError.unprocessable({ message: email.message });
  }

  const password = passwordValidator(data.password);
  if (!password.isPasswordValid) {
    // throw AppError.unprocessable({ message: password.message });
  }

  return {
    email: email.validatedEmail,
    password: password.validatedPassword,
  };
};
