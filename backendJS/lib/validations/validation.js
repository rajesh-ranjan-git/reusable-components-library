import {
  ALLOWED_SPECIAL_CHARACTERS_REGEX,
  COUNTRY_CODE_REGEX,
  EMAIL_REGEX,
  LOWER_CASE_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  PIN_CODE_REGEX,
  UPPER_CASE_REGEX,
  USER_NAME_REGEX,
} from "../../config/constants.js";
import {
  addressProperties,
  connectionStatusProperties,
  errorsConfig,
  notificationStatusProperties,
  notificationTypes,
  propertyConstraints,
  userProperties,
} from "../../config/config.js";
import { throwError, ValidationError } from "../errors/CustomError.js";
import { isPlainObject, sanitizeList } from "../utils/utils.js";

export const requestValidator = (req, options = {}) => {
  const {
    requireBody = false,
    requireParams = false,
    requireQuery = false,
  } = options;

  if (!req) {
    throwError(ValidationError, {
      status: errorsConfig.invalidRequestError.statusCode,
      name: errorsConfig.invalidRequestError.title,
      message: errorsConfig.invalidRequestError.message,
      data: { req },
    });
  }

  const params = validateParams(req, requireParams) || {};
  const query = validateQuery(req, requireQuery) || {};
  const body = validateBody(req, requireBody) || {};

  req.data = { params, query, body };

  return true;
};

export const validateParams = (req, required = false) => {
  if (!required) return;

  if (!req.params || Object.keys(req.params).length === 0) {
    throwError(ValidationError, {
      status: errorsConfig.invalidRequestParamsError.statusCode,
      name: errorsConfig.invalidRequestParamsError.title,
      message: errorsConfig.invalidRequestParamsError.message,
      apiUrl: req?.url,
      data: { params: req.params },
    });
  }

  return req.params;
};

export const validateQuery = (req, required = false) => {
  if (!required) return;

  if (!req.query || Object.keys(req.query).length === 0) {
    throwError(ValidationError, {
      status: errorsConfig.invalidRequestQueryError.statusCode,
      name: errorsConfig.invalidRequestQueryError.title,
      message: errorsConfig.invalidRequestQueryError.message,
      apiUrl: req?.url,
      data: { query: req.query },
    });
  }

  return req.query;
};

export const validateBody = (req, required = false) => {
  if (!required) return;

  if (!req.body || Object.keys(req.body).length === 0) {
    throwError(ValidationError, {
      status: errorsConfig.invalidRequestBodyError.statusCode,
      name: errorsConfig.invalidRequestBodyError.title,
      message: errorsConfig.invalidRequestBodyError.message,
      apiUrl: req?.url,
      data: { body: req.body },
    });
  }

  return req.body;
};

export const userNameValidator = (userName) => {
  if (!userName?.trim().toLowerCase()) {
    return {
      isUserNameValid: false,
      message: errorsConfig.userNameRequiredError.message,
    };
  }

  if (
    userName?.trim().toLowerCase().length <
    propertyConstraints.minUserNameLength
  ) {
    return {
      isUserNameValid: false,
      message: errorsConfig.userNameMinLengthError.message,
    };
  }

  if (
    userName?.trim().toLowerCase().length >
    propertyConstraints.maxUserNameLength
  ) {
    return {
      isUserNameValid: false,
      message: errorsConfig.userNameMaxLengthError.message,
    };
  }

  if (!USER_NAME_REGEX.test(userName?.trim().toLowerCase())) {
    return {
      isUserNameValid: false,
      message: errorsConfig.invalidUserNameError.message,
    };
  }

  return {
    isUserNameValid: true,
    validatedUserName: userName?.trim().toLowerCase(),
  };
};

