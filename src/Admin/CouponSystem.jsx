import React, { useEffect, useState } from 'react';
import { AXIOS_INSTANCE } from '../service';
import toast, { Toaster } from 'react-hot-toast'; // Import Toaster to display toast

function CouponSystem() {
    const [code, setCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [coupons, setCoupons] = useState([]);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
    
        // Check if the expiryDate is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare only dates
        const selectedDate = new Date(expiryDate);
    
        if (selectedDate < today) {
            toast.error('The expiry date cannot be in the past. Please select a valid future date.');
            return;
        }
    
        const couponData = { code, discountPercentage, expiryDate };
    
        try {
            const response = await AXIOS_INSTANCE.post(`coupon/create-coupon`, couponData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 201) {
                toast.success('Coupon created successfully');
                // Reset the form
                setCode('');
                setDiscountPercentage(''); // Use empty string for text input or 0 for numeric input
                setExpiryDate('');
                fetchCoupons(); // Fetch updated coupons list
            } else {
                const errorMessage = response.data?.message || 'Failed to create coupon';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while creating the coupon.';
            toast.error(errorMessage);
        }
    };
    

    // Function to fetch existing coupons
    const fetchCoupons = async () => {
        try {
            const response = await AXIOS_INSTANCE(`coupon/get-coupons`);
            const data = await response.data
            setCoupons(data.coupons);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('An error occurred while fetching the coupons.');
        }
    };

    const getCouponStatus = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        return {
            status: expiry >= today ? "Active" : "Expired",
            className: expiry >= today ? "text-green-500" : "text-red-500",
        };
    };

    // Fetch coupons when component loads
    useEffect(() => {
        fetchCoupons();
    }, []);


    return (
        <div className="w-full my-10 mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Coupon Management</h1>

            {/* Create Coupon Form */}
            <form onSubmit={handleCreateCoupon} className="mb-6 p-4 border rounded-lg shadow-sm">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Coupon Code:</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Discount Percentage:</label>
                    <input
                        type="number"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Expiry Date:</label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Create Coupon
                </button>
            </form>

            {/* Display Existing Coupons */}
            <h2 className="text-xl font-bold mb-4">Existing Coupons</h2>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Code</th>
                        <th className="border border-gray-300 px-4 py-2">Discount %</th>
                        <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((coupon) => {
                        const { status, className } = getCouponStatus(coupon.expiryDate);
                        return (
                            <tr key={coupon._id} className="border-b hover:bg-gray-50 text-center">
                                <td className="border border-gray-300 px-4 py-2">{coupon.code}</td>
                                <td className="border border-gray-300 px-4 py-2">{coupon.discountPercentage}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {new Date(coupon.expiryDate).toLocaleDateString()}
                                </td>
                                <td className={`border border-gray-300 px-4 py-2 ${className}`}>
                                    {status}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* ToastContainer to show toast notifications */}
            <Toaster />
        </div>
    );
}

export default CouponSystem;
