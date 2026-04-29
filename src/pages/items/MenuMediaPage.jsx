import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMenuMedia,
  fetchMenuMedia,
  toggleMenuMediaActive,
  uploadMenuMedia,
} from "../../redux/slices/menuMediaSlice";
import { FileText, Clock, Plus, X, Eye, ImageOff } from "lucide-react";
import StatusBadge from "../../layout/StatusBadge";
import MenuMediaModal from "../../partial/items/MenuMediaModal";
import { handleResponse } from "../../utils/helpers";
import ModalAction from "../../components/ModalAction";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";
import NoDataFound from "../../layout/NoDataFound";

/* ─────────────────────────────────────────
   PREVIEW MODAL
───────────────────────────────────────── */

const PreviewModal = ({ item, onClose }) => {
  if (!item) return null;

  const title = item.title?.trim() || `Menu #${item.id}`;
  const isImage = item.file_type === "image";
  const isPDF = item.file_type === "pdf";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <span className="font-semibold text-sm text-gray-900 truncate">
            {title}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-50">
          {isImage && (
            <img
              src={item.url}
              alt={title}
              className="w-full max-h-[75vh] object-contain mx-auto"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          {isPDF && (
            <div className="flex flex-col">
              <iframe
                src={item.url}
                title="PDF Preview"
                className="w-full h-[75vh] border-0"
              />

              {/* Fallback action */}
              <div className="p-3 text-center border-t border-gray-200 bg-white">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-amber-600 hover:underline"
                >
                  Open in new tab
                </a>
              </div>
            </div>
          )}

          {/* Fallback if unknown type */}
          {!isImage && !isPDF && (
            <div className="flex flex-col items-center justify-center h-60 gap-3">
              <FileText size={48} className="text-gray-400" />
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline text-amber-600 hover:text-amber-700"
              >
                Open File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MEDIA CARD (Grid View)
───────────────────────────────────────── */
const MediaCard = ({ item, onToggle, onDelete, onPreview }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden bg-gray-100 flex items-center justify-center"
        style={{ aspectRatio: "4/3" }}
      >
        {item.file_type === "image" ? (
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <FileText size={48} className="text-gray-400" />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/90 text-gray-900">
          {item.file_type === "pdf" ? "PDF" : "IMG"}
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge value={item.is_active} />
        </div>
        {/* Menu Type Badge - Bottom Left */}
        <div
          className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold uppercase tracking-tight capitalize shadow-sm`}
        >
          {item.menu_type}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {item.title || `Menu #${item.id}`}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Clock size={12} className="text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-600">
                {new Date(item.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                #{item.display_order}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onToggle(item)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              item.is_active
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {item.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => onPreview(item)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const MenuMediaPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);

  const { isFetching, mediaList, isUploading, isToggling, isDeleting } =
    useSelector((state) => state.menuMedia);

  const fetchMedia = () => {
    dispatch(fetchMenuMedia({ outletId }));
  };

  useEffect(() => {
    if (outletId) {
      fetchMedia();
    }
  }, [outletId]);

  const [showUpload, setShowUpload] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [statusItem, setStatusItem] = useState(null);

  /* Handlers */
  const handleToggle = (item) => {
    setStatusItem({ item, newStatus: item.is_active ? 0 : 1 });
  };

  const confirmStatusChange = async () => {
    const { item, newStatus } = statusItem;

    await handleResponse(
      dispatch(
        toggleMenuMediaActive({
          id: item.id,
          isActive: newStatus,
        }),
      ),
      () => {
        fetchMedia();
        setStatusItem(null);
      },
    );
  };

  const handleDelete = (item) => setDeleteItem(item);

  const confirmDelete = async () => {
    await handleResponse(
      dispatch(deleteMenuMedia({ id: deleteItem.id })),
      () => {
        fetchMedia();
        setDeleteItem(null);
      },
    );
  };

  const handleUpload = async ({ formData, resetForm }) => {
    await handleResponse(
      dispatch(uploadMenuMedia({ outletId, formData })),
      () => {
        fetchMedia();
        setShowUpload(false);
        resetForm();
      },
    );
  };

  const actions = [
    {
      label: "Add Media",
      type: "primary",
      icon: Plus,
      onClick: () => setShowUpload(true),
    },
    {
      label: "View QR Codes",
      type: "secondary",
      icon: Eye,
      onClick: () => navigate(ROUTE_PATHS.MENU_MEDIA_QR_CODES),
    },
  ];

  if (isFetching) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader title="Menu Media" actions={actions} showBackButton />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mediaList?.length > 0 ? (
            mediaList.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onPreview={setPreviewItem}
              />
            ))
          ) : (
            <NoDataFound
              icon={ImageOff}
              title="No media found"
              description="Upload media to see it here"
              className="col-span-full"
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <MenuMediaModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSubmit={handleUpload}
        loading={isUploading}
      />

      {previewItem && (
        <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
      )}

      <ModalAction
        id="delete-menu-media"
        isOpen={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Delete Media"
        description={`Are you sure you want to delete "${
          deleteItem?.title?.trim() || `Menu #${deleteItem?.id}`
        }"? This action cannot be undone.`}
        theme="danger"
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
      />

      <ModalAction
        id="toggle-menu-media-status"
        isOpen={statusItem}
        onClose={() => setStatusItem(null)}
        onConfirm={confirmStatusChange}
        title="Change Status?"
        description={`Are you sure you want to ${
          statusItem?.newStatus ? "activate" : "deactivate"
        } this media?`}
        theme="warning"
        confirmText="Confirm"
        cancelText="Cancel"
        loading={isToggling}
      />
    </>
  );
};

export default MenuMediaPage;
