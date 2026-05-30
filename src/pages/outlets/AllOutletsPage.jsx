import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  assignOutletToSuperAdmin,
  fetchAllOutlets,
  updateOutlet,
} from "../../redux/slices/outletSlice";
import SmartTable from "../../components/SmartTable";
import {
  Building2,
  CalendarDays,
  Clock,
  Edit2,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../layout/StatusBadge";
import { ROLES } from "../../constants";
import { ROUTE_PATHS } from "../../config/paths";
import SearchBar from "../../components/SearchBar";
import OutletDetailsDrawer from "../../partial/outlet/OutletDetailsDrawer";
import AssignSuperAdminModal from "../../partial/outlet/AssignSuperAdminModal";
import { handleResponse } from "../../utils/helpers";
import SubscriptionBadge from "../../partial/subscription/SubscriptionBadge";
import { formatDate } from "../../utils/dateFormatter";

const AllOutletsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [assignModalOutlet, setAssignModalOutlet] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);

  const { allOutlets, loading, isAssigningOutlet } = useSelector(
    (state) => state.outlet,
  );

  const fetchOutlets = () => {
    dispatch(fetchAllOutlets({ search: searchTerm }));
  };

  useEffect(() => {
    fetchOutlets();
  }, [searchTerm]);

  const columns = [
    /* ===============================
     OUTLET (Name + Legal + Code)
  =============================== */
    {
      key: "name",
      label: "Outlet",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800 truncate">
              {row.name}
            </span>
          </div>

          {row.legal_name && (
            <span className="text-xs text-slate-500 truncate">
              {row.legal_name}
            </span>
          )}
        </div>
      ),
    },

    /* ===============================
     LOCATION
  =============================== */
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (row) => (
        <div className="flex items-start gap-2 text-slate-700 max-w-[220px]">
          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="flex flex-col text-sm leading-tight">
            <span>{row.city || "-"}</span>
            <span className="text-xs text-slate-500">
              {row.state || ""} {row.country ? `• ${row.country}` : ""}
            </span>
          </div>
        </div>
      ),
    },

    /* ===============================
     CONTACT
  =============================== */
    {
      key: "contact",
      label: "Contact",
      sortable: false,
      render: (row) => (
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            {row.phone || "-"}
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[160px]">{row.email || "-"}</span>
          </div>
        </div>
      ),
    },

    /* ===============================
   SUBSCRIPTION
================================ */
    {
      key: "subscription",
      label: "Subscription",
      sortable: false,
      render: (row) => {
        const plan = row.subscription_plan;

        if (!plan) {
          return <span className="text-slate-400">-</span>;
        }

        return (
          <div className="flex flex-col gap-1 min-w-[170px]">
            <SubscriptionBadge type="status" value={plan.status} size="sm" />

            {plan.end_date && (
              <div className="text-xs text-slate-600">
                Ends: {formatDate(plan.end_date, "long")}
              </div>
            )}

            {plan.grace_period_end && plan.status !== "active" && (
              <div className="text-[11px] text-amber-600">
                Grace till {formatDate(plan.grace_period_end, "long")}
              </div>
            )}
          </div>
        );
      },
    },

    /* ===============================
   CREATED BY
================================ */
    {
      key: "created_by",
      label: "Created By",
      sortable: true,
      render: (row) => (
        <div className="min-w-0 flex flex-col">
          <span className="text-sm font-semibold text-slate-800 truncate">
            {row.created_by?.name || row.created_by || "System"}
          </span>

          <span className="text-xs text-slate-500">
            {row.created_at ? formatDate(row.created_at, "long") : "-"}
          </span>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      // onClick: (row) => setSelectedOutlet(row),
      roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.OUTLET_DETAILS}?outletId=${row.id}`),
    },
    {
      label: "Assign",
      icon: UserPlus,
      color: "violet",
      roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      onClick: (row) => {
        (setShowAssignModal(true), setAssignModalOutlet(row));
      },
    },
    {
      label: "Edit",
      icon: Edit2,
      color: "blue",
      roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.OUTLET_ADD}?outletId=${row.id}`),
    },
    {
      label: "Delete",
      icon: Trash2,
      color: "red",
      roles: [ROLES.MASTER],
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.OUTLET_DELETE}?outletId=${row.id}`),
    },
  ];

  const resetOutletUI = () => {
    setSelectedOutlet(null);
    setAssignModalOutlet(null);
    setShowAssignModal(false);
  };

  const actions = [
    {
      label: "Add New Outlet",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.OUTLET_ADD),
      roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
    },
  ];

  const handleAssignSuperAdmin = async ({
    outletId,
    superAdminId,
    resetForm,
  }) => {
    await handleResponse(
      dispatch(assignOutletToSuperAdmin({ outletId, superAdminId })),
      () => {
        fetchOutlets();
        resetOutletUI();
        resetForm();
      },
    );
  };
  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={"All Outlets"}
          actions={actions}
          onRefresh={fetchOutlets}
          isRefreshing={loading}
        />

        <SearchBar onSearch={(v) => setSearchTerm(v)} />

        <SmartTable
          title="Outlets"
          totalcount={allOutlets?.length}
          data={allOutlets}
          columns={columns}
          actions={rowActions}
          loading={loading}
          emptyMessage="No Outlets Found"
          emptyDescription="No outlets are currently available to display."
        />
      </div>

      <OutletDetailsDrawer
        isOpen={!!selectedOutlet}
        onClose={resetOutletUI}
        outlet={selectedOutlet}
      />

      {/* Assign Super Admin Modal */}
      <AssignSuperAdminModal
        isOpen={showAssignModal}
        onClose={resetOutletUI}
        onSubmit={handleAssignSuperAdmin}
        outlet={assignModalOutlet}
        loading={isAssigningOutlet}
      />
    </>
  );
};

export default AllOutletsPage;
