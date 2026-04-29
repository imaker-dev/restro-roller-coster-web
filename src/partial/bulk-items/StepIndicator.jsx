import {
  Check,
  CloudUpload,
  Eye,
  FileDown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, key: "template", label: "Template", icon: FileDown },
  { id: 2, key: "upload", label: "Upload", icon: CloudUpload },
  { id: 3, key: "validate", label: "Validate", icon: ShieldCheck },
  { id: 4, key: "preview", label: "Preview", icon: Eye },
  { id: 5, key: "done", label: "Done", icon: Sparkles },
];

const ICON_SIZE = 40;

export default function StepIndicator({
  currentStep,
  maxReached,
  onStepClick,
}) {
  // Progress: 0 at step 1, 100 at step N
  const progressPct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full mb-8">
      {/* The half-icon offset trick: padding = half icon width so lines start/end at icon centers */}
      <div
        className="relative flex items-start justify-between"
        style={{ paddingLeft: ICON_SIZE / 2, paddingRight: ICON_SIZE / 2 }}
      >
        {/* ── Grey track ── */}
        <div
          className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0"
          style={{ left: ICON_SIZE / 2, right: ICON_SIZE / 2 }}
        />

        {/* ── Teal progress fill ── */}
        <div
          className="absolute top-5 h-0.5 z-0 transition-all duration-500 ease-in-out"
          style={{
            left: ICON_SIZE / 2,
            right: ICON_SIZE / 2,
            // width as % of the track (not the full container)
            width: `${progressPct}%`,
            background: "linear-gradient(90deg, #10b981, #14b8a6)",
          }}
        />

        {/* ── Steps ── */}
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;
          const isReachable = step.id <= maxReached;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2"
              // Each step takes equal width; icon is centred inside
              style={{ width: ICON_SIZE }}
            >
              <button
                onClick={() => isReachable && onStepClick(step.id)}
                disabled={!isReachable}
                style={{ width: ICON_SIZE, height: ICON_SIZE }}
                className={`
                  flex items-center justify-center rounded-xl
                  transition-all duration-300 focus:outline-none
                  ${isReachable ? "cursor-pointer" : "cursor-not-allowed"}
                  ${
                    isDone
                      ? "bg-emerald-500 text-white "
                      : isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 "
                        : isReachable
                          ? "bg-white border-2 border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-500"
                          : "bg-white border-2 border-slate-100 text-slate-300"
                  }
                `}
              >
                {isDone ? (
                  <Check size={17} strokeWidth={2.5} />
                ) : (
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.8} />
                )}
              </button>

              <span
                className={`
                text-[11px] font-bold whitespace-nowrap transition-colors duration-200
                ${
                  isActive
                    ? "text-emerald-600"
                    : isDone
                      ? "text-emerald-500"
                      : isReachable
                        ? "text-slate-500"
                        : "text-slate-300"
                }
              `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
