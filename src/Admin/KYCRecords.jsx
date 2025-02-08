import { useState, useEffect } from "react";
import { getAllKYCAPI, updateKYCAPI } from "../service/kyc.service"; // Service to fetch and update KYC data
import toast from "react-hot-toast";

const KYCRecords = () => {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false); // State to handle reject modal visibility
  const [currentKycId, setCurrentKycId] = useState(null); // Track the KYC ID being rejected
  const [rejectedReason, setRejectReason] = useState(""); // State for capturing reject reason

  // Fetch all KYC records
  const fetchKYCs = async () => {
    try {
      const { data } = await getAllKYCAPI.getAllKYC();
      setKycs(data);
    } catch (error) {
      
    }
    setLoading(false);
  };

  // Handle KYC status update
  const handleKYCStatusUpdate = async (kycId, newStatus, rejectedReason) => {
    try {

      const data = await updateKYCAPI.updateKYC(kycId, newStatus, rejectedReason); 
      if (data.success) {
        toast.success("KYC Status Updated Successfully!");
        fetchKYCs(); // Refresh the KYC list after updating
      } else {
        toast.error("Error Updating Status!");
      }
    } catch (error) {
      
    }
};

  // Show reject modal with current KYC ID
  const openRejectModal = (kycId) => {
    setCurrentKycId(kycId); // Set the current KYC ID
    // handleKYCStatusUpdate(kycId, "Rejected", rejectedReason); // Update the status to rejected
    setShowRejectModal(true); // Show the modal
  };

  // Handle reject submit
  const handleRejectSubmit = () => {
    if (!rejectedReason) {
      toast.error("Please enter a reason for rejection.");
      return;
    }
  
    // Call the function to update the KYC status and pass the rejection reason
    handleKYCStatusUpdate(currentKycId, "Rejected", rejectedReason);
  
    setShowRejectModal(false); // Close the modal after submitting
    setRejectReason(""); 
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
              <div className="kyc-list w-full overflow-x-auto">
                <table className="table-auto w-full mb-4">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">User Name</th>
                      <th className="px-2 py-1">Customer Id</th>
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
                        <td className="border px-2 py-1">{kyc.userId?.customerId}</td>
                        <td className="border px-2 py-1">{kyc.userId?.email}</td>
                        <td className="border px-2 py-1">{kyc.userId?.mobileNumber ? kyc.userId?.mobileNumber : "N/A"}</td>
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
                                    onClick={() => openRejectModal(kyc._id)} // Open modal for rejection
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
                                  onClick={() => openRejectModal(kyc._id)} // Open modal for rejection
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Reason for Rejection</h3>
            <textarea
              className="w-full p-2 border rounded-md mb-4"
              rows="4"
              value={rejectedReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRejectModal(false)} // Close modal without action
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit} // Submit the reject reason
                className="btn btn-danger"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCRecords;
