import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import MenuMediaServices from "../services/MenuMediaServices";

// Upload single file
export const uploadMenuMedia = createAsyncThunk(
  "/menu-media/upload",
  async ({ outletId, formData }) => {
    const res = await MenuMediaServices.uploadMenuMediaApi(outletId, formData);
    return res.data;
  }
);

// Upload multiple files
export const uploadMultipleMenuMedia = createAsyncThunk(
  "/menu-media/upload-multiple",
  async ({ outletId, formData }) => {
    const res = await MenuMediaServices.uploadMultipleMenuMediaApi(outletId, formData);
    return res.data;
  }
);

// Fetch media list
export const fetchMenuMedia = createAsyncThunk(
  "/menu-media/get",
  async ({ outletId, params }) => {
    const res = await MenuMediaServices.getMenuMediaApi(outletId, params);
    return res.data;
  }
);

// Fetch public view data
export const viewMenuMedia = createAsyncThunk(
  "/menu-media/view",
  async ({ outletId }) => {
    const res = await MenuMediaServices.viewMenuMediaApi(outletId);
    return res.data;
  }
);

// Update metadata
export const updateMenuMedia = createAsyncThunk(
  "/menu-media/update",
  async ({ id, data }) => {
    const res = await MenuMediaServices.updateMenuMediaApi(id, data);
    return res.data;
  }
);

// Toggle active state
export const toggleMenuMediaActive = createAsyncThunk(
  "/menu-media/toggle-active",
  async ({ id, isActive }) => {
    const res = await MenuMediaServices.toggleMenuMediaActiveApi(id, isActive);
    return res.data;
  }
);

// Replace media file
export const replaceMenuMedia = createAsyncThunk(
  "/menu-media/replace",
  async ({ id, formData }) => {
    const res = await MenuMediaServices.replaceMenuMediaApi(id, formData);
    return res.data;
  }
);

// Delete media
export const deleteMenuMedia = createAsyncThunk(
  "/menu-media/delete",
  async ({ id }) => {
    const res = await MenuMediaServices.deleteMenuMediaApi(id);
    return res.data;
  }
);

export const fetchAllQrCodes = createAsyncThunk(
  "/menu-media/qr/all",
  async ({ outletId }) => {
    const res = await MenuMediaServices.getAllQrCodesApi(outletId);
    return res.data;
  }
);

export const regenerateQr = createAsyncThunk(
  "/menu-media/qr/regenerate",
  async ({ outletId, menuType }) => {
    const res = await MenuMediaServices.regenerateQrApi(outletId, menuType);
    return res.data;
  }
);

export const uploadQrLogo = createAsyncThunk(
  "/menu-media/qr/upload-logo",
  async ({ outletId, menuType, formData }) => {
    const res = await MenuMediaServices.uploadQrLogoApi(
      outletId,
      menuType,
      formData
    );
    return res.data;
  }
);

const menuMediaSlice = createSlice({
  name: "menuMedia",
  initialState: {
    isUploading: false,
    isUploadingMultiple: false,
    isFetching: false,
    isViewing: false,
    isUpdating: false,
    isToggling: false,
    isReplacing: false,
    isDeleting: false,
    mediaList: [],
    viewData: null,
    uploadResult: null,

    isFetchingQrCodes: false,
isRegeneratingQr: false,
isUploadingQrLogo: false,
qrCodes: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(uploadMenuMedia.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadMenuMedia.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadResult = action.payload.data;
        toast.success(action.payload.message);
      })
      .addCase(uploadMenuMedia.rejected, (state, action) => {
        state.isUploading = false;
        toast.error(action.error.message);
      })

      .addCase(uploadMultipleMenuMedia.pending, (state) => {
        state.isUploadingMultiple = true;
      })
      .addCase(uploadMultipleMenuMedia.fulfilled, (state, action) => {
        state.isUploadingMultiple = false;
        state.uploadResult = action.payload.data;
        toast.success(action.payload.message);
      })
      .addCase(uploadMultipleMenuMedia.rejected, (state, action) => {
        state.isUploadingMultiple = false;
        toast.error(action.error.message);
      })

      .addCase(fetchMenuMedia.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchMenuMedia.fulfilled, (state, action) => {
        state.isFetching = false;
        state.mediaList = action.payload.data;
      })
      .addCase(fetchMenuMedia.rejected, (state, action) => {
        state.isFetching = false;
        toast.error(action.error.message);
      })

      .addCase(viewMenuMedia.pending, (state) => {
        state.isViewing = true;
      })
      .addCase(viewMenuMedia.fulfilled, (state, action) => {
        state.isViewing = false;
        state.viewData = action.payload.data;
      })
      .addCase(viewMenuMedia.rejected, (state, action) => {
        state.isViewing = false;
        toast.error(action.error.message);
      })

      .addCase(updateMenuMedia.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateMenuMedia.fulfilled, (state, action) => {
        state.isUpdating = false;
        toast.success(action.payload.message);
      })
      .addCase(updateMenuMedia.rejected, (state, action) => {
        state.isUpdating = false;
        toast.error(action.error.message);
      })

      .addCase(toggleMenuMediaActive.pending, (state) => {
        state.isToggling = true;
      })
      .addCase(toggleMenuMediaActive.fulfilled, (state, action) => {
        state.isToggling = false;
        toast.success(action.payload.message);
      })
      .addCase(toggleMenuMediaActive.rejected, (state, action) => {
        state.isToggling = false;
        toast.error(action.error.message);
      })

      .addCase(replaceMenuMedia.pending, (state) => {
        state.isReplacing = true;
      })
      .addCase(replaceMenuMedia.fulfilled, (state, action) => {
        state.isReplacing = false;
        toast.success(action.payload.message);
      })
      .addCase(replaceMenuMedia.rejected, (state, action) => {
        state.isReplacing = false;
        toast.error(action.error.message);
      })

      .addCase(deleteMenuMedia.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteMenuMedia.fulfilled, (state, action) => {
        state.isDeleting = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteMenuMedia.rejected, (state, action) => {
        state.isDeleting = false;
        toast.error(action.error.message);
      })


      .addCase(fetchAllQrCodes.pending, (state) => {
  state.isFetchingQrCodes = true;
})
.addCase(fetchAllQrCodes.fulfilled, (state, action) => {
  state.isFetchingQrCodes = false;
  state.qrCodes = action.payload.data;
})
.addCase(fetchAllQrCodes.rejected, (state, action) => {
  state.isFetchingQrCodes = false;
  toast.error(action.error.message);
})

.addCase(regenerateQr.pending, (state) => {
  state.isRegeneratingQr = true;
})
.addCase(regenerateQr.fulfilled, (state, action) => {
  state.isRegeneratingQr = false;
  toast.success(action.payload.message);
})
.addCase(regenerateQr.rejected, (state, action) => {
  state.isRegeneratingQr = false;
  toast.error(action.error.message);
})

.addCase(uploadQrLogo.pending, (state) => {
  state.isUploadingQrLogo = true;
})
.addCase(uploadQrLogo.fulfilled, (state, action) => {
  state.isUploadingQrLogo = false;
  toast.success(action.payload.message);
})
.addCase(uploadQrLogo.rejected, (state, action) => {
  state.isUploadingQrLogo = false;
  toast.error(action.error.message);
})
  },
});

export default menuMediaSlice.reducer;