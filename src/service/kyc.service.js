import { AXIOS_INSTANCE } from ".";

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

export const uploadKYCAPI = async (files, userId) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file); // Use the same name as specified in multer
    });

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
