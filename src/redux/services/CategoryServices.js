import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllCategoriesApi: ({outletId, page, limit, serviceType, search}) => {
        const params = cleanParams({
          page,
          limit,
          search,
          serviceType,
        });
        return Api.get(`/menu/categories/outlet/${outletId}`, { params });
      },
      createCategoryApi: (values) => {
        return Api.post("/menu/categories", values);
      },
      updateCategoryApi: ({id, values}) => {
        return Api.put(`/menu/categories/${id}`, values);
      },
    };
