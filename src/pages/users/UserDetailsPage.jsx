import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Clock,
  Building2,
  MapPin,
  Hash,
  Edit,
  Grid3x3,
  Activity,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchUserById } from "../../redux/slices/userSlice";
import { formatDate } from "../../utils/dateFormatter";
import StatCard from "../../components/StatCard";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import NoDataFound from "../../layout/NoDataFound";
import StatusBadge from "../../layout/StatusBadge";
import { ROUTE_PATHS } from "../../config/paths";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import RoleBadge from "../../partial/user/RoleBadge";

// ─── Card Component ────────────────────────────────────────────────────────────
function Card({
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Icon
                    size={16}
                    className="text-primary-600"
                    strokeWidth={2}
                  />
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {subtitle && (
                  <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            {badge && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                {badge}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Info Row ──────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="flex items-start py-3.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {Icon && (
          <Icon size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
          <p
            className={`text-sm font-medium text-gray-900 ${mono ? "font-mono" : ""} break-words`}
          >
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function UserDetailsPage() {
  const dispatch = useDispatch();
  const { userId } = useQueryParams();
  const { userDetails: user, isFetchingUserDetails } = useSelector(
    (state) => state.user,
  );

  const { assignedStation } = user || {};

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [userId]);

  const lastLogin = formatDate(user?.lastLoginAt, "long");
  const createdAt = formatDate(user?.createdAt, "long");

  if (isFetchingUserDetails) {
    return <LoadingOverlay text="Loading User Details..." />;
  }

  if (!user) {
    return <NoDataFound title="User Not Found" />;
  }

  const stats = [
    {
      icon: Shield,
      label: "Active Roles",
      value: user?.roles?.length || 0,
    },
    {
      icon: MapPin,
      label: "Floor Assignments",
      value: user?.assignedFloors?.length || 0,
    },
    {
      icon: Grid3x3,
      label: "Section Access",
      value: user?.assignedSections?.length || 0,
    },
    {
      icon: Activity,
      label: "Account Status",
      value: user?.isActive ? "Active" : "Inactive",
      trend: user?.isActive ? "Online" : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Details"
        description="Comprehensive staff member information and access details"
        showBackButton
      />

      {/* Hero Section */}
      <Card className="border-0 bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {user?.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <StatusBadge value={user?.isActive} />
              <RoleBadge role={user?.roles?.[0]?.name} />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Mail size={15} className="text-white/60" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Phone size={15} className="text-white/60" />
                <span>{user?.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Hash size={15} className="text-white/60" />
                <span className="font-mono font-medium">
                  {user?.employeeCode}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full md:w-auto">
            <Link
              to={`${ROUTE_PATHS.USER_ADD}?userId=${user?.id}`}
              className="flex-1 md:flex-initial btn bg-white hover:bg-gray-50 text-primary-700 px-5 py-2.5 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Edit
            </Link>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat?.icon}
            title={stat?.label}
            value={stat?.value}
            color="orange"
            variant="v9"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <MetricPanel
            title="Basic Information"
            desc="Personal details and contact"
            icon={User}
          >
            <div className="space-y-0">
              <InfoRow icon={User} label="Full Name" value={user?.name} />
              <InfoRow icon={Mail} label="Email Address" value={user?.email} />
              <InfoRow icon={Phone} label="Phone Number" value={user?.phone} />
              <InfoRow
                icon={Hash}
                label="Employee Code"
                value={user?.employeeCode}
                mono
              />
            </div>
          </MetricPanel>

          {/* Floors */}
          <MetricPanel
            title="Floor Assignments"
            desc="Assigned floors and primary access"
            icon={MapPin}
            count={`${user?.assignedFloors?.length || 0} Floor${user?.assignedFloors?.length !== 1 ? "s" : ""}`}
          >
            {user?.assignedFloors?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {user?.assignedFloors?.map((floor) => (
                  <div
                    key={floor?.id}
                    className="relative p-5 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    {floor?.isPrimary && (
                      <span className="absolute top-3 right-3 px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-bold">
                        PRIMARY
                      </span>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary-600">
                          {floor?.floorNumber}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {floor?.floorName}
                        </h4>
                        <p className="text-xs font-mono text-gray-500">
                          {floor?.floorCode}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="text-gray-600 truncate">
                          {floor?.outletName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
                <p>No floor assignments</p>
              </div>
            )}
          </MetricPanel>

          {/* Sections */}
          <MetricPanel
            title="Section Assignments"
            desc="Assigned sections and areas"
            icon={Grid3x3}
            count={`${user?.assignedSections?.length || 0} Section${user?.assignedSections?.length !== 1 ? "s" : ""}`}
          >
            {user?.assignedSections?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user?.assignedSections?.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    {/* Section content */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Grid3x3 size={48} className="mx-auto text-gray-300 mb-3" />
                <p>No section assignments</p>
              </div>
            )}
          </MetricPanel>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Roles */}
          <MetricPanel
            title="Roles & Outlet Assignments"
            desc="Active role assignments across outlets"
            icon={Shield}
            count={`${user?.roles?.length || 0} Active`}
          >
            {user?.roles?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {user?.roles?.map((role) => (
                  <div
                    key={role?.id}
                    className="p-5 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {role?.name}
                        </h4>
                        <p className="text-xs font-mono text-gray-500">
                          {role?.slug}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="text-gray-600">Outlet:</span>
                        <span className="font-medium text-gray-900 truncate">
                          {role?.outletName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="text-gray-600">Assigned:</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(role?.assignedAt, "long")}
                        </span>
                      </div>
                      {role?.expiresAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock
                            size={14}
                            className="text-amber-500 flex-shrink-0"
                          />
                          <span className="text-gray-600">Expires:</span>
                          <span className="font-medium text-amber-700">
                            {formatDate(role?.expiresAt, "long")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Shield size={48} className="mx-auto text-gray-300 mb-3" />
                <p>No roles assigned to this user</p>
              </div>
            )}
          </MetricPanel>

          {/* Station */}
          <MetricPanel
            title="Station Assignment"
            desc="Assigned station configuration"
            icon={MapPin}
            count={assignedStation ? "1 Station" : "No Station"}
          >
            {assignedStation ? (
              <div className="relative p-5 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
                {/* PRIMARY BADGE */}
                {assignedStation.isPrimary && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-bold">
                    PRIMARY
                  </span>
                )}

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {assignedStation.stationName}
                    </h4>
                    <p className="text-xs font-mono text-gray-500">
                      {assignedStation.stationCode}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2
                      size={14}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <span className="text-gray-600 truncate">
                      {assignedStation.outletName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Grid3x3
                      size={14}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <span className="text-gray-600 capitalize">
                      {assignedStation.stationType?.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">
                      Printer:{" "}
                      {assignedStation.printer
                        ? assignedStation.printer.name
                        : "Not Assigned"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
                <p>No station assigned</p>
              </div>
            )}
          </MetricPanel>

          {/* Activity */}
          <MetricPanel title="Recent Activity" icon={Clock}>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                  Last Login
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {lastLogin}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  Member Since
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {createdAt}
                </p>
              </div>
            </div>
          </MetricPanel>
        </div>
      </div>
    </div>
  );
}
