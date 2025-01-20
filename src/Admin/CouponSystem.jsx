import React, { useEffect, useState } from 'react'
import { AXIOS_INSTANCE } from '../service';

function CouponSystem() {
    const [code, setCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [coupons, setCoupons] = useState([]);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();

        const couponData = { code, discountPercentage, expiryDate };

        console.log('Creating coupon:', couponData);

        try {
            const response = await fetch(`https://rmrental-backend.vercel.app/api/coupon/create-coupon`, {
                // const response = await fetch(`${backend}/api/v1/coupons/create-coupon`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(couponData),
            });

            console.log('Coupon response:', response);

            const data = await response.json();
            if (response.status === 201) {
                alert('Coupon created successfully');
                // Reset the form
                setCode('');
                setDiscountPercentage('');
                setExpiryDate('');
                fetchCoupons(); // Fetch updated coupons list
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
        }
    };

    // Function to fetch existing coupons
    const fetchCoupons = async () => {
        try {
            const response = await fetch(`https://rmrental-backend.vercel.app/api/coupon/get-coupons`);
            const data = await response.json();
            setCoupons(data.coupons);
        } catch (error) {
            console.error('Error fetching coupons:', error);
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
        </div>
    )
}

export default CouponSystem