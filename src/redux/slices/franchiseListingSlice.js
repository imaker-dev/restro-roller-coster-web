import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import FranchiseListingServices from "../services/FranchiseListingServices";

// GET ALL FRANCHISES
export const fetchFranchises = createAsyncThunk(
  "/fetch/franchises",
  async () => {
    const res = await FranchiseListingServices.getAllFranchisesApi();
    return res.data;
  },
);

// GET FRANCHISE BY ID
export const fetchFranchiseById = createAsyncThunk(
  "/fetch/franchise-by-id",
  async (id) => {
    const res = await FranchiseListingServices.getFranchiseByIdApi(id);
    return res.data;
  },
);

// CREATE FRANCHISE
export const createFranchise = createAsyncThunk(
  "/create/franchise",
  async (values) => {
    const res = await FranchiseListingServices.createFranchiseApi(values);
    return res.data;
  },
);

// UPDATE FRANCHISE
export const updateFranchise = createAsyncThunk(
  "/update/franchise",
  async ({ id, values }) => {
    const res = await FranchiseListingServices.updateFranchiseApi(id, values);
    return res.data;
  },
);

// GET FRANCHISE INQUIRIES
export const fetchFranchiseInquiries = createAsyncThunk(
  "/fetch/franchise-inquiries",
  async (id) => {
    const res = await FranchiseListingServices.getFranchisesInquiryApi(id);
    return res.data;
  },
);

// UPDATE FRANCHISE INQUIRY STATUS
export const updateFranchiseInquiry = createAsyncThunk(
  "/update/franchise-inquiry",
  async ({ id, values }) => {
    const res = await FranchiseListingServices.updateFranchisesInquiryApi(
      id,
      values,
    );

    return res.data;
  },
);

const franchiseListingSlice = createSlice({
  name: "franchise",

  initialState: {
    isFetchingFranchises: false,
    allFranchisesData: null,

    isFetchingFranchise: false,
    franchiseDetails: null,

    isCreatingFranchise: false,
    isUpdatingFranchise: false,

    isFetchingFranchiseInquiries: false,
    allFranchiseInquiriesData: null,

    isUpdatingFranchiseInquiry: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ── FETCH FRANCHISES ────────────────────
      .addCase(fetchFranchises.pending, (state) => {
        state.isFetchingFranchises = true;
      })
      .addCase(fetchFranchises.fulfilled, (state, action) => {
        state.isFetchingFranchises = false;
        state.allFranchisesData = action.payload?.data;
      })
      .addCase(fetchFranchises.rejected, (state, action) => {
        state.isFetchingFranchises = false;
        toast.error(action.error.message);
      })

      // ── FETCH FRANCHISE BY ID ────────────────────
      .addCase(fetchFranchiseById.pending, (state) => {
        state.isFetchingFranchise = true;
      })
      .addCase(fetchFranchiseById.fulfilled, (state, action) => {
        state.isFetchingFranchise = false;
        state.franchiseDetails = action.payload?.data;
      })
      .addCase(fetchFranchiseById.rejected, (state, action) => {
        state.isFetchingFranchise = false;
        toast.error(action.error.message);
      })

      // ── CREATE FRANCHISE ────────────────────
      .addCase(createFranchise.pending, (state) => {
        state.isCreatingFranchise = true;
      })
      .addCase(createFranchise.fulfilled, (state, action) => {
        state.isCreatingFranchise = false;

        toast.success(
          action.payload?.message || "Franchise created successfully",
        );
      })
      .addCase(createFranchise.rejected, (state, action) => {
        state.isCreatingFranchise = false;
        toast.error(action.error.message);
      })

      // ── UPDATE FRANCHISE ────────────────────
      .addCase(updateFranchise.pending, (state) => {
        state.isUpdatingFranchise = true;
      })
      .addCase(updateFranchise.fulfilled, (state, action) => {
        state.isUpdatingFranchise = false;

        toast.success(
          action.payload?.message || "Franchise updated successfully",
        );
      })
      .addCase(updateFranchise.rejected, (state, action) => {
        state.isUpdatingFranchise = false;
        toast.error(action.error.message);
      })

      // ── FETCH FRANCHISE INQUIRIES ────────────────────
      .addCase(fetchFranchiseInquiries.pending, (state) => {
        state.isFetchingFranchiseInquiries = true;
      })
      .addCase(fetchFranchiseInquiries.fulfilled, (state, action) => {
        state.isFetchingFranchiseInquiries = false;
        state.allFranchiseInquiriesData = action.payload?.data;
      })
      .addCase(fetchFranchiseInquiries.rejected, (state, action) => {
        state.isFetchingFranchiseInquiries = false;
        toast.error(action.error.message);
      })

      // ── UPDATE FRANCHISE INQUIRY ────────────────────
      .addCase(updateFranchiseInquiry.pending, (state) => {
        state.isUpdatingFranchiseInquiry = true;
      })
      .addCase(updateFranchiseInquiry.fulfilled, (state, action) => {
        state.isUpdatingFranchiseInquiry = false;

        toast.success(
          action.payload?.message || "Inquiry updated successfully",
        );
      })
      .addCase(updateFranchiseInquiry.rejected, (state, action) => {
        state.isUpdatingFranchiseInquiry = false;
        toast.error(action.error.message);
      });
  },
});

const { reducer } = franchiseListingSlice;

export default reducer;
