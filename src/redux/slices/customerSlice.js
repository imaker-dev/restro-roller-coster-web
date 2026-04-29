import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import CustomerServices from "../services/CustomerServices";

// Fetch All Customers
export const fetchAllCustomers = createAsyncThunk(
  "/fetch/outlets/customers",
  async ({outletId}) => {
    const res = await CustomerServices.getAllCustomersApi(outletId);
    return res.data;
  }
);

// Fetch Customer By ID
export const fetchCustomerById = createAsyncThunk(
  "/fetch/customer",
  async ({outletId,customerId}) => {
    const res = await CustomerServices.getCustomerByIdApi(outletId,customerId);
    return res.data;
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    loading: false,
    allCustomers: null,
    isfetchingCustomerDetails:false,
    customerDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // =========================
      // FETCH ALL CUSTOMERS
      // =========================
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.allCustomers = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })

      // =========================
      // FETCH CUSTOMER BY ID
      // =========================
      .addCase(fetchCustomerById.pending, (state) => {
        state.isfetchingCustomerDetails = true;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isfetchingCustomerDetails = false;
        state.customerDetails = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isfetchingCustomerDetails = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = customerSlice;
export default reducer;