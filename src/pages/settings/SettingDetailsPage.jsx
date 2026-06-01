import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import PageHeader from "../../layout/PageHeader";
import {
  fetchSettingsByCategory,
  updateSetting,
} from "../../redux/slices/settingSlice";
import {
  Info,
  CheckCircle,
  ToggleLeft,
  Text,
  Pencil,
  List,
} from "lucide-react";
import { EditSettingModal } from "../../partial/setting/EditSettingModal";
import { handleResponse } from "../../utils/helpers";
import LoadingOverlay from "../../components/LoadingOverlay";
import { formatText } from "../../utils/utils";
import InfoCard from "../../components/InfoCard";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import ModalAction from "../../components/ModalAction";

/* ============================= */
/*        MAIN PAGE              */
/* ============================= */

const SettingDetailsPage = () => {
  const dispatch = useDispatch();
  const { category } = useQueryParams();

  const { settingDetails, isFetchingSettingsDetails, isUpdatingSettings } =
    useSelector((state) => state.setting);

  const [selectedSetting, setSelectedSetting] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchSettings = () => {
    dispatch(fetchSettingsByCategory(category));
  };

  useEffect(() => {
    if (category) {
      fetchSettings();
    }
  }, [category, dispatch]);

  const settingsArray = useMemo(() => {
    if (!settingDetails?.settings) return [];
    return Object.entries(settingDetails.settings).map(([key, config]) => ({
      key,
      ...config,
    }));
  }, [settingDetails]);

  // Group settings by enabled/disabled for better organization
  const groupedSettings = useMemo(() => {
    const enabled = settingsArray.filter(
      (s) => s.type === "boolean" && s.value === true,
    );
    const disabled = settingsArray.filter(
      (s) => s.type === "boolean" && s.value === false,
    );
    const others = settingsArray.filter((s) => s.type !== "boolean");
    return { enabled, disabled, others };
  }, [settingsArray]);

  const clearSettingsStates = () => {
    setConfirmOpen(false);
    setEditOpen(false);
    setSelectedSetting(null);
  };

  const handleToggleRequest = (setting) => {
    setSelectedSetting(setting);
    setConfirmOpen(true);
  };

  const handleToggleConfirm = async (key, newValue) => {
    await handleResponse(
      dispatch(updateSetting({ key, value: newValue })),
      () => {
        clearSettingsStates();
        fetchSettings();
      },
    );
  };

  const handleEditRequest = (setting) => {
    setSelectedSetting(setting);
    setEditOpen(true);
  };

  const handleEditSave = async (key, newValue) => {
    await handleResponse(
      dispatch(updateSetting({ key, value: newValue })),
      () => {
        clearSettingsStates();
        fetchSettings();
      },
    );
  };

  if (isFetchingSettingsDetails) {
    return <LoadingOverlay text="loading settings..." />;
  }

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={`${settingDetails?.category ? formatText(settingDetails?.category) : ""} Settings`}
          description="Configure and manage your application settings"
          showBackButton
        />

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Configuration Settings - Main */}
          <div className="lg:col-span-2 space-y-4">
            {settingsArray.filter((s) => s.type !== "boolean").length > 0 && (
              <MetricPanel icon={Text} title={"Configuration Values"} noPad>
                <div className="divide-y divide-gray-100">
                  {settingsArray
                    .filter((s) => s.type !== "boolean")
                    .map((setting) => (
                      <SettingRow
                        key={setting.key}
                        setting={setting}
                        onEdit={handleEditRequest}
                      />
                    ))}
                </div>
              </MetricPanel>
            )}

            {/* Boolean Toggles */}
            {settingsArray.filter((s) => s.type === "boolean").length > 0 && (
              <MetricPanel icon={ToggleLeft} title={"Feature Toggles"} noPad>
                <div className="divide-y divide-gray-100">
                  {settingsArray
                    .filter((s) => s.type === "boolean")
                    .map((setting) => (
                      <SettingRow
                        key={setting.key}
                        setting={setting}
                        onToggle={handleToggleRequest}
                      />
                    ))}
                </div>
              </MetricPanel>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-4">
            {/* Active Features */}
            <MetricPanel
              icon={CheckCircle}
              title={"Active Features"}
              desc={"Currently enabled"}
            >
              <div className="space-y-2">
                {groupedSettings.enabled.length > 0 ? (
                  groupedSettings.enabled.map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100"
                    >
                      <CheckCircle size={12} className="text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700 capitalize">
                        {setting.key.replaceAll("_", " ")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No features enabled
                  </p>
                )}
              </div>
            </MetricPanel>

            {/* Info Card */}
            <InfoCard
              title={"Important"}
              description={
                "Changes to settings take effect immediately. Some settings may require specific permissions or configurations."
              }
              size="sm"
            />

            {/* Summary Stats */}
            <MetricPanel icon={List} title={"Summary"}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Total Settings</span>
                  <span className="text-sm font-bold text-gray-900">
                    {settingsArray.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Enabled Features
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {groupedSettings.enabled.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Editable</span>
                  <span className="text-sm font-bold text-gray-900">
                    {settingsArray.filter((s) => s.isEditable).length}
                  </span>
                </div>
              </div>
            </MetricPanel>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditSettingModal
        isOpen={editOpen}
        setting={selectedSetting}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
        loading={isUpdatingSettings}
      />

      {/* <SettingConfirmationModal
        isOpen={confirmOpen}
        setting={selectedSetting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleToggleConfirm}
        loading={isUpdatingSettings}
      /> */}

      <ModalAction
        theme={selectedSetting?.value ? "danger" : "success"}
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (!selectedSetting) return;

          const newValue = !selectedSetting.value;
          handleToggleConfirm(selectedSetting.key, newValue);
        }}
        title={`${
          selectedSetting?.value ? "Disable" : "Enable"
        } ${formatText(selectedSetting?.key)}`}
        description={`You are about to ${
          selectedSetting?.value ? "disable" : "enable"
        } this setting. This change will take effect immediately${
          selectedSetting?.description
            ? ` and may impact ${selectedSetting.description.toLowerCase()}`
            : "."
        }`}
        loading={isUpdatingSettings}
      />
    </>
  );
};

export default SettingDetailsPage;

/* ============================= */
/*      SETTING ROW COMPONENT    */
/* ============================= */

const SettingRow = ({ setting, onEdit, onToggle }) => {
  const isPercentageField =
    setting.key.toLowerCase().includes("rate") ||
    setting.key.toLowerCase().includes("percent");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors gap-3 sm:gap-4">
      {/* Left Side */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 capitalize">
            {setting.key.replaceAll("_", " ")}
          </h3>
          {setting.isDefault && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-medium">
              Default
            </span>
          )}
          {!setting.isEditable && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
              Read-only
            </span>
          )}
        </div>
        <div className="flex items-start gap-1.5">
          <Info size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed">
            {setting.description}
          </p>
        </div>
      </div>

      {/* Right Side - Control */}
      <div className="flex items-center justify-end sm:justify-start">
        {setting.type === "boolean" ? (
          <ToggleSwitch
            checked={setting.value}
            disabled={!setting.isEditable}
            onChange={() => onToggle && onToggle(setting)}
          />
        ) : (
          <button
            disabled={!setting.isEditable}
            onClick={() => onEdit?.(setting)}
            className={`group flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
              setting.isEditable
                ? "border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50"
                : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                !setting.value && setting.value !== 0
                  ? "text-slate-400 italic"
                  : "text-slate-900"
              }`}
            >
              {setting.value || setting.value === 0 ? setting.value : "Not Set"}
              {(setting.value || setting.value === 0) &&
                isPercentageField &&
                "%"}
            </span>

            {setting.isEditable && (
              <div className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 group-hover:text-primary-600">
                <Pencil size={12} />
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================= */
/*      TOGGLE SWITCH            */
/* ============================= */

const ToggleSwitch = ({ checked, onChange, disabled }) => {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-primary-500" : "bg-gray-300"
      } ${disabled && "opacity-50 cursor-not-allowed"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};
