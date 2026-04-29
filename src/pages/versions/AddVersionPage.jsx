import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import ToggleField from "../../components/fields/ToggleField";
import { TextareaField } from "../../components/fields/TextareaField";
import {
  Smartphone,
  Apple,
  Monitor,
  Laptop,
  Terminal,
  Loader2,
  Save,
  Plus,
  AlertCircle,
  CheckCircle2,
  Link2,
  Hash,
  GitBranch,
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  Package,
  Settings,
  Globe,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createVersion,
  updateVersion,
  fetchVersionById,
} from "../../redux/slices/versionSlice";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { handleResponse } from "../../utils/helpers";
import LoadingOverlay from "../../components/LoadingOverlay";
import InfoCard from "../../components/InfoCard";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import { ROUTE_PATHS } from "../../config/paths";

// ─── Platform Config ──────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    key: "app_store",
    label: "App Store",
    subtitle: "iOS / iPadOS",
    icon: Apple,
    color: "slate",
    urlLabel: "App Store URL",
    urlPlaceholder: "https://apps.apple.com/app/id123456789",
    minVersionLabel: "Min. iOS Version",
    minVersionPlaceholder: "e.g. 14.0",
    hasSha: false,
  },
  {
    key: "play_store",
    label: "Play Store",
    subtitle: "Android",
    icon: Smartphone,
    color: "emerald",
    urlLabel: "Play Store URL",
    urlPlaceholder: "https://play.google.com/store/apps/details?id=com.yourapp",
    minVersionLabel: "Min. Android Version",
    minVersionPlaceholder: "e.g. 8.0 (Oreo)",
    hasSha: false,
  },
  {
    key: "exe",
    label: "Windows",
    subtitle: ".exe Installer",
    icon: Monitor,
    color: "blue",
    urlLabel: "Installer Download URL",
    urlPlaceholder: "https://cdn.example.com/releases/setup-2.0.5.exe",
    minVersionLabel: "Min. Windows Version",
    minVersionPlaceholder: "e.g. Windows 10",
    hasSha: true,
  },
  {
    key: "mac_os",
    label: "macOS",
    subtitle: ".dmg Package",
    icon: Laptop,
    color: "violet",
    urlLabel: "DMG Download URL",
    urlPlaceholder: "https://cdn.example.com/releases/app-2.0.5.dmg",
    minVersionLabel: "Min. macOS Version",
    minVersionPlaceholder: "e.g. macOS 12 Monterey",
    hasSha: true,
  },
  // {
  //   key: "linux",
  //   label: "Linux",
  //   subtitle: "AppImage / .deb",
  //   icon: Terminal,
  //   color: "amber",
  //   urlLabel: "AppImage / Package URL",
  //   urlPlaceholder: "https://cdn.example.com/releases/app.AppImage",
  //   minVersionLabel: "Min. Linux Version",
  //   minVersionPlaceholder: "e.g. Ubuntu 20.04+",
  //   hasSha: true,
  // },
];

const C = {
  slate: {
    pill: "bg-slate-100 text-slate-700 border-slate-300",
    icon: "bg-slate-100 text-slate-600 border-slate-200",
    active: "bg-slate-700",
    headerEnabled: "bg-slate-50",
  },
  emerald: {
    pill: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: "bg-emerald-50 text-emerald-700 border-emerald-200",
    active: "bg-emerald-600",
    headerEnabled: "bg-emerald-50",
  },
  blue: {
    pill: "bg-blue-100 text-blue-700 border-blue-300",
    icon: "bg-blue-50 text-blue-700 border-blue-200",
    active: "bg-blue-600",
    headerEnabled: "bg-blue-50",
  },
  violet: {
    pill: "bg-violet-100 text-violet-700 border-violet-300",
    icon: "bg-violet-50 text-violet-700 border-violet-200",
    active: "bg-violet-600",
    headerEnabled: "bg-violet-50",
  },
  amber: {
    pill: "bg-amber-100 text-amber-700 border-amber-300",
    icon: "bg-amber-50 text-amber-700 border-amber-200",
    active: "bg-amber-600",
    headerEnabled: "bg-amber-50",
  },
};

const SEMVER = /^\d+\.\d+\.\d+$/;

