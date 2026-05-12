import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import TransactionServices from "../services/TransactionServices";

// Fetch all transactions
export const fetchAllTransactions = createAsyncThunk(
  "/fetch/transactions",
  async ({ page, limit, search, dateRange }) => {
    const res = await TransactionServices.getAllTransactionsApi({
      page,
      limit,
      search,
      dateRange,
    });
    return res.data;
  },
);

// Fetch transaction by id
export const fetchTransactionById = createAsyncThunk(
  "/fetch/transaction-by-id",
  async ({ transactionId }) => {
    const res = await TransactionServices.getTransactionByIdApi({
      transactionId,
    });

    return res.data;
  },
);

// Download transaction invoice
export const downloadTransactionInvoice = createAsyncThunk(
  "/download/transaction-invoice",
  async ({ transactionId }) => {
    const res = await TransactionServices.downloadTransactionInvoiceApi({
      transactionId,
    });

    return res.data;
  },
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    isFetchingTransactions: false,
    isFetchingTransaction: false,
    
    allTransactions: null,
    transactionDetails: null,

    invoiceToDownloadId: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // fetch all transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.isFetchingTransactions = true;
      })

      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.isFetchingTransactions = false;
        state.allTransactions = action.payload;
      })

      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.isFetchingTransactions = false;
        toast.error(action.error.message);
      })

      // fetch transaction by id
      .addCase(fetchTransactionById.pending, (state) => {
        state.isFetchingTransaction = true;
      })

      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.isFetchingTransaction = false;
        state.transactionDetails = action.payload.data;
      })

      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.isFetchingTransaction = false;
        toast.error(action.error.message);
      })

      // download transaction invoice
      .addCase(downloadTransactionInvoice.pending, (state,action) => {
        state.invoiceToDownloadId = action.meta.arg.transactionId;
      })

      .addCase(downloadTransactionInvoice.fulfilled, (state, action) => {
        state.invoiceToDownloadId = null;
        toast.success("Invoice Downloaded Successfully");
      })

      .addCase(downloadTransactionInvoice.rejected, (state, action) => {
        state.invoiceToDownloadId = null;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = transactionSlice;

export default reducer;
