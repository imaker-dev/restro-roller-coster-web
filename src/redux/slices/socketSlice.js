import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    connected: false,
    connecting: false,
  },
  reducers: {
    socketConnecting: (state) => {
      state.connecting = true;
      state.connected = false;
    },

    socketConnected: (state) => {
      state.connecting = false;
      state.connected = true;
    },

    socketDisconnected: (state) => {
      state.connecting = false;
      state.connected = false;
    },
  },
});

export const {
  socketConnecting,
  socketConnected,
  socketDisconnected,
} = socketSlice.actions;

export default socketSlice.reducer;