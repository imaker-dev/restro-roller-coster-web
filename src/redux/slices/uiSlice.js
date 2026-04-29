import { createSlice } from "@reduxjs/toolkit";

// uiSlice.js
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    kotTab: "",
  },
  reducers: {
    setKotTab(state, action) {
      state.kotTab = action.payload;
    },
  },
});

export const { setKotTab } = uiSlice.actions;
export default uiSlice.reducer;
