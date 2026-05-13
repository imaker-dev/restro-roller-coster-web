import { v4 as uuidv4 } from "uuid";

import { TOKEN_KEYS } from "../constants";

export function getDeviceId() {
  let id = localStorage.getItem(TOKEN_KEYS.DEVICE_ID);

  if (!id) {
    id = uuidv4();
    localStorage.setItem(TOKEN_KEYS.DEVICE_ID, id);
  }

  return id;
}