const CHANNEL_OPTIONS = [
  { value: "stable", label: "Stable — Production ready" },
  { value: "beta", label: "Beta — Feature preview" },
  { value: "alpha", label: "Alpha — Early testing" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const platformDefault = () => ({
  enabled: false,
  version: "",
  build: "",
  download_url: "",
  min_version: "",
  sha256_hash: "",
  force_update: false,
  release_notes: "",
});

const pf = (key, sub) => `platforms.${key}.${sub}`;

// ─── Validation ───────────────────────────────────────────────────────────────
const enabledPlatformSchema = Yup.object({
  enabled: Yup.boolean(),
  version: Yup.string().when("enabled", {
    is: true,
    then: (s) =>
      s
        .matches(SEMVER, "Must be semantic version — e.g. 2.1.0")
        .required("Version is required"),
    otherwise: (s) => s.nullable(),
  }),
  build: Yup.string().when("enabled", {
    is: true,
    then: (s) => s.required("Build number is required"),
    otherwise: (s) => s.nullable(),
  }),
  download_url: Yup.string().when("enabled", {
    is: true,
    then: (s) =>
      s
        .url("Must be a valid URL — include https://")
        .required("Download URL is required"),
    otherwise: (s) => s.nullable(),
  }),
  min_version: Yup.string().nullable(),
  sha256_hash: Yup.string().nullable(),
  force_update: Yup.boolean(),
  release_notes: Yup.string().nullable(),
});

const validationSchema = Yup.object({
  channel: Yup.string().required("Release channel is required"),
  is_active: Yup.boolean(),
  release_notes: Yup.string().nullable(),
  platforms: Yup.object(
    Object.fromEntries(PLATFORMS.map((p) => [p.key, enabledPlatformSchema])),
  ).test(
    "at-least-one",
    "Enable at least one platform to publish this release",
    (val) => val && Object.values(val).some((p) => p?.enabled),
  ),
});

// ─── Platform Summary Strip ───────────────────────────────────────────────────
const PlatformSummaryStrip = ({ values }) => {
  const enabled = PLATFORMS.filter((p) => values.platforms[p.key]?.enabled);
  if (!enabled.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {enabled.map((p) => {
        const Icon = p.icon;
        const c = C[p.color];
        const ver = values.platforms[p.key]?.version;
        return (
          <span
            key={p.key}
            className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-md border ${c.pill}`}
          >
            <Icon size={11} />
            {p.label}
            {ver && SEMVER.test(ver) && (
              <span className="opacity-60">v{ver}</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

// ─── Platform Card ────────────────────────────────────────────────────────────
const PlatformCard = ({ platform, formik }) => {
  const [open, setOpen] = useState(false);
  const { key, label, subtitle, icon: Icon, color } = platform;
  const c = C[color];

  const pVal = formik.values.platforms[key] || {};
  const pErr = formik.errors?.platforms?.[key] || {};
  const pTouched = formik.touched?.platforms?.[key] || {};
  const enabled = pVal.enabled;

  const errCount = enabled
    ? ["version", "build", "download_url"].filter((k) => pErr[k] && pTouched[k])
        .length
    : 0;

  const hasValidVersion = pVal.version && SEMVER.test(pVal.version);
  const hasAllRequired = hasValidVersion && pVal.build && pVal.download_url;

  const handleEnableToggle = () => {
    const next = !enabled;
    formik.setFieldValue(`platforms.${key}.enabled`, next);
    if (next) setOpen(true);
    else setOpen(false);
  };

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
        enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-white"
      }`}
    >
      {/* Header Row */}
      <div
        className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${enabled ? "cursor-pointer" : ""}`}
        onClick={() => enabled && setOpen((o) => !o)}
      >
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-all ${
            enabled ? c.icon : "bg-gray-100 text-gray-400 border-gray-200"
          }`}
        >
          <Icon size={17} />
        </div>

        {/* Label + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-black ${enabled ? "text-gray-900" : "text-gray-400"}`}
            >
              {label}
            </span>
            <span
              className={`text-[10px] font-medium ${enabled ? "text-gray-400" : "text-gray-300"}`}
            >
              {subtitle}
            </span>
            {enabled && hasAllRequired && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.pill}`}
              >
                v{pVal.version} ({pVal.build})
              </span>
            )}
            {enabled && !hasAllRequired && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                Needs setup
              </span>
            )}
            {errCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                <AlertCircle size={9} /> {errCount} error
                {errCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Toggle + chevron */}
        <div
          className="flex items-center gap-2.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ToggleField
            label=""
            description=""
            checked={enabled}
            onChange={handleEnableToggle}
            activeColorClass={c.active}
            className="!p-0 !border-0 !bg-transparent !hover:bg-transparent !m-0 w-auto min-w-0"
          />
          {enabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {open ? (
                <ChevronUp size={15} className="text-gray-400" />
              ) : (
                <ChevronDown size={15} className="text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Fields */}
      {enabled && open && (
        <div className="border-t border-gray-100">
          <div className="p-5 space-y-6">
            {/* Version Details */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <Package size={10} /> Version Details
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <InputField
                  label="Version"
                  name={pf(key, "version")}
                  required
                  placeholder="e.g. 2.1.0"
                  value={pVal.version}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={pTouched.version && pErr.version}
                  icon={GitBranch}
                  iconPosition="left"
                />
                <InputField
                  label="Build Number"
                  name={pf(key, "build")}
                  required
                  placeholder="e.g. 210"
                  value={pVal.build}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={pTouched.build && pErr.build}
                  icon={Hash}
                  iconPosition="left"
                />
                <InputField
                  label={platform.minVersionLabel}
                  name={pf(key, "min_version")}
                  placeholder={platform.minVersionPlaceholder}
                  value={pVal.min_version}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  icon={Zap}
                  iconPosition="left"
                />
              </div>
            </div>

            {/* Distribution */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <Globe size={10} /> Distribution
              </p>
              <div className="space-y-4">
                <InputField
                  label={platform.urlLabel}
                  name={pf(key, "download_url")}
                  required
                  placeholder={platform.urlPlaceholder}
                  value={pVal.download_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={pTouched.download_url && pErr.download_url}
                  icon={Link2}
                  iconPosition="left"
                />
                {platform.hasSha && (
                  <InputField
                    label="SHA256 Checksum"
                    name={pf(key, "sha256_hash")}
                    placeholder="64-character SHA256 hash of the installer file"
                    value={pVal.sha256_hash}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    icon={Shield}
                    iconPosition="left"
                  />
                )}
              </div>
            </div>

            {/* Platform Options */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <Settings size={10} /> Platform Options
              </p>
              <div className="space-y-3">
                <ToggleField
                  label="Force Update"
                  description={`${label} users must update before continuing to use the app.`}
                  checked={pVal.force_update}
                  onChange={(val) =>
                    formik.setFieldValue(pf(key, "force_update"), val)
                  }
                  activeColorClass="bg-red-500"
                />
                <TextareaField
                  label="Platform-specific Notes"
                  name={pf(key, "release_notes")}
                  rows={3}
                  placeholder={`e.g. Critical security patch for ${label}...`}
                  value={pVal.release_notes}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const AddVersionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { versionId } = useQueryParams();

  useEffect(() => {
    if (versionId) dispatch(fetchVersionById(versionId));
  }, [versionId, dispatch]);

  const {
    versionDetails,
    isFetchingVersionDetails,
    isCreatingVersion,
    isUpdatingVersion,
  } = useSelector((s) => s.version);

  const isSubmitting = isCreatingVersion || isUpdatingVersion;

  const initialValues = useMemo(() => {
    const buildPlatforms = () => {
      const result = {};
      PLATFORMS.forEach((p) => {
        const ex = versionDetails?.platforms?.[p.key];
        result[p.key] = ex
          ? {
              enabled: true,
              version: ex.version || "",
              build: String(ex.build || ""),
              download_url: ex.download_url || "",
              min_version: ex.min_version || "",
              sha256_hash: ex.sha256_hash || "",
              force_update: Boolean(ex.force_update),
              release_notes: ex.release_notes || "",
            }
          : platformDefault();
      });
      return result;
    };

    return {
      channel: versionDetails?.channel || "stable",
      is_active: versionDetails ? Boolean(versionDetails.is_active) : true,
      release_notes: versionDetails?.release_notes || "",
      platforms: buildPlatforms(),
    };
  }, [versionId, versionDetails]);

  const handleSubmit = async (values) => {
    const platforms = {};
    PLATFORMS.forEach((p) => {
      const pv = values.platforms[p.key];
      if (pv.enabled) {
        platforms[p.key] = {
          version: pv.version,
          build: pv.build,
          download_url: pv.download_url,
          ...(pv.min_version && { min_version: pv.min_version }),
          ...(pv.sha256_hash && { sha256_hash: pv.sha256_hash }),
          force_update: Boolean(pv.force_update),
          ...(pv.release_notes && { release_notes: pv.release_notes }),
        };
      }
    });

    const payload = {
      channel: values.channel,
      is_active: Boolean(values.is_active),
      ...(values.release_notes && { release_notes: values.release_notes }),
      platforms,
    };

    const action = versionId
      ? updateVersion({ id: versionId, values: payload })
      : createVersion(payload);

    await handleResponse(dispatch(action), () =>
      navigate(ROUTE_PATHS.ALL_VERSIONS),
    );
  };

  if (isFetchingVersionDetails && versionId) return <LoadingOverlay />;

  return (
    <div className="space-y-5">
      <PageHeader
        title={versionId ? "Update Version" : "Create Version"}
        showBackButton
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnBlur
        validateOnChange
      >
        {(formik) => {
          const enabledCount = PLATFORMS.filter(
            (p) => formik.values.platforms[p.key]?.enabled,
          ).length;
          const platformRootErr =
            typeof formik.errors.platforms === "string"
              ? formik.errors.platforms
              : null;

          // Collect all visible errors for summary
          const allErrs = [];
          if (formik.errors.channel && formik.touched.channel)
            allErrs.push(formik.errors.channel);
          if (platformRootErr && formik.submitCount > 0)
            allErrs.push(platformRootErr);
          PLATFORMS.forEach((p) => {
            const pe = formik.errors?.platforms?.[p.key];
            const pt = formik.touched?.platforms?.[p.key];
            if (pe && pt && typeof pe === "object") {
              ["version", "build", "download_url"].forEach((field) => {
                if (pe[field] && pt[field])
                  allErrs.push(`${p.label} — ${pe[field]}`);
              });
            }
          });

          return (
            <Form className="space-y-4" autoComplete="off">
              {/* ── Section 1: Release Settings ── */}
              <MetricPanel
                icon={Settings}
                title={"Release Settings"}
                desc={
                  "Configure the channel and global options for this release"
                }
              >
                <div className="space-y-5">
                  {/* Channel + visual */}
                  <SelectField
                    label="Release Channel"
                    name="channel"
                    required
                    options={CHANNEL_OPTIONS}
                    value={formik.values.channel}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.channel && formik.errors.channel}
                  />

                  {/* Active toggle */}
                  <ToggleField
                    label="Set as Active Version"
                    description={
                      formik.values.is_active
                        ? "This version is live and visible to end users."
                        : "This version is saved but not yet shown to users."
                    }
                    checked={formik.values.is_active}
                    onChange={(val) => formik.setFieldValue("is_active", val)}
                    activeColorClass="bg-emerald-600"
                  />

                  {/* Global release notes */}
                  <TextareaField
                    label="Global Release Notes"
                    name="release_notes"
                    rows={4}
                    placeholder={`### What's New\n- Improved dashboard performance\n- Bug fixes across all platforms`}
                    value={formik.values.release_notes}
                    onChange={formik.handleChange}
                    helperText="Markdown supported. These notes apply across all platforms unless overridden per platform."
                  />
                </div>
              </MetricPanel>

              {/* Info hint */}
              <InfoCard
                title={"Manage App Releases"}
                description={
                  "Enable a platform to configure its release details. Add version, build number, download link, and optionally set force update and release notes for each platform."
                }
                size="sm"
              />

              {/* Platform-level root error */}
              {formik.submitCount > 0 && platformRootErr && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={13} className="text-red-500 shrink-0" />
                  <p className="text-xs font-bold text-red-700">
                    {platformRootErr}
                  </p>
                </div>
              )}

              {/* Platform Cards */}
              {PLATFORMS.map((platform) => (
                <PlatformCard
                  key={platform.key}
                  platform={platform}
                  formik={formik}
                />
              ))}
              {/* </SectionCard> */}

              {/* ── Error Summary ── */}
              {formik.submitCount > 0 &&
                !formik.isValid &&
                allErrs.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-2 mb-2.5">
                      <AlertCircle
                        size={15}
                        className="text-red-500 shrink-0"
                      />
                      <p className="text-sm font-black text-red-700">
                        Fix these issues before saving
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {allErrs.map((e, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-red-600"
                        >
                          <span className="mt-0.5 shrink-0">•</span> {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="min-w-0 flex-1">
                {enabledCount === 0 ? (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Info size={12} /> Enable at least one platform to publish
                    this release.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-gray-400">Publishing to:</p>
                    <PlatformSummaryStrip values={formik.values} />
                  </div>
                )}
              </div>
              {/* ── Submit Bar ── */}
              {/* SUBMIT */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingVersion || isUpdatingVersion}
                  className="btn bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />{" "}
                      {versionId ? "Updating..." : "Creating..."}
                    </>
                  ) : versionId ? (
                    <>
                      <Save size={15} /> Update Version
                    </>
                  ) : (
                    <>
                      <Plus size={15} /> Create Version
                    </>
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddVersionPage;
