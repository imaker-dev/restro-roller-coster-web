import { TOKEN_KEYS } from "../constants";

export const getRawToken = () =>
  localStorage.getItem(TOKEN_KEYS.ACCESS) ||
  sessionStorage.getItem(TOKEN_KEYS.ACCESS);

export const getBearerToken = () => {
  const token = getRawToken();
  return token ? `Bearer ${token}` : null;
};

export const isLoggedIn = () => !!getRawToken();

export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  localStorage.removeItem(TOKEN_KEYS.QR_SESSION);
  sessionStorage.removeItem(TOKEN_KEYS.ACCESS);
  sessionStorage.removeItem(TOKEN_KEYS.REFRESH);
  localStorage.removeItem(TOKEN_KEYS.LOGIN_SOURCE)
};
