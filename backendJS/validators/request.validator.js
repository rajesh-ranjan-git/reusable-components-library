import { httpStatusConfig } from "../config/http.config.js";
import AppError from "../errors/app.error.js";

export const validateParams = (req, required = false) => {
  if (!required) return;

  if (!req.params || Object.keys(req.params).length === 0) {
    throw new AppError({
      message: "The request contains invalid or missing parameters!",
      code: "INVALID REQUEST",
      statusCode: httpStatusConfig.badRequest.statusCode,
      details: { params: req.params },
    });
  }

  return req.params;
};

export const validateQuery = (req, required = false) => {
  if (!required) return;

  if (!req.query || Object.keys(req.query).length === 0) {
    throw new AppError({
      message: "The request contains invalid or missing query parameters!",
      code: "INVALID REQUEST",
      statusCode: httpStatusConfig.badRequest.statusCode,
      details: { query: req.query },
    });
  }

  return req.query;
};

export const validateBody = (req, required = false) => {
  if (!required) return;

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError({
      message: "The request body contains invalid or missing information!",
      code: "INVALID REQUEST",
      statusCode: httpStatusConfig.badRequest.statusCode,
      details: { body: req.body },
    });
  }

  return req.body;
};
