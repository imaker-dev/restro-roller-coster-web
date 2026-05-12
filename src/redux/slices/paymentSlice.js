import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import PaymentServices from "../services/PaymentServices";

export const createRazorPayOrder = createAsyncThunk(
  "/create/razpor-pay/order",
  async ({ values }) => {
    const res = await PaymentServices.createRazorPayOrderApi({ values });
    return res.data;
  },
);
export const verifyRazorPayPayment = createAsyncThunk(
  "/verify/razpor-pay/payment",
  async ({ values }) => {
    const res = await PaymentServices.verifyPaymentApi({ values });
    return res.data;
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    isCreatingRazorPayOrder: false,
    isVerifyingRazorPayOrder: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRazorPayOrder.pending, (state) => {
        state.isCreatingRazorPayOrder = true;
      })
      .addCase(createRazorPayOrder.fulfilled, (state, action) => {
        state.isCreatingRazorPayOrder = false;
        // toast.success(action.payload.message)
      })
      .addCase(createRazorPayOrder.rejected, (state, action) => {
        state.isCreatingRazorPayOrder = false;
        toast.error(action.error.message);
      })
      .addCase(verifyRazorPayPayment.pending, (state) => {
        state.isVerifyingRazorPayOrder = true;
      })
      .addCase(verifyRazorPayPayment.fulfilled, (state, action) => {
        state.isVerifyingRazorPayOrder = false;
        toast.success(action.payload.message)
      })
      .addCase(verifyRazorPayPayment.rejected, (state, action) => {
        state.isVerifyingRazorPayOrder = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = paymentSlice;
export default reducer;
