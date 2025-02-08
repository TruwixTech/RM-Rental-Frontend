import React, { useEffect, useState } from 'react'
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaShoppingBag, FaIdCard } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { NavLink } from 'react-router-dom';
import storageService from "../service/storage.service";
import { AXIOS_INSTANCE } from "../service";


function MyInvoices() {
    const user = storageService.get("user");
    const [activeLink, setActiveLink] = useState("");
    const [loading, setLoading] = useState([])
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");
    const [currentPageInvoices, setCurrentPageInvoices] = useState(1);
    const itemsPerPage = 50;

    const ClickHandler = (link) => {
        setActiveLink(link);
    };

    const handleDownloadPDF = async (invoiceId) => {
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found. Please log in.");
            }

            // API URL for downloading the invoice
            const apiUrl = `https://truwix-rm-rental-backend-dev.vercel.app/api/invoice/${invoiceId}/download-invoice`;

            // Send GET request to download the file
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob", // Important to handle binary data
            });

            // Create a Blob URL from the response data
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link to trigger the download
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${invoiceId}.pdf`; // Default file name
            link.click();

            // Clean up the temporary Blob URL
            window.URL.revokeObjectURL(url);


        } catch (error) {
            console.error("Error downloading invoice:", error);
            toast.error("An error occurred while downloading the invoice.");
        }
    };

    const fetchInvoices = async () => {
        try {


            if (!token) {
                throw new Error("Authentication token not found. Please log in.");
            }

            // API endpoint for fetching user invoices
            const apiUrl = 'invoice/user-invoices'; // Ensure the endpoint is correct

            // Fetch invoices using AXIOS_INSTANCE
            const response = await AXIOS_INSTANCE.get(apiUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response)
            // Check if response contains data
            if (response.data && Array.isArray(response.data.invoices)) {
                setInvoices(response.data.invoices); // Properly set invoices
            } else {
                console.error("Unexpected invoices format:", response.data);
                setInvoices([]); // Default to empty array
            }
        } catch (error) {
            console.error("Error fetching invoices:", error.message);
            setInvoices([]);
            setError(error.message || "An error occurred while fetching invoices"); // Set error for UI handling
        } finally {
            setLoading(false); // End loading state
        }
    };

    useEffect(() => {
        fetchInvoices()
    }, [])


    const paginatedInvoices = invoices.slice(
        (currentPageInvoices - 1) * itemsPerPage,
        currentPageInvoices * itemsPerPage
    );
    const totalInvoicePages = Math.ceil(invoices.length / itemsPerPage);

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
                            {
                                icon: <RiMoneyRupeeCircleFill />,
                                name: "Payment",
                                url: "/payment",
                            },
                            { icon: <LiaFileInvoiceDollarSolid />, name: "Invoices", url: "/my-invoices" },
                            // { icon: <IoSettings />, name: "Setting", url: "/setting" },
                        ].map((item, index) => (
                            <NavLink
                                to={item.url}
                                key={index}
                                onClick={() => ClickHandler(item.name)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 text-xl w-full ${isActive
                                        ? "text-black font-semibold"
                                        : "text-[grey]"
                                    }`
                                }
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-between sm:w-full md:w-[76%] p-8 bg-white shadow-md shadow-[#dadada] rounded-lg">
                {loading ? (
                    <p>Loading Invoices...</p>
                ) : (
                    <div className="flex flex-col items-start w-full overflow-x-scroll">
                        <div className="text-2xl font-semibold mb-4">My Invoices</div>
                        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border" >
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Invoice ID</th>
                                    <th scope="col" className="px-6 py-3">Order Id</th>
                                    <th scope="col" className="px-6 py-3">Contact No.</th>
                                    <th scope="col" className="px-6 py-3">Email Id</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Payment ID</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Item Count</th>
                                    <th scope="col" className="px-6 py-3">Created At</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedInvoices.map((invoice, index) => (
                                    <tr
                                        key={index}
                                        className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-6 py-4">{invoice._id || "N/A"}</td>
                                        <td className="px-6 py-4">{invoice.userId.name || "N/A"}</td>
                                        <td className="px-6 py-4">{invoice.userId.mobileNumber || "N/A"}</td>
                                        <td className="px-6 py-4">{invoice.userId.email || "N/A"}</td>
                                        <td className="px-6 py-4">₹{invoice.amount ? invoice.amount.toFixed(2) : "0.00"}</td>
                                        <td className="px-6 py-4">{invoice.paymentId || "N/A"}</td>
                                        <td className="px-6 py-4">{invoice.status || "N/A"}</td>
                                        <td className="px-6 py-4">{invoice.items ? invoice.items.length : 0}</td>
                                        <td className="px-6 py-4">
                                            {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDownloadPDF(invoice._id)}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                                            >
                                                Download PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyInvoices