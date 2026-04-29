// import React from "react";
// import { useNavigate } from "react-router-dom";
// import PageHeader from "../../layout/PageHeader";
// import {
//   Printer,
//   Percent,
//   Layers,
//   ChevronRight,
//   Palette,
//   CreditCard,
//   Database,
//   Bell,
//   Users,
//   Shield,
//   Wifi,
//   HardDrive,
//   ScanLine,
//   FileText,
//   TrendingUp,
//   Key,
//   Server,
//   Globe2,
// } from "lucide-react";

// // Settings sections
// const settingsSections = [
//   {
//     id: "quick",
//     title: "Quick Actions",
//     description: "Frequently accessed settings",
//     items: [
//       {
//         id: "appearance",
//         title: "Appearance",
//         path: "/settings/appearance",
//         icon: Palette,
//         description: "Theme and display preferences",
//         color: "violet",
//       },
//       {
//         id: "notifications",
//         title: "Notifications",
//         path: "/settings/notifications",
//         icon: Bell,
//         description: "Alerts and reminders",
//         color: "amber",
//       },
//       {
//         id: "security",
//         title: "Security",
//         path: "/settings/security",
//         icon: Shield,
//         description: "Password and 2FA",
//         color: "emerald",
//       },
//     ],
//   },
//   {
//     id: "hardware",
//     title: "Hardware & Devices",
//     description: "Connected peripherals",
//     items: [
//       {
//         id: "printers",
//         title: "Printers",
//         path: "/settings/printers",
//         icon: Printer,
//         description: "Receipt and label printers",
//         color: "sky",
//       },
//       {
//         id: "payment",
//         title: "Payment",
//         path: "/settings/payment",
//         icon: CreditCard,
//         description: "Terminals and readers",
//         color: "emerald",
//       },
//       {
//         id: "scanners",
//         title: "Scanners",
//         path: "/settings/scanners",
//         icon: ScanLine,
//         description: "Barcode and QR scanners",
//         color: "purple",
//       },
//     ],
//   },
//   {
//     id: "business",
//     title: "Business Operations",
//     description: "Core configurations",
//     items: [
//       {
//         id: "tax",
//         title: "Tax Management",
//         path: "/settings/tax",
//         icon: Percent,
//         description: "Tax rates and rules",
//         color: "indigo",
//       },
//       {
//         id: "groups",
//         title: "Product Groups",
//         path: "/settings/groups",
//         icon: Layers,
//         description: "Categories and collections",
//         color: "amber",
//       },
//       {
//         id: "inventory",
//         title: "Inventory",
//         path: "/settings/inventory",
//         icon: Database,
//         description: "Stock and alerts",
//         color: "rose",
//       },
//       {
//         id: "reports",
//         title: "Reports",
//         path: "/settings/reports",
//         icon: TrendingUp,
//         description: "Analytics and exports",
//         color: "cyan",
//       },
//     ],
//   },
//   {
//     id: "advanced",
//     title: "Advanced",
//     description: "Expert settings",
//     items: [
//       {
//         id: "api",
//         title: "API & Keys",
//         path: "/settings/api",
//         icon: Key,
//         description: "Access tokens and webhooks",
//         color: "fuchsia",
//       },
//       {
//         id: "audit",
//         title: "Audit Logs",
//         path: "/settings/audit",
//         icon: FileText,
//         description: "Activity and history",
//         color: "stone",
//       },
//       {
//         id: "maintenance",
//         title: "Maintenance",
//         path: "/settings/maintenance",
//         icon: HardDrive,
//         description: "System health",
//         color: "yellow",
//       },
//     ],
//   },
// ];

