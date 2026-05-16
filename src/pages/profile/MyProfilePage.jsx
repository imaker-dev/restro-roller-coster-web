import React from "react";
import PageHeader from "../../layout/PageHeader";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Hash,
  ShieldCheck,
  Store,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Layers,
  CalendarDays,
} from "lucide-react";
import UserAvatar from "../../components/UserAvatar";
import RoleBadge from "../../partial/user/RoleBadge";
import StatusBadge from "../../layout/StatusBadge";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import { formatDate } from "../../utils/dateFormatter";

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, valueClass = "text-slate-800" }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5 shrink-0">
        <Icon size={13} className="text-slate-400" />
        <p className="text-xs font-semibold text-slate-500">{label}</p>
      </div>
      <p
        className={`text-xs font-bold text-right truncate max-w-[200px] ${valueClass}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const MyProfilePage = () => {
  const { meData: d } = useSelector((s) => s.auth);

  const roles = d?.roles ?? [];
  const outlets = d?.outlets ?? [];
  const primaryRole = roles[0];

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" showBackButton />

      <div className="space-y-4">
        {/* ── Hero card ── */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          {/* <div className="h-1.5 bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400" /> */}

          <div className="p-6">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <UserAvatar
                name={d?.name}
                size="xl"
                verified={d?.isVerified === 1 ? true : false}
              />

              {/* Name block */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 leading-tight">
                      {d?.name ?? "—"}
                    </h1>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {d?.email ?? "—"}
                    </p>
                  </div>

                  {/* Active badge */}
                  <StatusBadge value={d?.isActive} />
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {/* Employee code */}
                  {d?.employeeCode && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-600">
                      <Hash size={9} /> {d.employeeCode}
                    </span>
                  )}

                  {/* Role */}
                  {primaryRole && <RoleBadge role={primaryRole.name} />}
                </div>
              </div>
            </div>

            {/* Last login */}
            {d?.lastLoginAt && (
              <div className="flex items-center gap-2 mt-5 pt-5 border-t border-slate-100">
                <Clock size={12} className="text-slate-400" />
                <p className="text-[11px] text-slate-400 font-medium">
                  Last login:{" "}
                  <span className="text-slate-600 font-bold">
                    {formatDate(d.lastLoginAt, "longTime")}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Contact & Account ── */}
        <MetricPanel title="Account Details" icon={User}>
          <InfoRow icon={Mail} label="Email" value={d?.email} />
          <InfoRow icon={Phone} label="Phone" value={d?.phone} />
          <InfoRow icon={Hash} label="Employee Code" value={d?.employeeCode} />
          <InfoRow
            icon={CheckCircle2}
            label="Account Status"
            value={d?.isActive ? "Active" : "Inactive"}
            valueClass={d?.isActive ? "text-emerald-600" : "text-slate-500"}
          />
          <InfoRow
            icon={BadgeCheck}
            label="Verification"
            value={d?.isVerified ? "Verified" : "Not verified"}
            valueClass={d?.isVerified ? "text-blue-600" : "text-amber-600"}
          />
          <InfoRow
            icon={CalendarDays}
            label="Last Login"
            value={formatDate(d?.lastLoginAt, "longTime")}
          />
        </MetricPanel>

        {/* ── Roles ── */}
        {roles.length > 0 && (
          <MetricPanel title="Roles & Access" icon={ShieldCheck}>
            <div className="py-3 space-y-2">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={13} className="text-violet-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {role.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {role.slug}
                      </p>
                    </div>
                  </div>
                  {role.outletName ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Store size={9} />
                      {role.outletName}
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-violet-500 bg-violet-50 border border-violet-100 px-2 py-1 rounded-full">
                      Global
                    </span>
                  )}
                </div>
              ))}
            </div>
          </MetricPanel>
        )}

        {/* ── All outlets ── */}
        {outlets.length > 0 && (
          <MetricPanel
            title={"Assigned Outlets"}
            icon={Layers}
            right={
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {outlets.length}
              </span>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {outlets.map((o) => (
                <div
                  key={o.id}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl border transition-colors
                    ${
                      o.id === d?.outletId
                        ? "bg-primary-500 border-primary-500"
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${o.id === d?.outletId ? "bg-white/15" : "bg-white border border-slate-200"}`}
                  >
                    <Store
                      size={11}
                      className={
                        o.id === d?.outletId ? "text-white" : "text-slate-500"
                      }
                    />
                  </div>
                  <p
                    className={`text-xs font-bold truncate flex-1 ${o.id === d?.outletId ? "text-white" : "text-slate-700"}`}
                  >
                    {o.name}
                  </p>
                  {/* {o.id === d?.outletId && (
                    <span className="text-[9px] font-black text-white/60 shrink-0">
                      CURRENT
                    </span>
                  )} */}
                </div>
              ))}
            </div>
          </MetricPanel>
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;
