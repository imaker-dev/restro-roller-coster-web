import { FOOD_TYPES, SECTION_TYPES } from "../constants";
import { formatText } from "../utils/utils";

export const SECTION_TYPE_OPTIONS = Object.values(SECTION_TYPES).map(
  (type) => ({
    value: type,
    label: formatText(type),
  }),
);

export const FOOD_TYPE_OPTIONS = Object.values(FOOD_TYPES).map((type) => ({
  value: type,
  label: formatText(type),
}));
