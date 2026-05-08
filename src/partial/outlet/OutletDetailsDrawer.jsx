import React from "react";
import Drawer from "../../components/Drawer";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Hash,
  Globe,
  Calendar,
  Landmark,
  FileText,
  Layers,
  Table2,
  Receipt,
  Printer,
  BadgeCheck,
} from "lucide-react";
import StatusBadge from "../../layout/StatusBadge";
import { formatDate } from "../../utils/dateFormatter";
import CurrencyIcon from "../../components/CurrencyIcon";

const OutletDetailsDrawer = ({ isOpen, onClose, outlet }) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={outlet?.name}
      subtitle={
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 font-mono">
            {outlet?.code}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-sm text-slate-500 capitalize">
            {outlet?.outlet_type}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <StatusBadge value={outlet?.is_active} />
        </div>
      }
      width="max-w-md"
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Contact */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-700">
                    {outlet?.phone || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-700 truncate">
                    {outlet?.email || "Not provided"}
                  </span>
                </div>
                {outlet?.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 truncate">
                      {outlet?.website}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Address */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Address
              </h3>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    {outlet?.address_line1 && (
                      <p className="text-sm text-slate-700">
                        {outlet?.address_line1}
                      </p>
                    )}
                    {outlet?.address_line2 && (
                      <p className="text-sm text-slate-500">
                        {outlet?.address_line2}
                      </p>
                    )}
                    <p className="text-sm text-slate-700">
                      {[outlet?.city, outlet?.state, outlet?.postal_code]
                        .filter(Boolean)
                        .join(", ") || "Address not provided"}
                    </p>
                    <p className="text-xs text-slate-400">{outlet?.country}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Structure */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Structure
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Floors</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {outlet?.floor_count ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <Table2 className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Tables</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {outlet?.table_count ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Operating Hours
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {outlet?.is_24_hours
                      ? "24 Hours Open"
                      : outlet?.opening_time && outlet?.closing_time
                        ? `${outlet.opening_time.slice(0, 5)} - ${outlet.closing_time.slice(0, 5)}`
                        : "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* Legal */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Legal & Compliance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">GSTIN</span>
                  </div>
                  <span className="text-sm font-mono font-medium text-slate-900">
                    {outlet?.gstin || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">FSSAI</span>
                  </div>
                  <span className="text-sm font-mono font-medium text-slate-900">
                    {outlet?.fssai_number || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">PAN</span>
                  </div>
                  <span className="text-sm font-mono font-medium text-slate-900">
                    {outlet?.pan_number || "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* Settings */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <CurrencyIcon className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      Invoice Prefix
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {outlet?.invoice_prefix || "Default"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <CurrencyIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">KOT Prefix</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {outlet?.kot_prefix || "Default"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Printer className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Print Logo</span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      outlet?.print_logo_enabled
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {outlet?.print_logo_enabled ? "On" : "Off"}
                  </span>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Activity
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Created</span>
                  <span className="text-slate-700">
                    {formatDate(outlet?.created_at, "longTime")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="text-slate-700">
                    {formatDate(outlet?.updated_at, "longTime")}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default OutletDetailsDrawer;
