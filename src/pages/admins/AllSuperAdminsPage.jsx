import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import {
  Building2,
  Edit,
  Eye,
  Plus,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSuperAdmins,
  toggleSuperAdminStatus,
} from "../../redux/slices/adminSlice";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";
import RoleBadge from "../../partial/user/RoleBadge";
import UserAvatar from "../../components/UserAvatar";
import SmartTable from "../../components/SmartTable";
import ConfirmationOverlay from "../../partial/admin/ConfirmationOverlay";
import { handleResponse } from "../../utils/helpers";

const AllSuperAdminsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    type: null, // 'activate' | 'deactivate'
    admin: null,
  });

  const fetchAdmins = () => {
    dispatch(fetchAllSuperAdmins());
  };
  useEffect(() => {
    fetchAdmins();
  }, []);

  const { isFetchingSuperAdmin, allSuperAdmins, isUpdatingStatus } =
    useSelector((state) => state.admin);

  const { data, pagination } = allSuperAdmins || {};

  const handleToggleStatus = (admin, type) => {
    setConfirmation({
      isOpen: true,
      type,
      admin,
    });
  };

  const handleSubmitToggle = async () => {
    const { admin, type } = confirmation;

    await handleResponse(
      dispatch(
        toggleSuperAdminStatus({
          id: admin.id,
          isActive: type === "activate",
        }),
      ),
      () => {
        setConfirmation({ isOpen: false, type: null, admin: null });
        fetchAdmins();
      },
    );
  };

  const handleCloseConfirmation = () => {
    setConfirmation({ isOpen: false, type: null, admin: null });
  };

  const actions = [
    {
      label: "Add New Franchise Partner",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.SUPER_ADMIN_ADD),
    },
  ];

  const columns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 max-w-[240px]">
          <UserAvatar
            name={row.name}
            src={row.avatarUrl}
            className="sm"
            verified={row.isVerified}
          />

          <div className="flex flex-col min-w-0">
            <span className="text-slate-800 font-semibold truncate">
              {row.name}
            </span>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{row.employeeCode}</span>
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "contact",
      label: "Contact",
      sortable: false,
      render: (row) => (
        <div className="flex flex-col max-w-[220px]">
          <span className="text-sm text-slate-600 truncate">
            {row.email || "No Email"}
          </span>

          <span className="text-xs text-slate-400 truncate">
            {row.phone || "No Phone"}
          </span>
        </div>
      ),
    },

    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => <RoleBadge role={row.role} />,
    },

    {
      key: "outlets",
      label: "Outlets",

      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Building2 size={14} className="text-slate-400" />
          <span className="text-[12px] font-extrabold text-slate-800 tabular-nums">
            {row.outletCount ?? 0}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            outlets
          </span>
        </div>
      ),
    },

    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge value={row.isActive} />,
    },

    {
      key: "lastLoginAt",
      label: "Last Login",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-600">
          {row.lastLoginAt ? formatDate(row.lastLoginAt, "longTime") : "Never"}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View Details",
      icon: Eye,
      color: "primary",
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.SUPER_ADMIN_DETAILS}?userId=${row.id}`),
    },
    // {
    //   label: "Edit",
    //   icon: Edit,
    //   color: "secondary",
    //   onClick: (row) => navigate(`${ROUTE_PATHS.SUPER_ADMIN_EDIT}/${row.id}`),
    // },
    {
      label: (row) => (row.isActive ? "Deactivate" : "Activate"),
      icon: (row) => (row.isActive ? ShieldOff : ShieldCheck),
      color: "blue",
      loading: (row) => false,
      disabled: (row) => false,
      onClick: (row) =>
        handleToggleStatus(row, row.isActive ? "deactivate" : "activate"),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Franchise Partners"} actions={actions} />

        <SmartTable
          title="Franchise Partners"
          totalcount={pagination?.total}
          data={data}
          columns={columns}
          actions={rowActions}
          loading={isFetchingSuperAdmin}
        />
      </div>

      {/* Confirmation Overlay */}
      <ConfirmationOverlay
        isOpen={confirmation.isOpen}
        onClose={handleCloseConfirmation}
        onSubmit={handleSubmitToggle}
        loading={isUpdatingStatus}
        admin={confirmation.admin}
        type={confirmation.type}
      />
    </>
  );
};

export default AllSuperAdminsPage;
