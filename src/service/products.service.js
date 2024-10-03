import { AXIOS_INSTANCE } from ".";

export const getAllProductsAPI = async (page, limit, size) => {
  try {
    const { data } = await AXIOS_INSTANCE.get("/products", {
      params: {
        page,
        limit,
        size,
      },
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const getProductByIdAPI = async (id) => {
  try {
    const { data } = await AXIOS_INSTANCE.get(`/products/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const updateCartAPI = async (payload) => {
  try {
    const { data } = await AXIOS_INSTANCE.post("/cart/update", payload);
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteProductFromCartAPI = async (productId) => {
  try {
    const { data } = await AXIOS_INSTANCE.delete(`/cart/${productId}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const getMyCartAPI = async (userId) => {
  try {
    const { data } = await AXIOS_INSTANCE.get(`/cart/${userId}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const placeOrderAPI = async (payload) => {
  try {
    const { data } = await AXIOS_INSTANCE.post("/orders", payload);
    return data;
  } catch (error) {
    return error;
  }
};