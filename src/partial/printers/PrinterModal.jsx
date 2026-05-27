import React, { useMemo } from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Loader2, Network, Printer } from "lucide-react";

import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import InfoCard from "../../components/InfoCard";
import ToggleField from "../../components/fields/ToggleField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Printer name is required")
    .min(2, "Printer name is too short")
    .max(50, "Printer name is too long"),

  station_id: Yup.string().required("Please select a station"),

  connection_type: Yup.string()
    .oneOf(["network", "windows_printer"])
    .required("Connection type is required"),

  // Network Validation
  ip_address: Yup.string().when("connection_type", {
    is: "network",
    then: (schema) =>
      schema
        .required("IP Address is required")
        .matches(
          /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
          "Invalid IP address",
        ),
    otherwise: (schema) => schema.nullable(),
  }),

  port: Yup.number().when("connection_type", {
    is: "network",
    then: (schema) =>
      schema
        .typeError("Port must be a number")
        .required("Port is required")
        .min(1, "Invalid port")
        .max(65535, "Port must be below 65535"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Windows Printer Validation
  printer_name: Yup.string().when("connection_type", {
    is: "windows_printer",
    then: (schema) =>
      schema
        .trim()
        .required("Printer name is required")
        .min(2, "Printer name is too short"),
    otherwise: (schema) => schema.nullable(),
  }),
});

const PrinterModal = ({
  isOpen,
  onClose,
  onSubmit,
  outletId,
  printer,
  stations = [],
  loading = false,
}) => {
  const isEditMode = !!printer;

  const stationOptions = useMemo(() => {
    return stations?.map((s) => ({
      label: s?.name,
      value: s?.id,
    }));
  }, [stations]);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      outlet_id: outletId || "",

      name: printer?.name || "",
      station_id: printer?.stationId || "",

      printer_type: printer?.printerType || "thermal",

      connection_type: printer?.connectionType || "",

      // Network
      ip_address: printer?.ipAddress || "",
      port: printer?.port ?? 9100,

      // Windows Printer
      printer_name: printer?.printerName || "",

      is_active: printer?.isActive ?? true,
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        outletId: values.outlet_id,
        name: values.name,
        station_id: Number(values.station_id),

        printer_type: "thermal",

        connection_type: values.connection_type,

        is_active: Boolean(values.is_active),

        // Default empty values
        ip_address: "",
        port: "",
        printer_name: "",
      };

      // Network Printer
      if (values.connection_type === "network") {
        payload.ip_address = values.ip_address;
        payload.port = Number(values.port);
      }

      // Windows Printer
      if (values.connection_type === "windows_printer") {
        payload.printer_name = values.printer_name;
      }

      if (isEditMode) {
        await onSubmit({
          id: Number(printer.id),
          values: payload,
          resetForm,
        });
      } else {
        await onSubmit({
          values: payload,
          resetForm,
        });
      }
    },
  });

  return (
    <ModalBasic
      id="printer-modal"
      title={isEditMode ? "Update Printer" : "Add Printer"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="space-y-4 p-4"
      >
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Printer Name"
            name="name"
            required
            placeholder="e.g. Kitchen Main Printer"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <SelectField
            label="Assign Station"
            name="station_id"
            required
            value={formik.values.station_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.station_id && formik.errors.station_id}
            options={stationOptions}
          />
        </div>

        {/* Connection Configuration */}
        <div className="space-y-4">
          {/* Connection Type */}
          <SelectField
            label="Connection Type"
            name="connection_type"
            required
            value={formik.values.connection_type}
            onChange={(e) => {
              const value = e.target.value;

              formik.setFieldValue("connection_type", value);

              // Reset fields when switching
              if (value === "network") {
                formik.setFieldValue("printer_name", "");
              }

              if (value === "windows_printer") {
                formik.setFieldValue("ip_address", "");

                formik.setFieldValue("port", 9100);
              }
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.connection_type && formik.errors.connection_type
            }
            options={[
              {
                label: "Network Printer",
                value: "network",
              },
              {
                label: "Windows Printer",
                value: "windows_printer",
              },
            ]}
          />

          {/* Network Fields */}
          {formik.values.connection_type === "network" && (
            <div className="rounded border border-slate-200 bg-slate-50/60 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-slate-500" />

                <h4 className="text-sm font-medium text-slate-700">
                  Network Configuration
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="IP Address"
                  name="ip_address"
                  required
                  placeholder="192.168.1.101"
                  value={formik.values.ip_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ip_address && formik.errors.ip_address}
                />

                <InputField
                  label="Port"
                  name="port"
                  type="number"
                  required
                  placeholder="9100"
                  value={formik.values.port}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.port && formik.errors.port}
                  helperText={"Most thermal printers use port 9100."}
                />
              </div>
            </div>
          )}

          {/* Windows Printer Fields */}
          {formik.values.connection_type === "windows_printer" && (
            <div className="rounded border border-slate-200 bg-slate-50/60 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-slate-500" />

                <h4 className="text-sm font-medium text-slate-700">
                  Windows Printer Configuration
                </h4>
              </div>

              <InputField
                label="Printer Name"
                name="printer_name"
                required
                placeholder="EPSON TM-T88IV Receipt"
                value={formik.values.printer_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.printer_name && formik.errors.printer_name
                }
                helperText={
                  "Use the exact printer name installed on the Windows machine."
                }
              />
            </div>
          )}
        </div>

        {/* Active Toggle */}
        <ToggleField
          label="Printer Active"
          description="Inactive printers will not receive print jobs."
          checked={formik.values.is_active}
          onChange={(val) => formik.setFieldValue("is_active", val)}
        />

        {/* Info */}
        <InfoCard
          size="sm"
          type="info"
          title="Printer Configuration"
          description={
            formik.values.connection_type === "network"
              ? "Ensure the printer is accessible over the network."
              : "Ensure the printer is installed and accessible on the Windows system."
          }
        />

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className="btn bg-primary-600 text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}

            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update Printer"
                : "Save Printer"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default PrinterModal;
