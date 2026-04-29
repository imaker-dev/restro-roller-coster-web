import { TOKEN_KEYS } from "../constants";

// utils/deviceId.js
export function getDeviceId() {
  let id = localStorage.getItem(TOKEN_KEYS.DEVICE_ID);

  if (!id) {
    id = crypto.randomUUID(); // native UUID (modern browsers)
    localStorage.setItem(TOKEN_KEYS.DEVICE_ID, id);
  }

  return id;
}