export const firstNameValidator = (firstName) => {
  if (!firstName?.trim().toLowerCase()) {
    return {
      isFirstNameValid: false,
      message: errorsConfig.firstNameRequiredError.message,
    };
  }

  nameValidator(firstName, userProperties.firstName);

  return {
    isFirstNameValid: true,
    validatedFirstName: firstName?.trim().toLowerCase(),
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
          ? errorsConfig.firstNameMinLengthError.message
          : type === userProperties.middleName
            ? errorsConfig.middleNameMinLengthError.message
            : type === userProperties.lastName
              ? errorsConfig.lastNameMinLengthError.message
              : errorsConfig.nickNameMinLengthError.message,
    };
  }

  if (trimmedName.length > propertyConstraints.maxNameLength) {
    return {
      isNameValid: false,
      message:
        type === userProperties.firstName
          ? errorsConfig.firstNameMaxLengthError.message
          : type === userProperties.middleName
            ? errorsConfig.middleNameMaxLengthError.message
            : type === userProperties.lastName
              ? errorsConfig.lastNameMaxLengthError.message
              : errorsConfig.nickNameMaxLengthError.message,
    };
  }

  if (!NAME_REGEX.test(trimmedName)) {
    return {
      isNameValid: false,
      message:
        type === userProperties.firstName
          ? errorsConfig.invalidFirstNameError.message
          : type === userProperties.middleName
            ? errorsConfig.invalidMiddleNameError.message
            : type === userProperties.lastName
              ? errorsConfig.invalidLastNameError.message
              : errorsConfig.invalidNicknameError.message,
    };
  }

  return {
    isNameValid: true,
    validatedName: trimmedName,
  };
};

export const emailValidator = (email) => {
  if (!email?.trim().toLowerCase()) {
    return {
      isEmailValid: false,
      message: errorsConfig.emailRequiredError.message,
    };
  }

  if (!EMAIL_REGEX.test(email?.trim().toLowerCase())) {
    return {
      isEmailValid: false,
      message: errorsConfig.invalidEmailError.message,
    };
  }

  return {
    isEmailValid: true,
    validatedEmail: email?.trim().toLowerCase(),
  };
};

export const passwordValidator = (
  password,
  requiredErrorMessage = errorsConfig.passwordRequiredError.message,
  combinationErrorMessage = errorsConfig.invalidPasswordCombinationError
    .message,
) => {
  if (!password?.trim()) {
    return {
      isPasswordValid: false,
      message: requiredErrorMessage,
    };
  }

  const errors = [];

  if (password?.trim().length < propertyConstraints.minPasswordLength) {
    errors.push(errorsConfig.passwordMinLengthError.message);
  }

  if (password?.trim().length > propertyConstraints.maxPasswordLength) {
    errors.push(errorsConfig.passwordMaxLengthError.message);
  }

  if (!UPPER_CASE_REGEX.test(password?.trim())) {
    errors.push(errorsConfig.passwordUpperCaseError.message);
  }

  if (!LOWER_CASE_REGEX.test(password?.trim())) {
    errors.push(errorsConfig.passwordLowerCaseError.message);
  }

  if (!NUMBER_REGEX.test(password?.trim())) {
    errors.push(errorsConfig.passwordNumberError.message);
  }

  if (!ALLOWED_SPECIAL_CHARACTERS_REGEX.test(password?.trim())) {
    errors.push(errorsConfig.passwordSpecialCharactersError.message);
  }

  if (errors.length > 0) {
    return {
      isPasswordValid: false,
      message: combinationErrorMessage,
      errors: errors,
    };
  }

  return {
    isPasswordValid: true,
    validatedPassword: password?.trim(),
  };
};

