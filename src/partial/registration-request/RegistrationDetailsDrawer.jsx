import React from "react";
import Drawer from "../../components/Drawer";
import {
  Building2,
  Calendar,
  FileText,
  Globe,
  Info,
  Landmark,
  Mail,
  MapPin,
  Phone,
  User,
  Clock,
  Hash,
} from "lucide-react";
import PlanBadge from "./PlanBadge";
import RegistrationStatusBadge from "./RegistrationStatusBadge";
import { formatDate } from "../../utils/dateFormatter";

const InfoRow = ({ icon: Icon, label, value, monospace = false }) => (
  <div className="flex items-start gap-3 group">
    <div className="p-1.5 bg-white rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
      <Icon className="h-3.5 w-3.5 text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p
        className={`text-sm ${
          value
            ? monospace
              ? "font-mono text-slate-900"
              : "text-slate-900"
            : "text-slate-400 italic"
        }`}
      >
        {value || "Not provided"}
      </p>
      <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-px flex-1 bg-slate-200"></div>
    <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-2">
      {title}
    </h3>
    <div className="h-px flex-1 bg-slate-200"></div>
  </div>
);

const RegistrationDetailsDrawer = ({ isOpen, onClose, outlet }) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Registration Details"
      subtitle={outlet ? `${outlet.restaurant_name} · ${outlet.city}` : ""}
      width="max-w-md"
    >
      {outlet && (
        <div className="p-6 space-y-8">
          {/* Status Banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </p>
              <RegistrationStatusBadge status={outlet.status} />
            </div>
          </div>

          {/* Restaurant Information */}
          <div>
            <SectionHeader title="Restaurant Information" />
            <div className="space-y-4">
              <InfoRow
                icon={Building2}
                label="Restaurant Name"
                value={outlet.restaurant_name}
              />
              <InfoRow
                icon={User}
                label="Contact Person"
                value={outlet.contact_person}
              />
              <InfoRow icon={Mail} label="Email Address" value={outlet.email} />
              <InfoRow icon={Phone} label="Phone Number" value={outlet.phone} />
            </div>
          </div>

          {/* Location */}
          <div>
            <SectionHeader title="Location" />
            <div className="space-y-4">
              <InfoRow icon={MapPin} label="City" value={outlet.city} />
              <InfoRow icon={MapPin} label="State" value={outlet.state} />
            </div>
          </div>

          {/* Plan Details */}
          <div>
            <SectionHeader title="Plan Details" />
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <PlanBadge plan={outlet.plan_interest} />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Subscription Plan
                  </p>
                </div>
              </div>

              <InfoRow
                icon={Info}
                label="Message / Requirements"
                value={outlet.message}
              />
            </div>
          </div>

          {/* Legal Documents */}
          <div>
            <SectionHeader title="Legal Documents" />
            <div className="space-y-4">
              <InfoRow
                icon={Landmark}
                label="GST Number"
                value={outlet.gst_number}
                monospace
              />
              <InfoRow
                icon={Landmark}
                label="FSSAI Number"
                value={outlet.fssai_number}
                monospace
              />
              <InfoRow
                icon={Landmark}
                label="PAN Number"
                value={outlet.pan_number}
                monospace
              />
            </div>
          </div>

          {/* Admin Notes */}
          {outlet.admin_notes && (
            <div>
              <SectionHeader title="Admin Notes" />
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-900">{outlet.admin_notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <SectionHeader title="Timeline" />
            <div className="space-y-4">
              <InfoRow
                icon={Calendar}
                label="Requested On"
                value={
                  outlet.created_at
                    ? formatDate(outlet.created_at, "longTime")
                    : null
                }
              />
              <InfoRow
                icon={Clock}
                label="Last Updated"
                value={
                  outlet.updated_at
                    ? formatDate(outlet.updated_at, "longTime")
                    : null
                }
              />
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default RegistrationDetailsDrawer;
