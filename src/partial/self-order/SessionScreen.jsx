import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleResponse } from "../../utils/helpers";
import {
  startSelfOrderSession,
  updateSelfOrderCustomerInfo,
} from "../../redux/slices/publicMenuSlice";
import { AlertCircle, ArrowRight, Phone, User, Utensils } from "lucide-react";

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

    // Step 1: start session → get token
    const values = {
      outletId,
      tableId,
      qrToken,
    };

    await handleResponse(dispatch(startSelfOrderSession({ values })), (res) => {
      const token = res.payload.data.token;
      // Step 2: save customer info
      const values = {
        token,
        customerName: name.trim(),
        customerPhone: phone,
      };

      dispatch(
        updateSelfOrderCustomerInfo({
          values,
        }),
      );
      onSuccess(res.payload.data);
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-5 py-10">
      {/* Brand mark */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_32px_rgba(232,76,30,0.4)]">
          <Utensils size={28} className="text-white" />
        </div>
        <p className="text-white/40 text-sm font-medium tracking-wider uppercase">
          Scan & Order
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[#1A1A1A] rounded-3xl p-6 border border-white/[0.06] shadow-2xl">
        <h1 className="text-white text-2xl font-bold mb-1 tracking-tight">
          Welcome! 👋
        </h1>
        <p className="text-white/40 text-sm mb-6">
          Enter your details to start ordering
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
            Your Name
          </label>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
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
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-primary-500/60 transition-colors"
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
            Mobile Number
          </label>
          <div className="relative">
            <Phone
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                setErrors((p) => ({ ...p, phone: "" }));
              }}
              placeholder="10-digit mobile"
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-primary-500/60 transition-colors"
            />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.phone}
            </p>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-primary-500 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(232,76,30,0.35)] hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Start Ordering <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      <p className="text-white/20 text-xs mt-6 text-center">
        Your details are only used for this order
      </p>
    </div>
  );
}

export default SessionScreen;
