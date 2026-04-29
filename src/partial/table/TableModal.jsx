import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { CheckboxField } from "../../components/fields/CheckboxField";
import ToggleField from "../../components/fields/ToggleField";
import InfoCard from "../../components/InfoCard";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Table name is required").max(50),

  tableNumber: Yup.string().trim().required("Table number is required").max(20),

  capacity: Yup.number()
    .typeError("Capacity must be a number")
    .required("Capacity is required")
    .min(1, "Minimum capacity is 1")
    .max(100, "Maximum capacity is 100"),

  minCapacity: Yup.number()
    .typeError("Min capacity must be a number")
    .required("Min capacity is required")
    .min(1, "Minimum is 1")
    .max(Yup.ref("capacity"), "Min capacity cannot exceed capacity"),

  shape: Yup.string()
    .required("Shape is required")
    .oneOf(["square", "rectangle", "round", "oval", "custom"]),

  displayOrder: Yup.number()
    .typeError("Display order must be a number")
    .required("Display order is required")
    .min(0, "Display order cannot be negative"),

  isMergeable: Yup.boolean().required(),

  isActive: Yup.boolean().required(),
});

const TableModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  floorId,
  sectionId,
  outletId,
  table,
}) => {
  const isEditMode = !!table;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      floorId: table?.floor_id ?? floorId ?? 0,
      outletId: table?.outlet_id ?? outletId ?? 0,
      sectionId: table?.section_id ?? sectionId ?? null,

      name: table?.name || "",
      tableNumber: table?.table_number || "",
      capacity: table?.capacity ?? 4,
      minCapacity: table?.min_capacity ?? 1,
      shape: table?.shape || "rectangle",

      displayOrder: table?.display_order ?? 0,
      isMergeable: table ? table.is_mergeable === 1 : false,
      isActive: table ? table.is_active === 1 : true,
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        floorId: Number(values.floorId),
        outletId: Number(values.outletId),
        sectionId: values.sectionId ? Number(values.sectionId) : null,
        capacity: Number(values.capacity),
        minCapacity: Number(values.minCapacity),
        displayOrder: Number(values.displayOrder),
      };

      if (isEditMode) {
        await onSubmit({
          id: Number(table.id),
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
      id="table-modal"
      title={isEditMode ? "Update Table" : "Add Table"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* NAME */}
          <InputField
            label="Table Name"
            name="name"
            required
            placeholder="e.g. Window Table"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          {/* TABLE NUMBER */}
          <InputField
            label="Table Number"
            name="tableNumber"
            required
            placeholder="e.g. T1"
            value={formik.values.tableNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tableNumber && formik.errors.tableNumber}
          />

          <div className="col-span-2">
            <InfoCard
              type="warning"
              size="sm"
              title="Unique Table Name & Number"
              description="Table name and table number must be unique within this outlet. Duplicate values are not allowed."
            />
          </div>

          {/* CAPACITY */}
          <InputField
            label="Capacity"
            name="capacity"
            type="number"
            required={true}
            value={formik.values.capacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.capacity && formik.errors.capacity}
          />

          {/* MIN CAPACITY */}
          <InputField
            label="Min Capacity"
            name="minCapacity"
            type="number"
            required={true}
            value={formik.values.minCapacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.minCapacity && formik.errors.minCapacity}
          />

          {/* SHAPE */}
          <SelectField
            label="Shape"
            name="shape"
            required
            options={[
              { value: "", label: "Select Shape" },
              { value: "rectangle", label: "Rectangle" },
              { value: "round", label: "Round" },
              { value: "square", label: "Square" },
              { value: "oval", label: "Oval" },
              { value: "custom", label: "Custom" },
            ]}
            value={formik.values.shape}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.shape && formik.errors.shape}
          />

          {/* DISPLAY ORDER */}
          <InputField
            label="Display Order"
            name="displayOrder"
            type="number"
            required
            tooltip="Controls the table position in the layout."
            helperText="Lower number shows first."
            value={formik.values.displayOrder}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.displayOrder && formik.errors.displayOrder}
          />
        </div>

        {/* CHECKBOXES */}
        <div className="space-y-2">
          <ToggleField
            label="Allow Table Merge"
            description="Combine with nearby tables."
            checked={formik.values.isMergeable}
            onChange={(value) => formik.setFieldValue("isMergeable", value)}
            activeColorClass="bg-indigo-600"
          />

          <CheckboxField
            label="Active table"
            name="isActive"
            checked={formik.values.isActive}
            onChange={formik.handleChange}
          />
        </div>

        {/* FOOTER */}
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
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
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

export default TableModal;
