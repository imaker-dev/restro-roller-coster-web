import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOutlets, updateOutlet } from "../../redux/slices/outletSlice";
import SmartTable from "../../components/SmartTable";
import {
  Building2,
  Clock,
  Edit2,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../layout/StatusBadge";
import { ROLES } from "../../constants";
import { ROUTE_PATHS } from "../../config/paths";
import SearchBar from "../../components/SearchBar";
import OutletDetailsDrawer from "../../partial/outlet/OutletDetailsDrawer";

const AllOutletsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  const { allOutlets, loading } = useSelector((state) => state.outlet);

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
     TIMING
  =============================== */
    {
      key: "timing",
      label: "Operating Hours",
      sortable: false,
      render: (row) => {
        if (row.is_24_hours) {
          return (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
              24 Hours
            </span>
          );
        }

        if (!row.opening_time || !row.closing_time) {
          return <span className="text-slate-400">-</span>;
        }

        return (
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            {row.opening_time.slice(0, 5)} - {row.closing_time.slice(0, 5)}
          </div>
        );
      },
    },

    /* ===============================
     STATUS
  =============================== */
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge value={row.is_active} />,
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => setSelectedOutlet(row),
      // onClick: (row) =>
      //   navigate(`${ROUTE_PATHS.OUTLET_DETAILS}?outletId=${row.id}`),
    },
    {
      label: "Edit",
      icon: Edit2,
      color: "blue",
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.OUTLET_ADD}?outletId=${row.id}`),
    },
    {
      label: "Delete",
      icon: Trash2,
      color: "red",
      roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.OUTLET_DELETE}?outletId=${row.id}`),
    },
  ];

  const actions = [
    {
      label: "Add New Outlet",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.OUTLET_ADD),
      roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Outlets"} actions={actions} />

        <SearchBar onSearch={(v) => setSearchTerm(v)} />

        <SmartTable
          title="Outlets"
          totalcount={allOutlets?.length}
          data={allOutlets}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />

        <OutletDetailsDrawer
          isOpen={!!selectedOutlet}
          onClose={() => setSelectedOutlet(null)}
          outlet={selectedOutlet}
        />
      </div>
    </>
  );
};

export default AllOutletsPage;
