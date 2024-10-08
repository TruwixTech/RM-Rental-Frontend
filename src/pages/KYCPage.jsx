/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaShoppingBag, FaIdCard } from "react-icons/fa";
import storageService from "../service/storage.service";
import { getKYCStatusAPI, uploadKYCAPI } from "../service/kyc.service"; // Service to fetch and send KYC data
import toast from "react-hot-toast";
import { FaUpload } from "react-icons/fa"; // Import upload icon
import { MdDeleteOutline } from "react-icons/md";

const KYCPage = () => {
  const [activeLink, setActiveLink] = useState("");
  const user = storageService.get("user");
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState(Array(5).fill(null)); // Array for 5 file inputs
  const [alternateNumber, setAlternateNumber] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentTypes = [
    "Aadhaar Card",
    "PAN Card",
    "Office ID",
    "Utility Bill",
    "Photo",
  ];

  const ClickHandler = (link) => {
    setActiveLink(link);
  };

  const fetchKYCStatus = async () => {
    try {
      const response = await getKYCStatusAPI.getKYCStatus(user?._id);
      if (response.kycStatus) {
        setKycStatus(response.kycStatus);
      }
    } catch (error) {
      setKycStatus(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const handleFileChange = (index, e) => {
    const selectedFile = e.target.files[0]; // Get the selected file
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = selectedFile; // Update the file at the specific index
      return newFiles;
    });
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = null; // Clear the file at the specific index
      return newFiles;
    });
  };

  const handleSubmitKYC = async (e) => {
    e.preventDefault();
    if (files.some((file) => !file)) {
      // Check if all 5 files are selected
      toast.error("Please select all 5 documents.");
      return;
    }
    if (!alternateNumber || !currentAddress) {
      toast.error("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await uploadKYCAPI(
        files,
        user?._id,
        alternateNumber,
        currentAddress
      );
      if (response.success) {
        toast.success("KYC documents uploaded successfully.");
        fetchKYCStatus(); // Fetch the updated status after submission
        setFiles(Array(5).fill(null)); // Clear files after successful submission
        setAlternateNumber(""); // Clear alternate number
        setCurrentAddress(""); // Clear current address
      } else {
        toast.error("Error submitting KYC documents.");
      }
    } catch (error) {
      toast.error("Failed to upload documents.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="user-profile w-full flex justify-between p-8 bg-[#f1f1f1] sm:space-y-3">
      <div className="user-profile-left flex flex-col py-8 px-10 w-[20%] shadow-md shadow-[#dadada] bg-white rounded-lg">
        <div className="w-full">
          <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>
          <p className="text-xs overflow-hidden">{user?.createdAt}</p>
        </div>
        <div className="w-full flex flex-col justify-between">
          <h1 className="my-8 font-medium text-gray-400">Menu</h1>
          <div className="flex flex-col gap-4 links w-full">
            {[
              { icon: <FaShoppingBag />, name: "My Orders", url: "/myorders" },
              { icon: <FaIdCard />, name: "KYC", url: "/kyc" },
              {
                icon: <RiMoneyRupeeCircleFill />,
                name: "Payment",
                url: "/payment",
              },
            ].map((item, index) => (
              <Link
                to={item.url}
                key={index}
                onClick={() => ClickHandler(item.name)}
                className={`${
                  activeLink === item.name
                    ? "text-black font-semibold"
                    : "text-[grey]"
                } flex items-center gap-3 text-xl`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between md:w-[76%] p-8 bg-white shadow-md shadow-[#dadada] rounded-lg">
        {loading ? (
          <p>Loading KYC status...</p>
        ) : (
          <div className="flex flex-col items-start w-full">
            <h2 className="text-2xl font-semibold mb-4">
              {kycStatus && <div>KYC Status: {kycStatus}</div>}
            </h2>
            <div className="status-display mb-4">
              {kycStatus === "Pending" && (
                <div className="flex items-center bg-yellow-100 text-yellow-800 p-2 rounded">
                  <FaUpload className="mr-2" />
                  <span>Your KYC documents are being reviewed.</span>
                </div>
              )}
              {kycStatus === "Approved" && (
                <div className="flex items-center bg-green-100 text-green-800 p-2 rounded">
                  <FaUpload className="mr-2" />
                  <span>Your KYC has been approved.</span>
                </div>
              )}
              {kycStatus === "Rejected" && (
                <div className="flex items-center bg-red-100 text-red-800 p-2 rounded">
                  <FaUpload className="mr-2" />
                  <span>Your KYC was rejected.</span>
                </div>
              )}
            </div>

            {kycStatus === null && (
              <div className="w-full flex flex-col items-start">
                <h2 className="text-2xl font-semibold mb-4">
                  Upload KYC Documents
                </h2>
                <form
                  onSubmit={handleSubmitKYC}
                  className="flex flex-col gap-4 w-full"
                >
                  {documentTypes.map((docType, index) => (
                    <div
                      key={index}
                      className="flex items-center border-dashed border-2 border-gray-400 p-4 rounded-md"
                    >
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(index, e)}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        id={`file-upload-${index}`}
                      />
                      <label
                        htmlFor={`file-upload-${index}`}
                        className="flex flex-col items-center cursor-pointer w-full"
                      >
                        <FaUpload className="text-4xl mb-2" />
                        <span className="text-gray-500">
                          {`Click to upload ${docType}`}
                        </span>
                      </label>
                      {files[index] && (
                        <div className="flex items-center justify-between w-full mt-2">
                          <span className="text-gray-700 ml-4 truncate">
                            {files[index].name.length > 10
                              ? `${files[index].name.substring(0, 10)}...`
                              : files[index].name}
                          </span>
                          <button
                            type="button"
                            className="text-red-500 ml-4 px-2 py-1 bg-transparent border border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Fields for Alternate Number and Current Address */}
                  <input
                    type="text"
                    placeholder="Alternate Number"
                    value={alternateNumber}
                    onChange={(e) => setAlternateNumber(e.target.value)}
                    className="border border-gray-400 p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Current Address"
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    className="border border-gray-400 p-2 rounded"
                    required
                  />

                  <button
                    type="submit"
                    className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded ${
                      isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Uploading..." : "Submit KYC"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCPage;
