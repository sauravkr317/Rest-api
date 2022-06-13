import { ValidationError } from "joi";
import { DEBUG_MODE } from "../config";
import CustomerrorHandler from "../services/CustomerrorHandler";

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "Internal server error",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };

  if (err instanceof ValidationError) {
      statusCode = 522,
      data = {
          message: err.message
      }
  }

  if (err instanceof CustomerrorHandler) {
      statusCode = err.status;
      data = {
          message: err.message
      }
  }

  return res.status(statusCode).json(data)
};

export default errorHandler;
