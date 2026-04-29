import React, { useEffect } from "react";
import PageHeader from "../../../layout/PageHeader";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxGroupById } from "../../../redux/slices/taxSlice";
import {
  Percent,
  Calendar,
  CheckCircle,
  XCircle,
  Layers,
  FileText,
} from "lucide-react";
import { formatDate } from "../../../utils/dateFormatter";
import LoadingOverlay from "../../../components/LoadingOverlay";
import NoDataFound from "../../../layout/NoDataFound";

const TaxGroupDetailsPage = () => {
  const { groupId } = useQueryParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (groupId) dispatch(fetchTaxGroupById(groupId));
  }, [groupId]);

  const { isFetchingTaxGroupDetails, taxGroupDetails: taxData } = useSelector(
    (state) => state.tax,
  );

  if (isFetchingTaxGroupDetails) {
    return <LoadingOverlay text="Loading Tax Group..." />;
  }

  if (!taxData) {
    return <NoDataFound title="No Tax Group Found" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={taxData?.name}
        description={taxData?.description}
        showBackButton
        badge={
          taxData?.is_active ? (
            <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              Active
            </span>
          ) : (
            <span className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-sm font-medium">
              <XCircle size={16} />
              Inactive
            </span>
          )
        }
      />

      <div className="w-full bg-white rounded-md border border-slate-200/60 p-6 space-y-8">
        {/* ===== Basic Info ===== */}
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            icon={<Percent size={18} />}
            label="Total Tax Rate"
            value={`${taxData?.total_rate}%`}
          />

          <InfoCard
            icon={<FileText size={18} />}
            label="Tax Code"
            value={taxData?.code}
          />

          <InfoCard
            icon={<Calendar size={18} />}
            label="Created At"
            value={formatDate(taxData?.created_at, "longTime")}
          />

          <InfoCard
            icon={<Calendar size={18} />}
            label="Updated At"
            value={formatDate(taxData?.updated_at, "longTime")}
          />
        </div>

        {/* ===== Components Section ===== */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Layers className="text-primary-600" size={22} />
            <h2 className="text-xl font-semibold text-slate-800">
              Tax Components
            </h2>
          </div>

          <div className="space-y-4">
            {taxData?.components?.map((component) => (
              <div
                key={component?.id}
                className="group flex justify-between items-center p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div>
                  <p className="text-base font-semibold text-slate-800">
                    {component?.name}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Code: {component?.code}
                  </p>
                </div>

                <div className="bg-primary-600 text-white px-5 py-2 rounded text-sm font-semibold shadow">
                  {component?.rate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxGroupDetailsPage;

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300">
      <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );
}
