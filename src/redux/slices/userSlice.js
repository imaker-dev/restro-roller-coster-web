import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import UserServices from "../services/UserServices";

export const fetchAllUsers = createAsyncThunk(
  "/fetch/outlets",
  async ({ page,limit,search,outletId }) => {
    const res = await UserServices.getAllUsersApi(page, limit, search,outletId);
    return res.data;
  },
);
export const fetchUserById = createAsyncThunk(
  "/fetch/user/id",
  async (userId) => {
    const res = await UserServices.getUserByIdApi(userId);
    return res.data;
  },
);
export const createUser = createAsyncThunk("/create/user", async (values) => {
  const res = await UserServices.addUserApi(values);
  return res.data;
});
export const updateUser = createAsyncThunk("/update/user", async ({id,values}) => {
  const res = await UserServices.updateUserApi(id,values);
  return res.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isCreatingUser: false,
    isupdatingUser: false,
    allUsers: null,
    userDetails: null,
    isFetchingUserDetails: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchUserById.pending, (state) => {
        state.isFetchingUserDetails = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isFetchingUserDetails = false;
        state.userDetails = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isFetchingUserDetails = false;
        toast.error(action.error.message);
      })
      .addCase(createUser.pending, (state) => {
        state.isCreatingUser = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreatingUser = false;
        toast.success(action.payload.message);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreatingUser = false;
        toast.error(action.error.message);
      })
      .addCase(updateUser.pending, (state) => {
        state.isupdatingUser = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isupdatingUser = false;
        toast.success(action.payload.message);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isupdatingUser = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = userSlice;
export default reducer;
