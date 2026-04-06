import { sanitizeList } from "@/utils/common.utils";

type ValidationResult<T> =
  | { isPropertyValid: true; validatedProperty: T | null }
  | { isPropertyValid: false; message: string };

export const regexPropertiesValidator = (
  property: unknown,
  regex: RegExp,
): ValidationResult<string> => {
  if (!property) {
    return { isPropertyValid: true, validatedProperty: null };
  }

  if (typeof property !== "string") {
    return {
      isPropertyValid: false,
      message: `${property} must be a string URL!`,
    };
  }

  const incomingProperty = property.trim();

  if (!regex.test(incomingProperty)) {
    return {
      isPropertyValid: false,
      message: `Invalid ${incomingProperty} URL!`,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: incomingProperty,
  };
};

export const numberRegexPropertiesValidator = (
  property: unknown,
  regex: RegExp,
  error: string,
): ValidationResult<string | number> => {
  if (!property) {
    return { isPropertyValid: true, validatedProperty: null };
  }

  const value = typeof property === "string" ? property.trim() : property;

  if (!regex.test(String(value)) || isNaN(Number(value))) {
    return {
      isPropertyValid: false,
      message: error,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: value as string | number,
  };
};

export const numberPropertiesValidator = (
  property: unknown,
  minValue: number,
  maxValue: number,
  errors: Record<string, string>,
): ValidationResult<number> => {
  if (property === undefined || property === null || property === "") {
    return { isPropertyValid: true, validatedProperty: null };
  }

  const value = typeof property === "string" ? property.trim() : property;

  if (isNaN(Number(value))) {
    return {
      isPropertyValid: false,
      message: errors.INVALID_ERROR,
    };
  }

  if (!Number.isInteger(Number(value))) {
    return {
      isPropertyValid: false,
      message: errors.DECIMAL_ERROR,
    };
  }

  const num = Number(value);

  if (num < minValue) {
    return {
      isPropertyValid: false,
      message: errors.MIN_LENGTH_ERROR,
    };
  }

  if (num > maxValue) {
    return {
      isPropertyValid: false,
      message: errors.MAX_LENGTH_ERROR,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: num,
  };
};

export const stringPropertiesValidator = (
  property: unknown,
  minLength: number,
  maxLength: number,
  errors: Record<string, string>,
): ValidationResult<string> => {
  if (!property) {
    return { isPropertyValid: true, validatedProperty: null };
  }

  if (typeof property !== "string") {
    return {
      isPropertyValid: false,
      message: errors.INVALID_ERROR,
    };
  }

  const trimmed = property.trim().toLowerCase();

  if (trimmed.length < minLength) {
    return {
      isPropertyValid: false,
      message: errors.MIN_LENGTH_ERROR,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      isPropertyValid: false,
      message: errors.MAX_LENGTH_ERROR,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: trimmed,
  };
};

export const listPropertiesValidator = (
  property: unknown,
  error: string,
): ValidationResult<string[]> => {
  if (!property) {
    return { isPropertyValid: true, validatedProperty: null };
  }

  if (typeof property !== "string" && !Array.isArray(property)) {
    return {
      isPropertyValid: false,
      message: error,
    };
  }

  const result =
    Array.isArray(property) && sanitizeList(property).length > 0
      ? property.map((s) => String(s).trim().toLowerCase())
      : typeof property === "string"
        ? [property.trim().toLowerCase()]
        : [];

  return {
    isPropertyValid: true,
    validatedProperty: result,
  };
};
