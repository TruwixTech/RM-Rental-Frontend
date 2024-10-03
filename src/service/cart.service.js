import { AXIOS_INSTANCE } from ".";

export const addToCartAPI = async (cartData) => {
  try {
    const { data } = await AXIOS_INSTANCE.post("/order/cart", cartData);
    return data;
  } catch (error) {
    return error;
  }
};

export const getCartAPI = async (userId) => {
  try {
    const { data } = await AXIOS_INSTANCE.get("/order/cart?userId=" + userId);
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteCartAPI = async () => {
  try {
    const { data } = await AXIOS_INSTANCE.delete("/cart");
    return data;
  } catch (error) {
    return error;
  }
};

export const updateCartAPI = async (cartData) => {
  try {
    const { data } = await AXIOS_INSTANCE.put("/order/cart", cartData);
    return data;
  } catch (error) {
    return error;
  }
};
export const deleteProductFromCartAPI = async (user, productId) => {
  try {
    const { data } = await AXIOS_INSTANCE.put("/order/cart/delete", {
      user,
      productId,
    });
    return data;
  } catch (error) {
    return error;
  }
};
