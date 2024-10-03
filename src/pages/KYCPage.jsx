/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import {
  FaAddressBook,
  FaHistory,
  FaShoppingBag,
  FaIdCard,
} from "react-icons/fa";
import storageService from "../service/storage.service";
import { getKYCStatusAPI, uploadKYCAPI } from "../service/kyc.service"; // Service to fetch and send KYC data
import toast from "react-hot-toast";
import { FaUpload } from "react-icons/fa"; // Import upload icon

const KYCPage = () => {
  const [activeLink, setActiveLink] = useState("");
  const user = storageService.get("user");
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    console.log("Selected files for upload:", selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmitKYC = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one document.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await uploadKYCAPI(files, user?._id);
      if (response.success) {
        toast.success("KYC documents uploaded successfully.");
        fetchKYCStatus(); // Fetch the updated status after submission
        setFiles([]); // Clear files after successful submission
      } else {
        toast.error("Error submitting KYC documents.");
      }
    } catch (error) {
      toast.error("Failed to upload documents.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="user-profile w-full flex justify-between p-8 bg-[#f1f1f1]">
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
              // { icon: <FaAddressBook />, name: "Address", url: "/address" },
              // { icon: <FaHistory />, name: "Order History", url: "/myorders" },
              {
                icon: <RiMoneyRupeeCircleFill />,
                name: "Payment",
                url: "/payment",
              },
              { icon: <IoSettings />, name: "Setting", url: "/setting" },
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

      <div className="user-profile-right flex justify-between w-[76%] p-8 bg-white shadow-md shadow-[#dadada] rounded-lg">
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
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-dashed border-2 border-gray-400 p-4 rounded-md cursor-pointer"
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center"
                    >
                      <FaUpload className="text-4xl mb-2" />
                      <span className="text-gray-500">
                        Drag & Drop your documents here or click to upload
                      </span>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2">
                      <h3 className="font-medium">Attached Documents:</h3>
                      <ul className="list-disc list-inside">
                        {files.map((file, index) => (
                          <li key={index} className="text-gray-700">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
