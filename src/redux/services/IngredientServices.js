import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllIngredientsApi: (outletId, page = 1, limit = 20, search) => {
        const params = cleanParams({
          page,
          limit,
          search,
        });

        return Api.get(`/recipes/${outletId}/ingredients`, { params });
      },
      getIngredientByIdApi: (id) => {
        return Api.get(`/recipes/ingredients/${id}`);
      },
      createIngredientApi: (outletId, values) => {
        return Api.post(`/recipes/${outletId}/ingredients/bulk`, values);
      },
      updateIngredientApi: (id, values) => {
        return Api.put(`/recipes/ingredients/${id}`, values);
      },
    };
