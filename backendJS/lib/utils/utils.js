import {
  errorsConfig,
  errorTypesConfig,
  httpStatusConfig,
} from "../../config/config.js";
import CustomError from "../errors/CustomError.js";

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getRandomItem = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

export const getNumRange = (start, stop, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step,
  );

export const isPlainObject = (data) => {
  return typeof data === "object" && data !== null && !Array.isArray(data);
};

export const omitObjectProperties = (obj, keysToOmit) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.includes(key)),
  );
};

export const selectObjectProperties = (obj, keysToSelect) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keysToSelect.includes(key)),
  );
};

export const toSentenceCase = (text) => {
  if (!text) {
    return "";
  }

  let temp = text.toLowerCase().split("_").join(" ").split("-").join(" ");

  return temp.charAt(0).toUpperCase() + temp.slice(1) + ".";
};

export const toTitleCase = (text) => {
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .split("_")
    .join(" ")
    .split("-")
    .join(" ")
    .split(" ")
    .map((word) => {
      if (word.length === 0) {
        return "";
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const getUrlString = (text) => {
  if (!text) {
    return "";
  }

  return `/${text.toLowerCase().split(" ").join("-").split("_").join("-")}`;
};

export const getTransformedDate = (dateString) => {
  if (!dateString) return "N/A";

  return new Date(dateString)
    .toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase());
};

export const sanitizeList = (arr) =>
  arr.map((v) => v.trim()).filter((v) => v.length > 0);

export const deepEquals = (a, b) => {
  if (Object.is(a, b)) return true;

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object") return a === b;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const objA = a;
  const objB = b;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEquals(objA[key], objB[key])) return false;
  }

  return true;
};

export const sanitizeSingleMongoDocument = (doc) => {
  if (!doc || typeof doc !== "object") {
    return doc;
  }

  if (Array.isArray(doc)) {
    return doc.map((item) => sanitizeSingleMongoDocument(item));
  }

  if (doc.constructor && doc.constructor.name === "ObjectId") {
    return doc.toString();
  }

  if (doc instanceof Date) {
    return doc;
  }

  let plainDoc = doc;
  if (doc.toObject && typeof doc.toObject === "function") {
    plainDoc = doc.toObject();
  }

  const sanitized = { ...plainDoc };

  if (sanitized._id) {
    sanitized.id = sanitized._id.toString();
    delete sanitized._id;
  }

  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];

    if (value && typeof value === "object") {
      sanitized[key] = sanitizeSingleMongoDocument(value);
    }
  });

  return sanitized;
};

export const sanitizeMongoData = (data) => {
  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((doc) => sanitizeSingleMongoDocument(doc));
  }

  return sanitizeSingleMongoDocument(data);
};

export const getSecretRoomId = (participants) => {
  return participants.sort().join("-");
};

export const buildPagination = (totalCount, validatedPage, validatedLimit) => ({
  total: totalCount || 0,
  page: validatedPage || 1,
  limit: validatedLimit || 10,
  totalPages:
    totalCount && validatedLimit ? Math.ceil(totalCount / validatedLimit) : 0,
});

export const successResponseHandler = (
  res,
  {
    status = httpStatusConfig.success.message,
    statusCode = httpStatusConfig.success.statusCode,
    message = null,
    data = null,
  } = {},
) => {
  return res.status(status.statusCode).json({
    success: true,
    status: status,
    statusCode: statusCode,
    message,
    data,
  });
};

export const errorResponseHandler = (err, req, res, next) => {
  const isProduction = process.env.MODE_ENV === "production";
  logger.error("❌ ERROR OBJECT:", err);
  logger.error("❌ ERROR STACK:", err?.stack);

  let response;

  if (err instanceof CustomError) {
    response = {
      success: false,
      status: err.name,
      type: err.type,
      statusCode: err.status,
      message: err.message,
      apiUrl: err.apiUrl || req.originalUrl,
      data: err.data,
      timestamp: err.timestamp,
    };

    if (!isProduction) {
      response.stack = err.stack;
    }

    return res.status(err.status).json(response);
  }

  response = {
    success: false,
    status: err.name || errorsConfig.internalServerError.statusCode,
    type: errorTypesConfig.unknownError,
    statusCode: errorsConfig.internalServerError.statusCode,
    message: err.message || errorsConfig.internalServerError.message,
    apiUrl: req.originalUrl,
    data: null,
    timestamp: new Date().toISOString(),
  };

  if (!isProduction) {
    response.stack = err.stack;
  }

  return res.status(500).json(response);
};
