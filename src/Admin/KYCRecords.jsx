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

  return (
    <div className="w-full flex justify-center p-8 bg-[#f1f1f1]">
      <div className="user-profile-right flex justify-center w-full p-8 bg-white shadow-md shadow-[#dadada] rounded-lg">
        {loading ? (
          <p>Loading KYC Records...</p>
        ) : (
          <div className="flex flex-col items-start w-full">
             <h2 className="text-2xl font-semibold mb-4">KYC Records</h2>
            {kycs.length > 0 ? (
              <div className="kyc-list w-full">
                {kycs.map((kyc) => (
                  <table key={kyc?._id} className="table w-full mb-4">
                    <thead>
                      <tr>
                        <th>KYC ID</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Uploaded At</th>
                        <th>KYC Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{kyc._id}</td>
                        <td>{kyc.userId?.name}</td>
                        <td>{kyc.userId?.email}</td>
                        <td>
                          {new Date(
                            kyc.documents[0]?.uploadedAt
                          ).toDateString()}
                        </td>
                        <td>{kyc.kycStatus}</td>
                        <td>
                          {/* View Document and Conditional Action buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                window.open(
                                  kyc.documents[0]?.documentUrl,
                                  "_blank"
                                );
                              }}
                              className="btn btn-primary"
                            >
                              View Document
                            </button>

                            {kyc.kycStatus === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleKYCStatusUpdate(kyc._id, "Approved")
                                  }
                                  className="btn btn-success"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleKYCStatusUpdate(kyc._id, "Rejected")
                                  }
                                  className="btn btn-danger"
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
                                className="btn btn-success"
                              >
                                Approve
                              </button>
                            )}

                            {kyc.kycStatus === "Approved" && (
                              <button
                                onClick={() =>
                                  handleKYCStatusUpdate(kyc._id, "Rejected")
                                }
                                className="btn btn-danger"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
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
