import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  errorsConfig,
  jwtKnownErrorsConfig,
  timelineConfig,
} from "../../config/config.js";
import { BcryptError, JwtError, throwError } from "../errors/CustomError.js";

export const isValidMongoDbObjectId = (id) => {
  return ObjectId.isValid(id);
};

export const getEncryptedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!hashedPassword) {
    throwError(BcryptError, {
      status: errorsConfig.bcryptError.statusCode,
      name: errorsConfig.bcryptError.title,
      message: errorsConfig.bcryptError.message,
      data: { password: hashedPassword },
    });
  }

  return hashedPassword;
};

export const getJwtToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  if (!token) {
    throwError(JwtError, {
      status: errorsConfig.jwtError.statusCode,
      name: errorsConfig.jwtError.title,
      message: errorsConfig.jwtError.message,
      data: { token },
    });
  }

  return token;
};

export const verifyJwtToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      throwError(JwtError, {
        status: errorsConfig.unauthorizedUserError.statusCode,
        name: errorsConfig.unauthorizedUserError.title,
        message: errorsConfig.unauthorizedUserError.message,
        data: { token: decodedToken },
      });
    }

    return decodedToken.id;
  } catch (error) {
    if (error.name === jwtKnownErrorsConfig.tokenExpiredError) {
      throwError(JwtError, {
        status: errorsConfig.tokenExpiredError.statusCode,
        name: errorsConfig.tokenExpiredError.title,
        message: errorsConfig.tokenExpiredError.message,
        data: { token },
      });
    } else if (error.name === jwtKnownErrorsConfig.jwtError) {
      throwError(JwtError, {
        status: errorsConfig.invalidTokenError.statusCode,
        name: errorsConfig.invalidTokenError.title,
        message: errorsConfig.invalidTokenError.message,
        data: { token },
      });
    } else if (error.name === jwtKnownErrorsConfig.notBeforeError) {
      throwError(JwtError, {
        status: errorsConfig.jwtNotBeforeError.statusCode,
        name: errorsConfig.jwtNotBeforeError.title,
        message: errorsConfig.jwtNotBeforeError.message,
        data: { token },
      });
    } else {
      throwError(JwtError, {
        status: errorsConfig.internalServerError.statusCode,
        name: errorsConfig.internalServerError.title,
        message: errorsConfig.internalServerError.message,
        data: { token },
      });
    }
  }
};

export const comparePassword = async (incomingPassword, existingPassword) => {
  const isPasswordCorrect = await bcrypt.compare(
    incomingPassword,
    existingPassword,
  );

  if (isPasswordCorrect === undefined || isPasswordCorrect === null) {
    throwError(BcryptError, {
      status: errorsConfig.internalServerError.statusCode,
      name: errorsConfig.internalServerError.title,
      message: errorsConfig.internalServerError.message,
      data: { password: incomingPassword },
    });
  }

  return isPasswordCorrect;
};

export const isPasswordExpired = (passwordLastUpdated) => {
  return (
    Date.now() - new Date(passwordLastUpdated).getTime() >
    timelineConfig.threeMonths
  );
};