// // Color utility
// const getColorClasses = (color) => {
//   const colors = {
//     violet: {
//       text: "text-violet-600",
//       bg: "bg-violet-50",
//       light: "bg-violet-500/10",
//     },
//     amber: {
//       text: "text-amber-600",
//       bg: "bg-amber-50",
//       light: "bg-amber-500/10",
//     },
//     emerald: {
//       text: "text-emerald-600",
//       bg: "bg-emerald-50",
//       light: "bg-emerald-500/10",
//     },
//     sky: { text: "text-sky-600", bg: "bg-sky-50", light: "bg-sky-500/10" },
//     purple: {
//       text: "text-purple-600",
//       bg: "bg-purple-50",
//       light: "bg-purple-500/10",
//     },
//     indigo: {
//       text: "text-indigo-600",
//       bg: "bg-indigo-50",
//       light: "bg-indigo-500/10",
//     },
//     rose: { text: "text-rose-600", bg: "bg-rose-50", light: "bg-rose-500/10" },
//     cyan: { text: "text-cyan-600", bg: "bg-cyan-50", light: "bg-cyan-500/10" },
//     teal: { text: "text-teal-600", bg: "bg-teal-50", light: "bg-teal-500/10" },
//     slate: {
//       text: "text-slate-600",
//       bg: "bg-slate-50",
//       light: "bg-slate-500/10",
//     },
//     blue: { text: "text-blue-600", bg: "bg-blue-50", light: "bg-blue-500/10" },
//     fuchsia: {
//       text: "text-fuchsia-600",
//       bg: "bg-fuchsia-50",
//       light: "bg-fuchsia-500/10",
//     },
//     stone: {
//       text: "text-stone-600",
//       bg: "bg-stone-50",
//       light: "bg-stone-500/10",
//     },
//     yellow: {
//       text: "text-yellow-600",
//       bg: "bg-yellow-50",
//       light: "bg-yellow-500/10",
//     },
//   };
//   return colors[color] || colors.violet;
// };

// const AllSettingsPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Settings"
//         description="Configure and personalize your experience"
//         showBackButton
//       />

//       <div className="space-y-8">
//         {settingsSections.map((section) => (
//           <div key={section.id} className="space-y-4">
//             {/* Section Header */}
//             <div className="flex items-center gap-3">
//               <div>
//                 <h2 className="text-sm font-medium text-gray-900">
//                   {section.title}
//                 </h2>
//                 <p className="text-xs text-gray-500">{section.description}</p>
//               </div>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>

//             {/* Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
//               {section.items.map((item) => {
//                 const colors = getColorClasses(item.color);
//                 const Icon = item.icon;

//                 return (
//                   <div
//                     key={item.id}
//                     onClick={() => navigate(item.path)}
//                     className="group relative bg-white rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-100 hover:border-gray-200"
//                   >
//                     <div className="flex items-start gap-3">
//                       <div
//                         className={`relative w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}
//                       >
//                         <Icon className={`w-4 h-4 ${colors.text}`} />
//                         <div
//                           className={`absolute inset-0 rounded-lg ${colors.light} opacity-0 group-hover:opacity-100 transition-opacity`}
//                         />
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <h3 className="text-sm font-medium text-gray-900 truncate">
//                             {item.title}
//                           </h3>
//                           <ChevronRight
//                             size={14}
//                             className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
//                           />
//                         </div>
//                         <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
//                           {item.description}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AllSettingsPage;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSettingsCategories } from "../../redux/slices/settingSlice";
import SmartTable from "../../components/SmartTable";
import { Eye, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";
import { ROUTE_PATHS } from "../../config/paths";

const AllSettingsPage = () => {
  const dispatch = useDispatch();
  const { allSettings, loading } = useSelector((state) => state.setting);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllSettingsCategories());
  }, []);

  const columns = [
    {
      key: "displayName",
      label: "Category",
      render: (row) => {
        return (
          <div className="flex items-center gap-4 max-w-[340px]">
            {/* Icon */}
            <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Settings className="w-4 h-4 text-slate-600" />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {row.displayName}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 capitalize">
                Category key: {row.name}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      key: "count",
      label: "Settings",
      render: (row) => (
        <div className="flex items-center">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            <span className="text-sm font-semibold text-slate-900 mr-1">
              {row.count}
            </span>
            <span className="text-xs text-slate-500">
              {row.count === 1 ? "Setting" : "Settings"}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.SETTING_DETAILS}?category=${row.name}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"All Settings"} />
      <SmartTable
        title="Settings"
        totalcount={allSettings?.length}
        data={allSettings}
        columns={columns}
        actions={rowActions}
        loading={loading}
      />
    </div>
  );
};

export default AllSettingsPage;
