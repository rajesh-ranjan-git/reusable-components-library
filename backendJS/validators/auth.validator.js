import {
  ALLOWED_SPECIAL_CHARACTERS_REGEX,
  EMAIL_REGEX,
  LOWER_CASE_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  UPPER_CASE_REGEX,
  USERNAME_REGEX,
} from "../constants/common.constants.js";
import {
  propertyConstraints,
  userProperties,
} from "../config/common.config.js";
import AppError from "../errors/app.error.js";
import { toTitleCase } from "../utils/common.utils.js";

export const validateRegister = (data) => {
  const {
    isUserNameValid,
    message: userNameErrorMessage,
    validatedUserName,
  } = userNameValidator(data.userName);

  if (!isUserNameValid) {
    throw AppError.unprocessable({
      message: userNameErrorMessage,
      code: "USERNAME VALIDATION FAILED",
      details: { userName: data.userName },
    });
  }

  const {
    isEmailValid,
    message: emailErrorMessage,
    validatedEmail,
  } = emailValidator(data.email);

  if (!isEmailValid) {
    throw AppError.unprocessable({
      message: emailErrorMessage,
      code: "EMAIL VALIDATION FAILED",
      details: { email: data.email },
    });
  }

  const {
    isPasswordValid,
    message: passwordErrorMessage,
    validatedPassword,
  } = passwordValidator(data.password);

  if (!isPasswordValid) {
    throw AppError.unprocessable({
      message: passwordErrorMessage,
      code: "PASSWORD VALIDATION FAILED",
      details: { password: data.password },
    });
  }

  const {
    isNameValid: isFirstNameValid,
    message: firstNameErrorMessage,
    validatedName: validatedFirstName,
  } = nameValidator(data.firstName, userProperties.firstName);

  if (!isFirstNameValid) {
    throw AppError.unprocessable({
      message: firstNameErrorMessage,
      code: "FIRST NAME VALIDATION FAILED",
      details: { firstName: data.firstName },
    });
  }

  const {
    isNameValid: isLastNameValid,
    message: lastNameErrorMessage,
    validatedName: validatedLastName,
  } = nameValidator(data.lastName, userProperties.lastName);

  if (!isLastNameValid) {
    throw AppError.unprocessable({
      message: lastNameErrorMessage,
      code: "LAST NAME VALIDATION FAILED",
      details: { lastName: data.lastName },
    });
  }

  return {
    userName: validatedUserName,
    email: validatedEmail,
    password: validatedPassword,
    firstName: validatedFirstName,
    lastName: validatedLastName,
  };
};

export const validateLogin = (data) => {
  const {
    isEmailValid,
    message: emailErrorMessage,
    validatedEmail,
  } = emailValidator(data.email);

  if (!isEmailValid) {
    throw AppError.unprocessable({
      message: emailErrorMessage,
      code: "EMAIL VALIDATION FAILED",
      details: { email: data.email },
    });
  }

  const {
    isPasswordValid,
    message: passwordErrorMessage,
    validatedPassword,
  } = passwordValidator(data.password);

  if (!isPasswordValid) {
    throw AppError.unprocessable({
      message: "Your email or password is incorrect!",
      code: "INVALID CREDENTIALS",
    });
  }

  return {
    email: validatedEmail,
    password: validatedPassword,
  };
};

export const validateUpdatePassword = (data) => {
  const { currentPassword, newPassword } = data;

  if (!currentPassword || !newPassword) {
    throw AppError.badRequest({
      message: "Current password and new password are required.",
      code: "PASSWORD VALIDATION FAILED",
      details: { currentPassword, newPassword },
    });
  }

  const {
    isPasswordValid: isNewPasswordValid,
    message: newPasswordErrorMessage,
    validatedPassword: validatedNewPassword,
  } = passwordValidator(newPassword, "new");

  if (!isNewPasswordValid) {
    throw AppError.unprocessable({
      message: newPasswordErrorMessage,
      code: "PASSWORD VALIDATION FAILED",
      details: { newPassword },
    });
  }

  return {
    currentPassword,
    newPassword: validatedNewPassword,
  };
};

export const validateResetPassword = (data) => {
  if (!data.token) {
    throw AppError.unprocessable({
      message: "Password reset token is required!",
      code: "TOKEN VALIDATION FAILED",
      details: { token: data.token },
    });
  }

  const {
    isPasswordValid,
    message: passwordErrorMessage,
    validatedPassword,
  } = passwordValidator(data.password);

  if (!isPasswordValid) {
    throw AppError.unprocessable({
      message: passwordErrorMessage,
      code: "PASSWORD VALIDATION FAILED",
      details: { password: data.password },
    });
  }

  return { token: data.token, password: validatedPassword };
};

