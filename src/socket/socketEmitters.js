import { getSocket } from "./socket";
import { TABLE_MERGED, TABLE_UNMERGED, TABLE_UPDATED } from "./socketEvents";

const emit = (event, payload, cb) => {
  const socket = getSocket();
  if (!socket) return;
  socket.emit(event, payload, cb);
};

// TABLE
export const emitUpdateTable = (eventType, payload, cb) => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit(
    TABLE_UPDATED,
    {
      event: eventType,
      ...payload,
    },
    cb
  );
};
