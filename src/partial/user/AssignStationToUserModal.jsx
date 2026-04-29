import React, { useEffect, useMemo } from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Loader2,
  MapPin,
  Mail,
  ShieldCheck,
  ChevronDown,
  CircleDot,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStations } from "../../redux/slices/stationSlice";
import RoleBadge from "./RoleBadge";
import StatusBadge from "../../layout/StatusBadge";
import InfoCard from "../../components/InfoCard";

const validationSchema = Yup.object({
  stationId: Yup.string().required("Station is required"),
});

const AssignStationToUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  outletId,
  user,
  loading = false,
}) => {
  const { allStations, loading: isFetchingStations } = useSelector(
    (state) => state.station,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) dispatch(fetchAllStations(outletId));
  }, [isOpen, outletId, dispatch]);

  const stationOptions = useMemo(
    () => allStations?.map((s) => ({ label: s?.name, value: s?.id })) ?? [],
    [allStations],
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { stationId: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit({
        userId: user.id,
        values: {
          outletId: Number(outletId),
          stationId: Number(values.stationId),
        },
        resetForm,
      });
    },
  });

  const hasError = formik.touched.stationId && formik.errors.stationId;

  return (
    <ModalBasic
      id="assign-station-user"
      // title=""
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        {/* ── HEADER BAND ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 px-6 pt-6 pb-14">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-400/10" />
          <div className="absolute -right-2 top-8 h-16 w-16 rounded-full bg-emerald-300/10" />

          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-200/80">
            Station Management
          </p>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Assign Station
          </h2>
        </div>

        {/* ── USER CARD (floats over header) ── */}
        <div className="relative z-10 mx-5 -mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg shadow-slate-200/60">
          <div className="flex items-center gap-4">
            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name || "—"}
              </p>

              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {user?.email || "No email on record"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {user?.roles?.[0] && <RoleBadge role={user.roles[0]} />}
                <StatusBadge value={user?.isActive} />
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="px-5 pt-6 pb-2">
          <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            Select Station
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            {isFetchingStations ? (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading stations…
              </div>
            ) : (
              <>
                <select
                  name="stationId"
                  value={formik.values.stationId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className={`w-full form-input appearance-none rounded-xl border bg-slate-50 py-3.5 pl-4 pr-10 text-sm text-slate-800 outline-none transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60
                    ${
                      hasError
                        ? "border-red-400 bg-red-50/40 ring-2 ring-red-100 focus:border-red-500"
                        : "border-slate-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
                    }`}
                >
                  <option value="">Choose a station…</option>
                  {stationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </>
            )}
          </div>

          {hasError && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
              {formik.errors.stationId}
            </p>
          )}
        </div>

        <div>
          <InfoCard
            title="Station Assignment Info"
            description="This user will be assigned to the selected station and will receive print jobs from all printers configured for that station."
            type="warning"
            size="sm"
            className="mx-5 mt-4"
          />
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded bg-primary-500 hover:bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px  active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Assigning…" : "Assign Station"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default AssignStationToUserModal;
