import React, { useEffect, useState } from "react";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchVersionById } from "../../redux/slices/versionSlice";
import {
  Package,
  Smartphone,
  Monitor,
  Globe,
  Download,
  Calendar,
  Hash,
  Layers,
  Radio,
  Zap,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  AlertTriangle,
  Apple,
  PlayCircle,
  Activity,
  Code2,
  Link2,
  Info,
  RefreshCw,
  WifiOff,
  ServerCrash,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import { formatDate } from "../../utils/dateFormatter";

// ─── constants ───────────────────────────────────────────────────────────────

const PLATFORM_META = {
  app_store: {
    label: "App Store",
    Icon: Apple,
    gradient: "from-slate-600 to-slate-900",
    soft: "bg-slate-100 text-slate-700 border-slate-200",
  },
  play_store: {
    label: "Play Store",
    Icon: PlayCircle,
    gradient: "from-emerald-500 to-teal-700",
    soft: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  exe: {
    label: "Windows EXE",
    Icon: Monitor,
    gradient: "from-blue-500 to-indigo-700",
    soft: "bg-blue-50 text-blue-700 border-blue-200",
  },
  apk: {
    label: "Android APK",
    Icon: Smartphone,
    gradient: "from-lime-500 to-green-700",
    soft: "bg-lime-50 text-lime-700 border-lime-200",
  },
  dmg: {
    label: "macOS DMG",
    Icon: Monitor,
    gradient: "from-zinc-500 to-zinc-800",
    soft: "bg-zinc-100 text-zinc-700 border-zinc-200",
  },
};
const DEFAULT_PLATFORM = {
  label: "Unknown",
  Icon: Globe,
  gradient: "from-gray-400 to-gray-600",
  soft: "bg-gray-100 text-gray-600 border-gray-200",
};

const CHANNEL_META = {
  stable: {
    label: "Stable",
    dot: "bg-emerald-500",
    pill: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  beta: {
    label: "Beta",
    dot: "bg-amber-400",
    pill: "text-amber-700 bg-amber-50 border-amber-200",
  },
  alpha: {
    label: "Alpha",
    dot: "bg-rose-500",
    pill: "text-rose-700 bg-rose-50 border-rose-200",
  },
  canary: {
    label: "Canary",
    dot: "bg-purple-500",
    pill: "text-purple-700 bg-purple-50 border-purple-200",
  },
  nightly: {
    label: "Nightly",
    dot: "bg-indigo-500",
    pill: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
};
const DEFAULT_CHANNEL = {
  label: "Unknown",
  dot: "bg-gray-400",
  pill: "text-gray-600 bg-gray-100 border-gray-200",
};

// ─── utils ───────────────────────────────────────────────────────────────────

const getPlatform = (key) => PLATFORM_META[key] ?? DEFAULT_PLATFORM;
const getChannel = (key) => CHANNEL_META[key] ?? DEFAULT_CHANNEL;

// ─── atoms ───────────────────────────────────────────────────────────────────

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      onClick={copy}
      title="Copy to clipboard"
      className="ml-1.5 p-1 rounded-md hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-all flex-shrink-0"
    >
      {copied ? (
        <CheckCircle2 size={13} className="text-emerald-500" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
};

// ─── skeleton ────────────────────────────────────────────────────────────────

const Bone = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#f5f6fa] p-6 space-y-5">
    <Bone className="h-7 w-52" />
    <Bone className="h-40 w-full rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="space-y-4">
        <Bone className="h-64 w-full rounded-2xl" />
        <Bone className="h-36 w-full rounded-2xl" />
      </div>
      <div className="lg:col-span-2 space-y-4">
        <Bone className="h-44 w-full rounded-2xl" />
        <Bone className="h-28 w-full rounded-2xl" />
        <Bone className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

// ─── error state ─────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }) => (
  <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-6">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
        <ServerCrash size={28} className="text-rose-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">
        Failed to load version
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        Something went wrong while fetching the version details. Please try
        again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  </div>
);

// ─── empty state ─────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-6">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <WifiOff size={28} className="text-gray-300" />
      </div>
      <h2 className="text-lg font-bold text-gray-700 mb-1">No version found</h2>
      <p className="text-sm text-gray-400">
        No version data is available for the requested ID.
      </p>
    </div>
  </div>
);

// ─── info row ────────────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon,
  label,
  value,
  mono = false,
  copyable = false,
  emptyText = "Not set",
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="mt-0.5 w-7 h-7 flex-shrink-0 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
      <Icon size={13} className="text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <div className="flex items-center">
        {value != null && value !== "" ? (
          <span
            className={`text-sm text-gray-800 break-all leading-snug ${mono ? "font-mono" : "font-semibold"}`}
          >
            {value}
          </span>
        ) : (
          <span className="text-sm text-gray-300 italic">{emptyText}</span>
        )}
        {copyable && value != null && value !== "" && (
          <CopyButton value={String(value)} />
        )}
      </div>
    </div>
  </div>
);

// ─── url link row ────────────────────────────────────────────────────────────

const UrlRow = ({ label, url, icon: Icon }) => {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group"
    >
      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
        <Icon size={14} className="text-indigo-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm text-indigo-600 font-medium truncate">{url}</p>
      </div>
      <ExternalLink
        size={13}
        className="text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0"
      />
    </a>
  );
};

// ─── timestamp chip ──────────────────────────────────────────────────────────

const TimestampChip = ({ label, dateStr }) => {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </p>
      {dateStr ? (
        <>
          <p className="text-sm font-bold text-gray-800">
            {formatDate(dateStr, "long")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(dateStr, "time")}
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-300 italic">Not set</p>
      )}
    </div>
  );
};