export const userNameValidator = (userName) => {
  if (!userName) {
    return {
      isUserNameValid: false,
      message: "Please provide your username!",
    };
  }

  if (typeof userName !== "string") {
    return {
      isUserNameValid: false,
      message: "Username must be a string!",
    };
  }

  const incomingUserName = userName?.trim().toLowerCase();

  if (incomingUserName.length < propertyConstraints.minUserNameLength) {
    return {
      isUserNameValid: false,
      message: "Username must be at least 1 character long!",
    };
  }

  if (incomingUserName.length > propertyConstraints.maxUserNameLength) {
    return {
      isUserNameValid: false,
      message: "User name must not be longer than 100 characters!",
    };
  }

  if (!USERNAME_REGEX.test(incomingUserName)) {
    return {
      isUserNameValid: false,
      message:
        "Username must only contain alphabets (a-z or A-Z) and special characters (!,@,#,$,%,&,_)!",
    };
  }

  return {
    isUserNameValid: true,
    validatedUserName: incomingUserName,
  };
};

export const nameValidator = (name, type) => {
  if (!name) {
    return {
      isNameValid: true,
      validatedName: null,
    };
  }

  const trimmedName = name?.trim().toLowerCase();

  if (trimmedName.length < propertyConstraints.minNameLength) {
    return {
      isNameValid: false,
      message:
        type === userProperties.firstName
          ? "First name must be at least 1 character long!"
          : type === userProperties.lastName
            ? "Last name must be at least 1 character long!"
            : "nick name must be at least 1 character long!",
    };
  }

  if (trimmedName.length > propertyConstraints.maxNameLength) {
    return {
      isNameValid: false,
      message:
        type === userProperties.firstName
          ? "First name must not be longer than 100 characters!"
          : type === userProperties.lastName
            ? "Last name must not be longer than 100 characters!"
            : "Nick name must not be longer than 100 characters!",
    };
  }

  if (!NAME_REGEX.test(trimmedName)) {
    return {
      isNameValid: false,
      message:
        type === userProperties.firstName
          ? "First name must only contain alphabets (a-z or A-Z)!"
          : type === userProperties.lastName
            ? "Last name must only contain alphabets (a-z or A-Z)!"
            : "Nick name must only contain alphabets (a-z or A-Z)!",
    };
  }

  return {
    isNameValid: true,
    validatedName: trimmedName,
  };
};

export const emailValidator = (email) => {
  if (!email) {
    return {
      isEmailValid: false,
      message: "Please provide your email!",
    };
  }

  if (typeof email !== "string") {
    return {
      isEmailValid: false,
      message: "Email must be a string!",
    };
  }

  const incomingEmail = email?.trim().toLowerCase();

  if (!email) {
    return {
      isEmailValid: false,
      message: "Please provide your email!",
    };
  }

  if (!EMAIL_REGEX.test(incomingEmail)) {
    return {
      isEmailValid: false,
      message: "Please provide a valid email!",
    };
  }

  return {
    isEmailValid: true,
    validatedEmail: incomingEmail,
  };
};

export const passwordValidator = (password, type = "") => {
  if (!password) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? "Please provide your password!"
          : `Please provide your ${type} password!`,
    };
  }

  if (typeof password !== "string") {
    return {
      isEmailValid: false,
      message: "Password must be a string!",
    };
  }

  const incomingPassword = password?.trim();

  if (!incomingPassword) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? "Please provide your password!"
          : `Please provide your ${type} password!`,
    };
  }

  if (incomingPassword.length < propertyConstraints.minPasswordLength) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? `Password must be at least ${propertyConstraints.minPasswordLength} characters long!`
          : `${toTitleCase(type)} must be at least ${propertyConstraints.minPasswordLength} characters long!`,
    };
  }

  if (incomingPassword.length > propertyConstraints.maxPasswordLength) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? `Password must not be more than ${propertyConstraints.maxPasswordLength} characters long!`
          : `${toTitleCase(type)} password must not be more than ${propertyConstraints.maxPasswordLength} characters long!`,
    };
  }

  if (
    !UPPER_CASE_REGEX.test(incomingPassword) ||
    !LOWER_CASE_REGEX.test(incomingPassword) ||
    !NUMBER_REGEX.test(incomingPassword) ||
    !ALLOWED_SPECIAL_CHARACTERS_REGEX.test(incomingPassword)
  ) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (!,@,#,$,%,&,_)!"
          : `${toTitleCase(type)}  password must contain at least one uppercase letter, one lowercase letter, one number and one special character (!,@,#,$,%,&,_)!`,
    };
  }

  return {
    isPasswordValid: true,
    validatedPassword: incomingPassword,
  };
};
