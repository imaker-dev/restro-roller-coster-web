import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import PageHeader from "../../layout/PageHeader";
import {
  fetchSettingsByCategory,
  updateSetting,
} from "../../redux/slices/settingSlice";
import { Info, CheckCircle } from "lucide-react";
import { EditSettingModal } from "../../partial/setting/EditSettingModal";
import { SettingConfirmationModal } from "../../partial/setting/SettingConfirmationModal";
import { handleResponse } from "../../utils/helpers";
import LoadingOverlay from "../../components/LoadingOverlay";

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
          title={`${settingDetails?.category ? settingDetails.category.charAt(0).toUpperCase() + settingDetails.category.slice(1) : ""} Settings`}
          description="Configure and manage your application settings"
          showBackButton
        />

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Settings - Main */}
          <div className="lg:col-span-2 space-y-4">
            {settingsArray.filter((s) => s.type !== "boolean").length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Configuration Values
                  </h3>
                </div>
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
              </div>
            )}

            {/* Boolean Toggles */}
            {settingsArray.filter((s) => s.type === "boolean").length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Feature Toggles
                  </h3>
                </div>
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
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-4">
            {/* Active Features */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle size={16} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Active Features
                  </h3>
                  <p className="text-xs text-gray-500">Currently enabled</p>
                </div>
              </div>
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
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
              <div className="flex items-start gap-3">
                <Info
                  size={18}
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-semibold text-blue-900 mb-1">
                    Important
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Changes to settings take effect immediately. Some settings
                    may require specific permissions or configurations.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Summary
              </h3>
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
            </div>
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

      <SettingConfirmationModal
        isOpen={confirmOpen}
        setting={selectedSetting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleToggleConfirm}
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
            onClick={() => onEdit && onEdit(setting)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
              setting.isEditable
                ? "border-gray-200 hover:border-primary-400 hover:bg-primary-50 text-gray-800 hover:text-primary-700"
                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span className="font-semibold">{String(setting.value)}</span>

            {isPercentageField && <span className="ml-1 text-xs">%</span>}
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