// ─── main detail view ─────────────────────────────────────────────────────────

const VersionDetail = ({ v, onRetry }) => {
  const plat = getPlatform(v.platform);
  const chan = getChannel(v.channel);

  const platformUrls = [
    { label: "Android URL", url: v.android_url, icon: Smartphone },
    { label: "iOS URL", url: v.ios_url, icon: Apple },
    { label: "Windows URL", url: v.windows_url, icon: Monitor },
    { label: "macOS URL", url: v.mac_url, icon: Monitor },
    { label: "Linux URL", url: v.linux_url, icon: Globe },
  ].filter((u) => !!u.url);

  const hasDownloads = v.download_url || platformUrls.length > 0;

  return (
    <div className="space-y-5">
      <PageHeader onlyBack backLabel="Back to Versions" />
      {/* ── hero banner ── */}
      <div
        className={`rounded-2xl bg-primary-500 p-6 text-white shadow-lg relative overflow-hidden`}
      >
        <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/20 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
              <h1 className="text-3xl font-black tracking-tight leading-none">
                v{v.version}
              </h1>
              <span className="text-white/50 hidden sm:block">·</span>
              <span className="text-base font-semibold text-white/75">
                Build #{v.build}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${plat.soft}`}
              >
                {plat.label}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${chan.pill}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${chan.dot}`} />
                {chan.label}
              </span>
              {v.force_update && (
                <span className="text-xs font-bold bg-rose-500 border border-rose-400 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap size={10} /> Force Update
                </span>
              )}
              {v.is_active ? (
                <span className="text-xs font-bold bg-white/20 text-white border border-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> Active
                </span>
              ) : (
                <span className="text-xs font-bold bg-black/20 text-white/60 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <XCircle size={10} /> Inactive
                </span>
              )}
            </div>

            {v.release_date && (
              <p className="mt-3 text-sm text-white/60 flex items-center gap-1.5">
                <Calendar size={12} />
                Released {formatDate(v.release_date, "long")} at{" "}
                {formatDate(v.release_date, "time")}
              </p>
            )}
          </div>

          <div className="hidden sm:block text-right flex-shrink-0 select-none">
            <p className="text-6xl font-black text-white/60 tabular-nums leading-none">
              #{v.id}
            </p>
          </div>
        </div>
      </div>

      {/* ── body grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT */}
        <div className="space-y-5">
          <MetricPanel title="Core Information" icon={Info}>
            <InfoRow
              icon={Hash}
              label="Version ID"
              value={v.id}
              mono
              copyable
            />
            <InfoRow
              icon={Package}
              label="Version"
              value={v.version}
              mono
              copyable
            />
            <InfoRow icon={Layers} label="Build" value={v.build} mono />
            <InfoRow icon={Globe} label="Platform" value={plat.label} />
            <InfoRow icon={Radio} label="Channel" value={chan.label} />
            <InfoRow
              icon={Code2}
              label="Min Version"
              value={v.min_version}
              mono
              copyable
              emptyText="No minimum set"
            />
          </MetricPanel>

          <MetricPanel title="Status & Flags" icon={Activity}>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`rounded-xl p-4 flex flex-col items-center gap-2 border ${v.is_active ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`}
              >
                {v.is_active ? (
                  <CheckCircle2 size={22} className="text-emerald-500" />
                ) : (
                  <XCircle size={22} className="text-gray-300" />
                )}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Active
                </p>
                <p
                  className={`text-xs font-bold ${v.is_active ? "text-emerald-600" : "text-gray-400"}`}
                >
                  {v.is_active ? "Yes" : "No"}
                </p>
              </div>
              <div
                className={`rounded-xl p-4 flex flex-col items-center gap-2 border ${v.force_update ? "bg-rose-50 border-rose-100" : "bg-gray-50 border-gray-100"}`}
              >
                {v.force_update ? (
                  <AlertTriangle size={22} className="text-rose-500" />
                ) : (
                  <Shield size={22} className="text-gray-300" />
                )}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Force Update
                </p>
                <p
                  className={`text-xs font-bold ${v.force_update ? "text-rose-600" : "text-gray-400"}`}
                >
                  {v.force_update ? "Required" : "Optional"}
                </p>
              </div>
            </div>
          </MetricPanel>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-5">
          <MetricPanel title="Release Notes" icon={Info}>
            {v.release_notes ? (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {v.release_notes}
              </p>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <Info size={18} className="text-gray-200" />
                </div>
                <p className="text-sm text-gray-300 italic">
                  No release notes for this version.
                </p>
              </div>
            )}
          </MetricPanel>

          <MetricPanel title="Download URLs" icon={Download}>
            {hasDownloads ? (
              <div className="space-y-2.5">
                <UrlRow
                  label="Primary Download URL"
                  url={v.download_url}
                  icon={Link2}
                />
                {platformUrls.map((u) => (
                  <UrlRow
                    key={u.label}
                    label={u.label}
                    url={u.url}
                    icon={u.icon}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <Download size={18} className="text-gray-200" />
                </div>
                <p className="text-sm text-gray-300 italic">
                  No download URLs configured.
                </p>
              </div>
            )}
          </MetricPanel>

          {/* Security — only rendered when sha256 is present */}
          {v.sha256 && (
            <MetricPanel title="Security" icon={Shield}>
              <InfoRow
                icon={Shield}
                label="SHA-256 Checksum"
                value={v.sha256}
                mono
                copyable
                emptyText="No checksum"
              />
            </MetricPanel>
          )}

          <MetricPanel title="Timestamps" icon={Clock}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <TimestampChip label="Release Date" dateStr={v.release_date} />
              <TimestampChip label="Created At" dateStr={v.created_at} />
              <TimestampChip label="Last Updated" dateStr={v.updated_at} />
            </div>
          </MetricPanel>
        </div>
      </div>
    </div>
  );
};

// ─── page root ────────────────────────────────────────────────────────────────

const VersionDetailsPage = () => {
  const dispatch = useDispatch();
  const { versionId } = useQueryParams();

  const { isFetchingVersionDetails, versionDetails, error } = useSelector(
    (state) => state.version,
  );

  const load = () => {
    if (versionId) dispatch(fetchVersionById(versionId));
  };

  useEffect(() => {
    load();
  }, [versionId]);

  if (isFetchingVersionDetails) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={load} />;
  if (!versionDetails) return <EmptyState />;

  return <VersionDetail v={versionDetails} onRetry={load} />;
};

export default VersionDetailsPage;
