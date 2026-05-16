import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleResponse } from "../../utils/helpers";
import {
  startSelfOrderSession,
  updateSelfOrderCustomerInfo,
} from "../../redux/slices/publicMenuSlice";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  User,
  QrCode,
  Utensils,
  Clock,
  ShieldCheck,
} from "lucide-react";

// ─── Desktop feature row ──────────────────────────────────────────────────────

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/[0.10] backdrop-blur-md flex items-center justify-center shrink-0">
        <Icon size={15} className="text-white/70" />
      </div>
      <div>
        <p className="text-white text-[13px] font-bold leading-none mb-1">
          {title}
        </p>
        <p className="text-white/40 text-xs font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-white/35 text-[10px] font-black uppercase tracking-[0.13em] mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

function SessionScreen({
  outletId,
  tableId,
  qrToken,
  onSuccess,
  loading = false,
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!/^\d{10}$/.test(phone)) e.phone = "Enter a valid 10-digit number";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleStart = async () => {
    if (!validate()) return;
    await handleResponse(
      dispatch(
        startSelfOrderSession({ values: { outletId, tableId, qrToken } }),
      ),
      (res) => {
        const token = res.payload.data.token;
        dispatch(
          updateSelfOrderCustomerInfo({
            values: { token, customerName: name.trim(), customerPhone: phone },
          }),
        );
        onSuccess(res.payload.data);
      },
    );
  };

  const inputBase =
    "w-full bg-white/[0.06] border rounded-2xl text-white text-sm placeholder-white/20 outline-none transition-all duration-200 py-3.5";
  const inputNormal =
    "border-white/[0.09] focus:border-primary-500/50 focus:bg-white/[0.08]";
  const inputErr = "border-red-500/50";

  return (
    <div
      className="min-h-[100dvh] flex flex-col lg:flex-row"
      style={{ background: "#0D0D0D" }}
    >
      {/* ═══════════════════════════════════════════
          HERO — mobile: top strip | desktop: left half
      ═══════════════════════════════════════════ */}
      <div
        className="bg-primary-500 relative overflow-hidden
                   lg:w-[52%] lg:min-h-screen lg:flex lg:flex-col lg:justify-center"
      >
        <div className="absolute inset-0 bg-black/[0.08]" />
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-primary-200/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary-400/15 blur-3xl pointer-events-none" />

        {/* ── MOBILE layout ── compact, tight, centred */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 pt-10 pb-16 lg:hidden">
          {/* Logo */}
          <img
            src="/Images/Logo.svg"
            alt="iMaker Restro"
            className="h-9 object-contain mb-5"
          />
          {/* Tagline */}
          <h2 className="text-white text-[20px] font-black tracking-tight leading-snug mb-1.5">
            Scan. Browse. Order.
          </h2>
          <p className="text-white/70 text-[13px] font-medium">
            Great food, straight from your table.
          </p>
        </div>

        {/* ── DESKTOP layout ── */}
        <div className="hidden lg:flex flex-col px-16 relative z-10">
          <img
            src="/Images/Logo.svg"
            alt="iMaker Restro"
            className="h-11 object-contain mb-12 self-start"
          />
          <h2 className="text-white text-[32px] font-black leading-tight tracking-tight mb-3">
            Scan. Browse.
            <br />
            Order. Enjoy.
          </h2>
          <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-10">
            No waiting. Just great food,
            <br />
            straight from your table.
          </p>
          <div className="flex flex-col gap-4">
            <Feature
              icon={QrCode}
              title="Instant Menu Access"
              desc="Scan once and browse the full menu from your phone."
            />
            <Feature
              icon={Utensils}
              title="Order at Your Pace"
              desc="Customise and place your order with zero rush."
            />
            <Feature
              icon={Clock}
              title="Live Order Tracking"
              desc="Know exactly when your food is being prepared."
            />
            <Feature
              icon={ShieldCheck}
              title="Secure & Private"
              desc="Your info is only used for this session."
            />
          </div>
        </div>
        {/* ── Mobile aligned smooth waves ── */}
        <div
          className="lg:hidden absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ lineHeight: 0 }}
        >
          <svg
            viewBox="0 0 390 44"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", marginBottom: "-2px" }}
          >
            <path
              d="
        M0 44
        L0 22

        C32 8 65 8 97 22
        C129 36 162 36 195 22
        C227 8 260 8 292 22
        C324 36 357 36 390 22

        L390 44
        Z
      "
              fill="#0D0D0D"
            />
          </svg>
        </div>

        {/* ── Desktop right-edge curve ── */}
        <div
          className="hidden lg:block absolute top-0 right-0 h-full pointer-events-none"
          style={{ width: 72, lineHeight: 0 }}
        >
          <svg
            viewBox="0 0 72 900"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <path
              d="M72 0 L72 900 L0 900 Q40 675 40 450 Q40 225 0 0 Z"
              fill="#0D0D0D"
            />
          </svg>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FORM — mobile: flush below hero | desktop: right half
      ═══════════════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col items-center justify-center
                   px-6 pt-7 pb-10 lg:py-0"
        style={{ background: "#0D0D0D" }}
      >
        <div className="w-full max-w-[340px]">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-white text-[24px] font-black tracking-tight leading-none mb-1.5">
              Welcome! 👋
            </h1>
            <p className="text-white/35 text-sm font-medium">
              Enter your details to start ordering
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4 mb-6">
            <Field label="Your Name" error={errors.name}>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="e.g. Rahul Sharma"
                  maxLength={40}
                  className={`${inputBase} pl-11 pr-4 ${errors.name ? inputErr : inputNormal}`}
                />
              </div>
            </Field>

            <Field label="Mobile Number" error={errors.phone}>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <span className="text-white/45 text-sm font-bold">+91</span>
                  <span className="w-px h-4 bg-white/15 block" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setErrors((p) => ({ ...p, phone: "" }));
                  }}
                  placeholder="10-digit mobile"
                  className={`${inputBase} pl-[72px] pr-4 ${errors.phone ? inputErr : inputNormal}`}
                />
              </div>
            </Field>
          </div>

          {/* CTA — teal, matching the hero */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl
            bg-white hover:bg-white/95
            text-primary-700 text-[14px] font-black
            transition-all duration-200 active:scale-[0.97]
            shadow-lg shadow-black/10"
            // className="w-full flex items-center justify-center gap-2.5
            //            py-3.5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white text-[14px] font-black
            //            transition-all duration-200 active:scale-[0.97]
            //            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                Start Ordering
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <p className="text-white/18 text-xs mt-5 text-center">
            Your details are only used for this session
          </p>
        </div>
      </div>
    </div>
  );
}

export default SessionScreen;
