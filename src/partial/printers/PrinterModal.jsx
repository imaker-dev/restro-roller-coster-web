import React, { useMemo } from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import InfoCard from "../../components/InfoCard";
import ToggleField from "../../components/fields/ToggleField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Printer name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  station_id: Yup.string().required("Station is required"),

  ip_address: Yup.string()
    .required("IP Address is required")
    .matches(
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
      "Invalid IP address",
    ),

  port: Yup.number()
    .typeError("Port must be a number")
    .required("Port is required"),
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

      // Defaults
      printer_type: "thermal",
      connection_type: "network",

      ip_address: printer?.ipAddress || "",
      port: printer?.port ?? "",
      is_active: printer?.isActive ?? true,
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        outletId: values.outlet_id,
        name: values.name,
        station_id: Number(values.station_id),

        // fixed values
        printer_type: "thermal",
        connection_type: "network",

        ip_address: values.ip_address,
        port: Number(values.port),
          is_active: Boolean(values.is_active),

      };

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
        className="p-5 space-y-6"
      >
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

        {/* Network Printer Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="IP Address"
            name="ip_address"
            required
            placeholder="e.g. 192.168.1.100"
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
            placeholder="Default 9100"
            value={formik.values.port}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.port && formik.errors.port}
          />
        </div>

        <ToggleField
          label="Printer Active"
          description="Inactive printers will not receive print jobs."
          checked={formik.values.is_active}
          onChange={(val) => formik.setFieldValue("is_active", val)}
        />

        <InfoCard
          size="sm"
          type="info"
          title="Printer Compatibility"
          description="Currently the system only supports Thermal printers connected via Network/IP. Make sure your printer is accessible through a valid IP address and port."
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn border border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className="btn bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update"
                : "Save"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default PrinterModal;
