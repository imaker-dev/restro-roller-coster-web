import { Trash2 } from "lucide-react";
import { SearchSelectField } from "../../../components/fields/SearchSelectField";
import { InputField } from "../../../components/fields/InputField";
import { SelectField } from "../../../components/fields/SelectField";

export function IngredientRow({
  index,
  values,
  ingredients,
  units,
  formik,
  remove,
  onIngredientSearch,
  canRemove,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center">
            <span className="text-[10px] font-bold">{index + 1}</span>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase">
            Ingredient {index + 1}
          </span>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <SearchSelectField
          label="Ingredient"
          placeholder="Search ingredient (e.g. Tomato)"
          value={values.inventoryItemId}
          onChange={(v) =>
            formik.setFieldValue(`ingredients.${index}.inventoryItemId`, v)
          }
          options={(ingredients || []).map((i) => ({
            value: i.id,
            label: i.name,
          }))}
          error={
            formik.touched.ingredients?.[index]?.inventoryItemId &&
            formik.errors.ingredients?.[index]?.inventoryItemId
          }
          onSearch={(value) => onIngredientSearch(value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InputField
            label="Quantity"
            name={`ingredients.${index}.quantity`}
            type="number"
            placeholder="e.g. 2.5"
            value={values.quantity}
            onChange={formik.handleChange}
            error={
              formik.touched.ingredients?.[index]?.quantity &&
              formik.errors.ingredients?.[index]?.quantity
            }
          />

          <SelectField
            label="Unit"
            name={`ingredients.${index}.unitId`}
            placeholder="Select unit"
            options={units?.map((u) => ({
              value: u.id,
              label: `${u.abbreviation} (${u.name})`,
            }))}
            value={values.unitId}
            onChange={formik.handleChange}
            error={
              formik.touched.ingredients?.[index]?.unitId &&
              formik.errors.ingredients?.[index]?.unitId
            }
          />

          <InputField
            label="Wastage %"
            name={`ingredients.${index}.wastagePercentage`}
            type="number"
            placeholder="e.g. 5"
            value={values.wastagePercentage}
            onChange={formik.handleChange}
          />
        </div>

        <InputField
          label="Notes"
          name={`ingredients.${index}.notes`}
          placeholder="e.g. finely chopped"
          value={values.notes || ""}
          onChange={formik.handleChange}
        />
      </div>
    </div>
  );
}