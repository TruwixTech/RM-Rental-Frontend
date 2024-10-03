import { AXIOS_INSTANCE } from ".";

const api = {
  loginAPI: async (email, password) => {
    try {
      const { data } = await AXIOS_INSTANCE.post("/login", { email, password });
      return data;
    } catch (error) {
      return error;
    }
  },
  registerAPI: async (name, email, password, mobileNumber) => {
    try {
      const { data } = await AXIOS_INSTANCE.post("/signup", {
        name,
        email,
        password,
        mobileNumber,
      });
      return data;
    } catch (error) {
      return error;
    }
  },
  getMyOrders: async () => {
    try {
      const { data } = await AXIOS_INSTANCE.get("/orders");
      return data;
    } catch (error) {
      return error;
    }
  },
  getOTP: async (mobileNumber) => {
    try {
      const { data } = await AXIOS_INSTANCE.post(`/verifysend/${mobileNumber}`);
      return data;
    } catch (error) {
      return error;
    }
  },
  verifyOTP: async (mobileNumber, otp) => {
    try {
      const { data } = await AXIOS_INSTANCE.get(
        `/verifycheck/${mobileNumber}/${otp}`
      );
      return data;
    } catch (error) {
      return error;
    }
  },
};

export default api;
