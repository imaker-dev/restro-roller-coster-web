// utils/errorHandler.js
import { clearAuthStorage } from "./authToken";

export const ERROR_TYPES = {
  AUTH: "AUTH",
  SUBSCRIPTION: "SUBSCRIPTION",
  ORDER: "ORDER",
};

const errorPatterns = {
  [ERROR_TYPES.AUTH]: [
    "Access token required",
    "Invalid access token",
    "Invalid or expired token",
    "The user belonging to this token no longer exists",
  ],
  [ERROR_TYPES.SUBSCRIPTION]: [
    "Your subscription has expired. Please renew to continue using the system.",
  ],
  [ERROR_TYPES.ORDER]: [
     "Invalid or expired session",
    "Session verification failed",
    "This order is no longer active. Please start a new session",
  ],
};

export const identifyError = (errorMessage) => {
  for (const [type, messages] of Object.entries(errorPatterns)) {
    if (messages.some((msg) => errorMessage.includes(msg))) {
      return type;
    }
  }
  return null;
};
