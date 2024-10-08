import { AXIOS_INSTANCE } from ".";

export const getAllKYCAPI = {
  getAllKYC: async () => {
    try {
      const data = await AXIOS_INSTANCE.get(`/kyc`);
      return data.data;
    } catch (error) {
      console.error("Error fetching KYCs", error);
      throw error; // Throw the error for handling in the component
    }
  },
};

export const updateKYCAPI = {
  updateKYC: async (kycId, newStatus) => {
    try {
      const data = await AXIOS_INSTANCE.put(`/kyc`, {kycId, newStatus});
      return data.data;
    } catch (error) {
      console.error("Error fetching KYCs", error);
      throw error; // Throw the error for handling in the component
    }
  },
};

export const getKYCStatusAPI = {
  getKYCStatus: async (userId) => {
    try {
      const { data } = await AXIOS_INSTANCE.get(`/kyc/status/${userId}`);
      return data;
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      throw error; // Throw the error for handling in the component
    }
  },
};

export const uploadKYCAPI = async (files, userId, alternateNumber, currentAddress) => {
  try {
    const formData = new FormData();
    
    // Append files to FormData
    files.forEach((file) => {
      formData.append("files", file); // Use the same name as specified in multer
    });

    // Append alternate number and current address to FormData
    formData.append("alternateNumber", alternateNumber);
    formData.append("currentAddress", currentAddress);

    const { data } = await AXIOS_INSTANCE.post(
      `/kyc/upload/${userId}`,
      formData, // Send the FormData object
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error uploading KYC API:", error);
    throw error; // Throw the error for handling in the component
  }
};
