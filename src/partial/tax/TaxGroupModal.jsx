import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { X, Layers, Loader2, Percent } from "lucide-react";

import { fetchAllTaxComponents } from "../../redux/slices/taxSlice";
import { InputField } from "../../components/fields/InputField";
import { MultiSelectDropdownField } from "../../components/fields/MultiSelectDropdownField";
import ModalBasic from "../../components/ModalBasic";
import InfoCard from "../../components/InfoCard";

const TaxGroupModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  taxGroup,
  outletId,
}) => {
  const dispatch = useDispatch();

  const { taxComponents, isFetchingTaxComponents } = useSelector(
    (state) => state.tax,
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllTaxComponents());
    }
  }, [isOpen, dispatch]);

  const initialValues = useMemo(() => {
    if (!taxGroup) {
      return {
        name: "",
        code: "",
        description: "",
        outletId: outletId || "",
        componentIds: [],
      };
    }

    return {
      name: taxGroup.name || "",
      code: taxGroup.code || "",
      description: taxGroup.description || "",
      outletId: taxGroup.outletId || outletId || "",
      componentIds: taxGroup.components?.map((c) => String(c.id)) || [],
    };
  }, [taxGroup, outletId]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Tax name required"),
    code: Yup.string().required("Tax code required"),
    description: Yup.string().required("Description required"),
    componentIds: Yup.array()
      .min(1, "Select at least one component")
      .required("Components required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      name: values.name.trim(),
      code: values.code.trim(),
      description: values.description.trim(),
      outletId: Number(values.outletId),
      componentIds: values.componentIds.map(Number),
    };

    if (taxGroup?.id) {
      // EDIT MODE
      await onSubmit({
        id: taxGroup.id,
        values: payload,
        resetForm,
      });
    } else {
      // CREATE MODE
      await onSubmit({
        values: payload,
        resetForm,
      });
    }
  };

  return (
    <ModalBasic
      id={"create-tax-group"}
      title={taxGroup ? "Update Tax Group" : "Create Tax Group"}
      isOpen={isOpen}
      onClose={onClose}
    >
      {/* ===== Form ===== */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <div className="p-5 space-y-5">
              {/* Name + Code */}
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Tax Name"
                  name="name"
                  required
                  placeholder="GST 5%"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                  icon={Layers}
                />

                <InputField
                  label="Tax Code"
                  name="code"
                  required
                  placeholder="GST_5"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && formik.errors.code}
                  icon={Percent}
                />
              </div>

              {/* Description */}
              <InputField
                label="Description"
                name="description"
                required
                placeholder="GST 5% (CGST 2.5% + SGST 2.5%)"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && formik.errors.description}
              />

              {/* Components */}
              <MultiSelectDropdownField
                label="Tax Components"
                name="componentIds"
                required
                options={taxComponents?.map((c) => ({
                  id: String(c.id),
                  label: `${c.name} (${c.rate}%)`,
                }))}
                value={formik.values.componentIds}
                onChange={(val) => formik.setFieldValue("componentIds", val)}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.componentIds && formik.errors.componentIds
                }
                loading={isFetchingTaxComponents}
              />
              {/* Info Banner */}
              <InfoCard
                type="info"
                size="sm"
                title="Outlet Assignment"
                description={
                  taxGroup
                    ? "This tax group is assigned to the selected outlet."
                    : "This tax group will be added to the selected outlet."
                }
              />
            </div>

            {/* ===== Footer Buttons ===== */}
            <div className="flex justify-end border-t border-slate-200 gap-3 p-5">
              <button
                type="button"
                onClick={onClose}
                className="btn border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {taxGroup ? "Updating..." : "Creating..."}
                  </>
                ) : taxGroup ? (
                  "Update Tax Group"
                ) : (
                  "Create Tax Group"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalBasic>
  );
};

export default TaxGroupModal;
