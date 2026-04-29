import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { Loader2, Mail, User, MapPin, Hash, Tag, Star } from "lucide-react";
import RoleBadge from "./RoleBadge";
import StatusBadge from "../../layout/StatusBadge";
import InfoCard from "../../components/InfoCard";

const RemoveStationFromUserModal = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  loading = false,
}) => {
  const station = user?.station;

  const handleRemove = async () => {
    if (!station) return;
    await onSubmit({ userId: user.id, stationId: station.stationId });
  };

  return (
    <ModalBasic id="remove-station-user" isOpen={isOpen} onClose={onClose}>
      <div>
        {/* ── HEADER ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-red-900 px-6 pt-6 pb-14">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-red-400/10" />
          <div className="absolute -right-2 top-8 h-16 w-16 rounded-full bg-red-300/10" />

          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-red-200/80">
            Station Management
          </p>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Remove Station
          </h2>
        </div>

        {/* ── USER CARD ── */}
        <div className="relative z-10 mx-5 -mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg shadow-slate-200/60">
          <div className="flex items-center gap-3">
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
        <div className="px-5 pt-6 pb-2 space-y-4">
          {/* Station card or empty state */}
          {!station ? (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm italic text-slate-400">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              No station currently assigned.
            </div>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 space-y-3">
              {/* Name row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      {station.stationName}
                    </p>
                    {station.isPrimary && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                        <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                        Primary Station
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning info card */}
          <InfoCard
            title="Heads up!"
            description={`Removing this station will unlink ${user?.name ?? "this user"} from ${station?.stationName ?? "the station"}. You can reassign a station at any time.`}
            type="warning"
            size="sm"
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
            type="button"
            onClick={handleRemove}
            disabled={!station || loading}
            className="flex items-center gap-2 rounded bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-red-600 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Removing…" : "Remove Station"}
          </button>
        </div>
      </div>
    </ModalBasic>
  );
};

export default RemoveStationFromUserModal;
