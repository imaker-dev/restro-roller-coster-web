import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllItemsApi: (
        outletId,
        search,
        page = 1,
        limit = 10,
        categoryId,
        itemType,
        serviceType,
        includeInactive,
      ) => {
        const params = cleanParams({
          page,
          limit,
          search,
          categoryId,
          itemType,
          serviceType,
          includeInactive,
        });

        return Api.get(`/menu/items/outlet/${outletId}`, { params });
      },
      getAllItemsByCategoryApi: (categoryId) => {
        return Api.get(`/menu/items/category/${categoryId}`);
      },
      getItemByIdApi: (itemId) => {
        return Api.get(`/menu/items/${itemId}/details`);
      },
      createItemApi: (values) => {
        return Api.post(`/menu/items`, values);
      },
      updateItemApi: (id, values) => {
        return Api.put(`/menu/items/${id}`, values);
      },
    };
