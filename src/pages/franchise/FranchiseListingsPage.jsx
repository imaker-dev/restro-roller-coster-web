import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { Building2, Edit2, Eye, MapPin, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";
import { useDispatch, useSelector } from "react-redux";
import { fetchFranchises } from "../../redux/slices/franchiseListingSlice";
import SmartTable from "../../components/SmartTable";

const FranchiseListingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetchingFranchises, allFranchisesData } = useSelector(
    (state) => state.franchise,
  );

  const { franchises, pagination } = allFranchisesData || {};

  const fetchAllFranchises = () => {
    dispatch(fetchFranchises());
  };

  useEffect(() => {
    fetchAllFranchises();
  }, []);


  const franchiseColumns = [
    {
      key: "franchise",
      label: "Franchise",
      sortable: true,
      sortKey: "name",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 truncate">
                {row.name}
              </h4>

              {row.is_featured === 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium">
                  <Star size={10} fill="currentColor" />
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="capitalize text-xs text-slate-500">
                {row.category}
              </span>

              <span className="text-slate-300">•</span>

              <span
                className={`text-xs font-medium capitalize ${
                  row.status === "active"
                    ? "text-emerald-600"
                    : row.status === "inactive"
                      ? "text-red-500"
                      : "text-amber-600"
                }`}
              >
                {row.status}
              </span>
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "location",
      label: "Location",
      sortable: true,
      sortKey: "location_city",
      render: (row) => (
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />

          <div>
            <div className="font-medium text-slate-800">
              {row.location_city || "—"}
            </div>

            <div className="text-xs text-slate-500">
              {row.location_state || "—"}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "investment",
      label: "Investment",
      sortable: true,
      sortKey: "investment_min",
      render: (row) => {
        const min = Number(row.investment_min || 0);
        const max = Number(row.investment_max || 0);

        return (
          <div>
            <div className="font-semibold text-slate-900">
              ₹{(min / 100000).toFixed(1)}L{" - "}₹{(max / 100000).toFixed(1)}L
            </div>

            <div className="text-xs text-slate-500">Initial Investment</div>
          </div>
        );
      },
    },

    {
      key: "franchise_fee",
      label: "Fee",
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">
            ₹{Number(row.franchise_fee || 0).toLocaleString()}
          </div>

          <div className="text-xs text-slate-500">Franchise Fee</div>
        </div>
      ),
    },

    {
      key: "outlets_live",
      label: "Network",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building2 size={15} className="text-slate-400" />

          <div>
            <div className="font-bold text-slate-900">
              {row.outlets_live || 0}
            </div>

            <div className="text-xs text-slate-500">Live Outlets</div>
          </div>
        </div>
      ),
    },

    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <div className="max-w-[220px]">
          <div
            className="font-medium text-slate-800 truncate"
            title={row.contact_email}
          >
            {row.contact_email || "—"}
          </div>

          <div className="text-xs text-slate-500">
            {row.contact_phone || "—"}
          </div>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(
          `${ROUTE_PATHS.FRANCHISE_INQUIRIES}?franchiseId=${row.id}`,
        ),
    },
    {
      label: "Edit",
      icon: Edit2,
      color: "blue",
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.FRANCHISE_LISTINGS_ADD}?franchiseId=${row.id}`),
    },
  ];

  const actions = [
    {
      label: "List Franchise",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.FRANCHISE_LISTINGS_ADD),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Listed Franchise"}
        actions={actions}
        showBackButton
        onRefresh={fetchAllFranchises}
        isRefreshing={isFetchingFranchises}
      />

      <SmartTable
        title="Franchise Catalog"
        totalcount={pagination?.total}
        data={franchises}
        columns={franchiseColumns}
        actions={rowActions}
        loading={isFetchingFranchises}
        emptyMessage="No Franchise Listings Found"
        emptyDescription="Add your first franchise listing to showcase opportunities to prospective franchise partners and investors."
      />
    </div>
  );
};

export default FranchiseListingPage;
