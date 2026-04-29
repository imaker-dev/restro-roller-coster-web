import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import KotServices from "../services/KotServices";

export const fetchAllOrdersKot = createAsyncThunk(
  "/fetch/orders/kot",
  async ({ status, station }) => {
    const res = await KotServices.getAllOrdersKotApi(status, station);
    return res.data;
  },
);
export const acceptOrderKot = createAsyncThunk(
  "/accept/order/kot",
  async (id) => {
    const res = await KotServices.acceptOrderKotApi(id);
    return res.data;
  },
);
export const prepareOrderKot = createAsyncThunk(
  "/prepare/order/kot",
  async (id) => {
    const res = await KotServices.prepareOrderKotApi(id);
    return res.data;
  },
);
export const markReadyKot = createAsyncThunk("/ready/order/kot", async (id) => {
  const res = await KotServices.readyOrderKotApi(id);
  return res.data;
});

export const serveOrderKot = createAsyncThunk(
  "/serve/order/kot",
  async (id) => {
    const res = await KotServices.serveOrderKotApi(id);
    return res.data;
  },
);
export const markKotItemReady = createAsyncThunk(
  "/mark/kot-item/ready",
  async (id) => {
    const res = await KotServices.markKOtItemReadyApi(id);
    return res.data;
  },
);

const incStat = (state, key) => {
  if (state.allOrdersKot.stats[key] !== undefined) {
    state.allOrdersKot.stats[key] += 1;
  }
};

const decStat = (state, key) => {
  if (
    state.allOrdersKot.stats[key] !== undefined &&
    state.allOrdersKot.stats[key] > 0
  ) {
    state.allOrdersKot.stats[key] -= 1;
  }
};

const updateKotInState = (state, updatedKot) => {
  const index = state.allOrdersKot.kots.findIndex(
    (k) => k.id === updatedKot.id,
  );

  if (index !== -1) {
    state.allOrdersKot.kots[index] = updatedKot;
  }
};

const kotSlice = createSlice({
  name: "kot",
  initialState: {
    loading: false,
    updatingKotId: null,
    kotItemToReadyId: null,
    // allOrdersKot: null,
    allOrdersKot: {
      kots: [],
      stats: {
        pending_count: 0,
        active_count: 0,
      },
    },
  },
  reducers: {
    newKot(state, action) {
      const rawKot = action.payload;

      const kot = {
        id: rawKot.id,
        kotNumber: rawKot.kotNumber,
        orderNumber: rawKot.orderNumber,
        tableNumber: rawKot.tableNumber || null,
        station: rawKot.station,
        status: "pending",

        // counts
        itemCount: rawKot.itemCount || 0,
        totalItemCount: rawKot.itemCount || 0,
        readyCount: 0,
        cancelledItemCount: 0,

        createdAt: rawKot.createdAt,

        items: rawKot.items.map((i) => ({
          id: i.id,
          name: i.name,
          variantName: i.variantName || null,
          quantity: Number(i.quantity),
          itemType: i.itemType,
          status: "pending",
          addons: i.addons || [],
          specialInstructions: i.specialInstructions || null,
        })),
      };

      const exists = state.allOrdersKot.kots.find((k) => k.id === kot.id);
      if (exists) return;
      state.allOrdersKot.kots.unshift(kot);
      incStat(state, "pending_count");
    },

    kotPreparing(state, action) {
      const updatedKot = action.payload;

      const existing = state.allOrdersKot.kots.find(
        (k) => k.id === updatedKot.id,
      );

      if (existing?.status === "pending") {
        decStat(state, "pending_count");
        incStat(state, "preparing_count");
      }

      updateKotInState(state, updatedKot);
    },

    kotReady(state, action) {
      const updatedKot = action.payload;

      const existing = state.allOrdersKot.kots.find(
        (k) => k.id === updatedKot.id,
      );

      if (existing?.status === "preparing") {
        decStat(state, "preparing_count");
        incStat(state, "ready_count");
      }

      updateKotInState(state, updatedKot);
    },

    itemReady(state, action) {
      updateKotInState(state, action.payload);
    },

    // kotServed(state, action) {
    //   updateKotInState(state, action.payload);
    // },

    kotServed(state, action) {
      const servedKot = action.payload;

      state.allOrdersKot.kots = state.allOrdersKot.kots.filter(
        (k) => k.id !== servedKot.id,
      );

      decStat(state, "ready_count");
    },

    kotCancelled(state, action) {
      const updatedKot = action.payload;

      const existing = state.allOrdersKot.kots.find(
        (k) => k.id === updatedKot.id,
      );

      if (existing) {
        decStat(state, `${existing.status}_count`);
      }

      incStat(state, "cancelled_count");

      updateKotInState(state, updatedKot);
    },
    itemCancelled(state, action) {
      updateKotInState(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrdersKot.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrdersKot.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrdersKot = action.payload.data;
      })
      .addCase(fetchAllOrdersKot.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(acceptOrderKot.pending, (state, action) => {
        state.updatingKotId = action.meta.arg;
      })
      .addCase(acceptOrderKot.fulfilled, (state, action) => {
        state.updatingKotId = null;
        toast.success(action.payload.message);
      })
      .addCase(acceptOrderKot.rejected, (state, action) => {
        state.updatingKotId = null;
        toast.error(action.error.message);
      })
      .addCase(prepareOrderKot.pending, (state, action) => {
        state.updatingKotId = action.meta.arg;
      })
      .addCase(prepareOrderKot.fulfilled, (state, action) => {
        state.updatingKotId = null;
        toast.success(action.payload.message);
      })
      .addCase(prepareOrderKot.rejected, (state, action) => {
        state.updatingKotId = null;
        toast.error(action.error.message);
      })
      .addCase(markReadyKot.pending, (state, action) => {
        state.updatingKotId = action.meta.arg;
      })
      .addCase(markReadyKot.fulfilled, (state, action) => {
        state.updatingKotId = null;
        toast.success(action.payload.message);
      })
      .addCase(markReadyKot.rejected, (state, action) => {
        state.updatingKotId = null;
        toast.error(action.error.message);
      })
      .addCase(serveOrderKot.pending, (state, action) => {
        state.updatingKotId = action.meta.arg;
      })
      .addCase(serveOrderKot.fulfilled, (state, action) => {
        state.updatingKotId = null;
        toast.success(action.payload.message);
      })
      .addCase(serveOrderKot.rejected, (state, action) => {
        state.updatingKotId = null;
        toast.error(action.error.message);
      })
      .addCase(markKotItemReady.pending, (state, action) => {
        state.kotItemToReadyId = action.meta.arg;
      })
      .addCase(markKotItemReady.fulfilled, (state, action) => {
        state.kotItemToReadyId = null;
        toast.success(action.payload.message);
      })
      .addCase(markKotItemReady.rejected, (state, action) => {
        state.kotItemToReadyId = null;
        toast.error(action.error.message);
      });
  },
});

export const {
  newKot,
  kotPreparing,
  kotReady,
  itemReady,
  kotServed,
  kotCancelled,
  itemCancelled,
} = kotSlice.actions;

// Export reducer
const { reducer } = kotSlice;
export default reducer;
