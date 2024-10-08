import { useState, useEffect } from "react";
import { getAllKYCAPI, updateKYCAPI } from "../service/kyc.service"; // Service to fetch and update KYC data
import toast from "react-hot-toast";

const KYCRecords = () => {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all KYC records
  const fetchKYCs = async () => {
    try {
      const { data } = await getAllKYCAPI.getAllKYC();
      setKycs(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Handle KYC status update
  const handleKYCStatusUpdate = async (kycId, newStatus) => {
    try {
      const data = await updateKYCAPI.updateKYC(kycId, newStatus);
      console.log(data);
      if (data.success) {
        toast.success("KYC Status Updated Successfully!");
        fetchKYCs(); // Refresh the KYC list after updating
      } else {
        toast.error("Error Updating Status!");
      }
    } catch (error) {
      console.log("Error updating KYC status:", error);
    }
  };

  // Fetch KYC records when component mounts
  useEffect(() => {
    fetchKYCs();
  }, []);

  // Function to truncate document names to 20 characters
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  return (
    <div className="w-full flex justify-center p-8 bg-[#f1f1f1]">
      <div className="user-profile-right flex justify-center w-full p-8 bg-white shadow-md shadow-[#dadada] rounded-lg">
        {loading ? (
          <p>Loading KYC Records...</p>
        ) : (
          <div className="flex flex-col items-start w-full">
            <h2 className="text-2xl font-semibold mb-4">KYC Records</h2>
            {kycs.length > 0 ? (
              <div className="kyc-list w-full overflow-x-auto"> {/* Make this div scrollable */}
                <table className="table-auto w-full mb-4">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">User Name</th>
                      <th className="px-2 py-1">User Email</th>
                      <th className="px-2 py-1">User Mobile</th>
                      <th className="px-2 py-1">Uploaded Documents</th>
                      <th className="px-2 py-1">KYC Status</th>
                      <th className="px-2 py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kycs.map((kyc) => (
                      <tr key={kyc?._id} className="text-sm">
                        <td className="border px-2 py-1">{kyc.userId?.name}</td>
                        <td className="border px-2 py-1">{kyc.userId?.email}</td>
                        <td className="border px-2 py-1">{kyc.userId?.mobileNumber}</td>
                        <td className="border px-2 py-1">
                          <ul>
                            {kyc.documents.map((document) => (
                              <li key={document._id}>
                                <a
                                  href={document.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {truncateString(document.documentType, 20)}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="border px-2 py-1">{kyc.kycStatus}</td>
                        <td className="border px-2 py-1">
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2 justify-center">
                              {kyc.kycStatus === "Pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleKYCStatusUpdate(kyc._id, "Approved")
                                    }
                                    className="btn btn-success w-24"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleKYCStatusUpdate(kyc._id, "Rejected")
                                    }
                                    className="btn btn-danger w-24"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {kyc.kycStatus === "Rejected" && (
                                <button
                                  onClick={() =>
                                    handleKYCStatusUpdate(kyc._id, "Approved")
                                  }
                                  className="btn btn-success w-24"
                                >
                                  Approve
                                </button>
                              )}
                              {kyc.kycStatus === "Approved" && (
                                <button
                                  onClick={() =>
                                    handleKYCStatusUpdate(kyc._id, "Rejected")
                                  }
                                  className="btn btn-danger w-24"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No KYC records found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCRecords;
