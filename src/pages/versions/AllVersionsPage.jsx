import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVersion,
  fetchAllVersions,
  updateVersion,
} from "../../redux/slices/versionSlice";
import { Edit2, Eye, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SmartTable from "../../components/SmartTable";
import StatusBadge from "../../layout/StatusBadge";
import { formatDate } from "../../utils/dateFormatter";
import ModalAction from "../../components/ModalAction";
import { handleResponse } from "../../utils/helpers";
import VersionModal from "../../partial/version/VersionModal";
import { ROUTE_PATHS } from "../../config/paths";

const AllVersionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteItem, setDeleteItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const { allVersions, loading, isDeletingVersion, isUpdatingVersion } =
    useSelector((state) => state.version);

  const fetchVersions = () => {
    dispatch(fetchAllVersions());
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const actions = [
    {
      label: "Add New Version",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(`${ROUTE_PATHS.VERSION_ADD}`),
    },
  ];

  const columns = [
    {
      key: "version",
      label: "Version",
      render: (row) => (
        <div className="flex flex-col">
          <p className="text-xs font-extrabold text-slate-800">
            v{row.version}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Build {row.build}
          </p>
        </div>
      ),
    },

    {
      key: "platform",
      label: "Platform",
      render: (row) => (
        <span className="text-[11px] font-semibold text-slate-600 uppercase">
          {row.platform}
        </span>
      ),
    },

    {
      key: "channel",
      label: "Channel",
      render: (row) => (
        <span className="text-[11px] font-semibold text-slate-500">
          {row.channel}
        </span>
      ),
    },

    {
      key: "release_notes",
      label: "Notes",
      render: (row) => (
        <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
          {row.release_notes || "—"}
        </p>
      ),
    },

    {
      key: "release_date",
      label: "Release Date",
      sortValue: (row) => new Date(row.release_date).getTime(),
      render: (row) => (
        <div>
          <p className="text-[11px] font-semibold text-slate-600">
            {formatDate(row.release_date, "long")}
          </p>
          <p className="text-[10px] text-slate-400">
            {formatDate(row.release_date, "time")}
          </p>
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge value={row.is_active} />,
    },

    {
      key: "links",
      label: "Download",
      render: (row) => (
        <div className="flex flex-col gap-1 text-[10px]">
          {row.download_url && (
            <a
              href={row.download_url}
              target="_blank"
              className="text-blue-600 font-semibold"
            >
              Direct Link
            </a>
          )}

          {row.android_url && (
            <a
              href={row.android_url}
              target="_blank"
              className="text-green-600 font-semibold"
            >
              Android
            </a>
          )}

          {row.ios_url && (
            <a
              href={row.ios_url}
              target="_blank"
              className="text-slate-800 font-semibold"
            >
              iOS
            </a>
          )}
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`${ROUTE_PATHS.VERSION_DETAILS}?versionId=${row.id}`),
    },
    {
      label: "Edit",
      icon: Edit2,
      color: "blue",
      onClick: (row) => setEditItem(row),
    },
    {
      label: "Delete",
      icon: Trash2,
      color: "red",
      onClick: (row) => setDeleteItem(row),
    },
  ];

  const confirmDelete = async () => {
    if (!deleteItem) return;

    await handleResponse(dispatch(deleteVersion(deleteItem.id)), () => {
      fetchVersions();
      setDeleteItem(null);
    });
  };

  const handleUpdate = async ({ id, values }) => {
    await handleResponse(dispatch(updateVersion({ id, values })), () => {
      fetchVersions();
      setEditItem(null);
    });
  };

  return (
    <>
      <div className="space-y-5">
        <PageHeader title={"All Versions"} actions={actions} />

        <SmartTable
          title="Versions"
          totalcount={allVersions?.length}
          data={allVersions}
          columns={columns}
          actions={rowActions}
          loading={loading}
          showSr
        />
      </div>

      <ModalAction
        id="delete-version"
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Delete Version"
        description={`Are you sure you want to delete "v${
          deleteItem?.version || deleteItem?.id
        }"? This action cannot be undone.`}
        theme="danger"
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeletingVersion}
      />

      <VersionModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleUpdate}
        versionData={editItem}
        loading={isUpdatingVersion}
      />
    </>
  );
};

export default AllVersionsPage;