export const regexPropertiesValidator = (property, regex, error) => {
  if (!property) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  property = typeof property === "string" ? property?.trim() : property;

  if (!regex.test(property)) {
    return {
      isPropertyValid: false,
      message: error,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: property,
  };
};

export const numberRegexPropertiesValidator = (property, regex, error) => {
  if (!property) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  property = typeof property === "string" ? property?.trim() : property;

  if (!regex.test(property) || isNaN(Number(property))) {
    return {
      isPropertyValid: false,
      message: error,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: property,
  };
};

export const numberPropertiesValidator = (
  property,
  minValue,
  maxValue,
  errors,
) => {
  if (!property && property !== 0 && property !== "0") {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  property =
    typeof property === "string" ? property?.trim().toLowerCase() : property;

  const isPropertyValid =
    (typeof property === "number" || typeof property === "string") &&
    !isNaN(property);

  if (!isPropertyValid) {
    return {
      isPropertyValid: false,
      message: errors.invalidError,
    };
  }

  if (!Number.isInteger(Number(property))) {
    return {
      isPropertyValid: false,
      message: errors.decimalError,
    };
  }

  if (Number(property) < minValue) {
    return {
      isPropertyValid: false,
      message: errors.minLengthError,
    };
  }

  if (Number(property) > maxValue) {
    return {
      isPropertyValid: false,
      message: errors.maxLengthError,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: Number(property),
  };
};

export const stringPropertiesValidator = (
  property,
  minLength,
  maxLength,
  errors,
) => {
  if (!property) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  const trimmedProperty =
    typeof property === "string" ? property?.trim().toLowerCase() : property;

  if (typeof property !== "string") {
    return {
      isPropertyValid: false,
      message: errors.invalidError,
    };
  }

  if (trimmedProperty.length < minLength) {
    return {
      isPropertyValid: false,
      message: errors.minLengthError,
    };
  }

  if (trimmedProperty.length > maxLength) {
    return {
      isPropertyValid: false,
      message: errors.maxLengthError,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: trimmedProperty,
  };
};

export const listPropertiesValidator = (property, error) => {
  if (!property) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  if (typeof property !== "string" && !Array.isArray(property)) {
    return {
      isPropertyValid: false,
      message: error,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty:
      Array.isArray(property) && sanitizeList(property).length > 0
        ? property.map((s) => s.trim().toLowerCase())
        : typeof property === "string"
          ? [property?.trim().toLowerCase()]
          : [],
  };
};

export const addressValidator = (address) => {
  if (!isPlainObject(address)) {
    return {
      isAddressValid: false,
      message: errorsConfig.invalidAddressError.message,
    };
  }

  const validatedAddress = {};

  for (let addressField in address) {
    switch (addressField) {
      case addressProperties.street:
        const {
          isPropertyValid: isStreetValid,
          message: streetError,
          validatedProperty: validatedStreet,
        } = stringPropertiesValidator(
          address[addressField],
          propertyConstraints.minStringLength,
          propertyConstraints.maxStringLength,
          {
            invalidError: errorsConfig.invalidStreetError,
            minLengthError: errorsConfig.streetMinLengthError,
            maxLengthError: errorsConfig.streetMaxLengthError,
          },
        );

        if (!isStreetValid) {
          throwError(ValidationError, {
            status: streetError.statusCode,
            name: streetError.title,
            message: streetError.message,
            data: {
              property: address[addressField],
            },
          });
        }

        validatedAddress[addressField] = validatedStreet;
        break;

      case addressProperties.landmark:
        const {
          isPropertyValid: isLandmarkValid,
          message: landmarkError,
          validatedProperty: validatedLandmark,
        } = stringPropertiesValidator(
          address[addressField],
          propertyConstraints.minStringLength,
          propertyConstraints.maxStringLength,
          {
            invalidError: errorsConfig.invalidLandmarkError,
            minLengthError: errorsConfig.landmarkMinLengthError,
            maxLengthError: errorsConfig.landmarkMaxLengthError,
          },
        );

        if (!isLandmarkValid) {
          throwError(ValidationError, {
            status: landmarkError.statusCode,
            name: landmarkError.title,
            message: landmarkError.message,
            data: {
              property: address[addressField],
            },
          });
        }

        validatedAddress[addressField] = validatedLandmark;
        break;

      case addressProperties.city:
        const {
          isPropertyValid: isCityValid,
          message: cityError,
          validatedProperty: validatedCity,
        } = stringPropertiesValidator(
          address[addressField],
          propertyConstraints.minStringLength,
          propertyConstraints.maxStringLength,
          {
            invalidError: errorsConfig.invalidCityError,
            minLengthError: errorsConfig.cityMinLengthError,
            maxLengthError: errorsConfig.cityMaxLengthError,
          },
        );

        if (!isCityValid) {
          throwError(ValidationError, {
            status: cityError.statusCode,
            name: cityError.title,
            message: cityError.message,
            data: {
              property: address[addressField],
            },
          });
        }

        validatedAddress[addressField] = validatedCity;
        break;

      case addressProperties.state:
        const {
          isPropertyValid: isStateValid,
          message: stateError,
          validatedProperty: validatedState,
        } = stringPropertiesValidator(
          address[addressField],
          propertyConstraints.minStringLength,
          propertyConstraints.maxStringLength,
          {
            invalidError: errorsConfig.invalidStateError,
            minLengthError: errorsConfig.stateMinLengthError,
            maxLengthError: errorsConfig.stateMaxLengthError,
          },
        );

        if (!isStateValid) {
          throwError(ValidationError, {
            status: stateError.statusCode,
            name: stateError.title,
            message: stateError.message,
            data: {
              property: address[addressField],
            },
          });
        }

        validatedAddress[addressField] = validatedState;
        break;

      case addressProperties.countryCode:
        const {
          isPropertyValid: isCountryCodeValid,
          message: countryCodeError,
          validatedProperty: validatedCountryCode,
        } = numberRegexPropertiesValidator(
          address[addressField],
          COUNTRY_CODE_REGEX,
          errorsConfig.invalidCountryCodeError,
        );

        if (!isCountryCodeValid) {
          throwError(ValidationError, {
            status: countryCodeError.statusCode,
            name: countryCodeError.title,
            message: countryCodeError.message,
            data: {
              property: address[addressField],
            },
          });
        }

        validatedAddress[addressField] = validatedCountryCode;
        break;

      case addressProperties.country:
        const {
          isPropertyValid: isSCountryValid,
          message: countryError,
          validatedProperty: validatedCountry,
        } = stringPropertiesValidator(
          address[addressField],
          propertyConstraints.minStringLength,
          propertyConstraints.maxStringLength,
          {
            invalidError: errorsConfig.invalidCountryError,
            minLengthError: errorsConfig.countryMinLengthError,
            maxLengthError: errorsConfig.countryMaxLengthError,
          },
        );

        if (!isSCountryValid) {
          throwError(ValidationError, {
            status: countryError.statusCode,
            name: countryError.title,
            message: countryError.message,
            data: {
              property: address[addressField],
            },
          });
        }

        validatedAddress[addressField] = validatedCountry;
        break;

      case addressProperties.pinCode:
        const {
          isPropertyValid: isPinCodeValid,
          message: pinCodeError,
          validatedProperty: validatedPinCode,
        } = numberRegexPropertiesValidator(
          address[addressField],
          PIN_CODE_REGEX,
          errorsConfig.invalidPinCodeError,
        );

        if (!isPinCodeValid) {
          throwError(ValidationError, {
            status: pinCodeError.statusCode,
            name: pinCodeError.title,
            message: pinCodeError.message,
            data: {
              property: address[addressField],
            },
          });
        }

        validatedAddress[addressField] = validatedPinCode;
        break;
    }
  }

  return validatedAddress;
};

export const validateConnectionStatus = (connectionStatus) => {
  if (
    typeof connectionStatus !== "string" ||
    !Object.values(connectionStatusProperties).includes(
      connectionStatus?.trim().toLowerCase(),
    )
  ) {
    throwError(ValidationError, {
      status: errorsConfig.invalidConnectionRequestError.statusCode,
      name: errorsConfig.invalidConnectionRequestError.title,
      message: errorsConfig.invalidConnectionRequestError.message,
      data: { connectionStatus },
    });
  }

  return connectionStatus?.trim().toLowerCase();
};

export const validateNotification = (property) => {
  if (!property) return;

  if (
    typeof property !== "string" ||
    (!Object.values(notificationTypes).includes(
      property?.trim().toLowerCase(),
    ) &&
      !Object.values(notificationStatusProperties).includes(
        property?.trim().toLowerCase(),
      ))
  ) {
    throwError(ValidationError, {
      status: errorsConfig.invalidNotificationRequestError.statusCode,
      name: errorsConfig.invalidNotificationRequestError.title,
      message: errorsConfig.invalidNotificationRequestError.message,
      data: { property },
    });
  }

  return notification?.trim().toLowerCase();
};

export const paginationValidator = (value) => {
  if (value && isNaN(Number(value))) {
    throwError(ValidationError, {
      status: errorsConfig.invalidPaginationError.statusCode,
      name: errorsConfig.invalidPaginationError.title,
      message: errorsConfig.invalidPaginationError.message,
      data: { value },
    });
  }

  return Number(value);
};
