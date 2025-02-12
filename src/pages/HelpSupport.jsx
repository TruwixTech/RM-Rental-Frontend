import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AXIOS_INSTANCE } from '../service';


const HelpSupport = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        phone: 0,
        time: "",
        message: ""
    });

    async function submitInfo(e) {
        e.preventDefault()
        try {
            const response = await AXIOS_INSTANCE.post("/submit-help-support", userInfo);
            alert("Submitted successfully!");
            setUserInfo({
                name: "",
                phone: 0,
                time: "",
                message: ""
            })
        } catch (error) {
            console.log(error)
        }
    }

    const helpSections = [
        {
            title: "1. How It Works",
            content: (
                <div className="space-y-4">
                    <p>Renting furniture with RM Furniture Rental is simple! We offer a range of high-quality furniture for homes and offices on flexible rental plans. Whether you’re furnishing a new space or temporarily replacing old items, we’ve got you covered.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Choose Your Furniture:</strong> Browse through our extensive collection including sofas, beds, tables, chairs, and more</li>
                        <li><strong>Select Rental Plan:</strong> Choose from a few months to a year or more</li>
                        <li><strong>Delivery & Setup:</strong> We deliver and set up at your location</li>
                        <li><strong>Enjoy & Return:</strong> Extend, swap, or return at the end of your term</li>
                    </ul>
                </div>
            )
        },
        {
            title: "2. Frequently Asked Questions (FAQs)",
            content: (
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold">Q: How do I rent furniture?</p>
                        <p>A: Simply browse our collection, select your items, choose a rental plan, and proceed with checkout. Our team will handle the rest, including delivery and setup!</p>
                    </div>
                    <div>
                        <p className="font-semibold">Q: What is the minimum rental period?</p>
                        <p>A: Our minimum rental period is typically 1 month, but we offer flexible terms to accommodate your needs. </p>
                    </div>
                    <div>
                        <p className="font-semibold">Q: Can I return furniture early?</p>
                        <p>A: Yes, you can return the furniture early with a minimal penalty fee depending on the remaining rental duration. Please contact our support team for more details. </p>
                    </div>
                    <div>
                        <p className="font-semibold">Q: How is furniture maintained?</p>
                        <p>A: We take great care to ensure all furniture is in excellent condition before delivery. We also offer maintenance and replacement services in case of damage during the rental period.</p>
                    </div>
                    <div>
                        <p className="font-semibold">Q: Is there a security deposit?</p>
                        <p>A: Yes, a refundable security deposit is required at the time of rental. The amount depends on the value of the furniture being rented. </p>
                    </div>
                </div>
            )
        },
        {
            title: "3. Contact Us",
            content: (
                <>
                    <p>Our customer support team is available to assist you with any inquiries or issues. Here are the ways you can reach us: </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Email:</strong> support@rmfurniturerental.in</li>
                        <li><strong>Phone:</strong> +91-9416965679</li>
                        <li><strong>Live Chat:</strong> Click the chat icon (bottom-right)</li>
                        <li><strong>Address:</strong> RM Furniture Rental, Near- Old barat Ghar, Makanpur, Indirapuram, Ghaziabad, UP 201014</li>
                    </ul>
                </>
            )
        },
        {
            title: "5. Returns & Exchanges",
            content: (
                <div className="space-y-2">
                    <p>At RM Furniture Rental, we want you to be completely satisfied with your rental. If you're not happy with your furniture, please let us know on the days of delivery when you received the furniture, You can return instantly and we will arrange for an exchange. </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Return Policy:</strong> If you wish to return an item early, please review our return policy or get in touch with our team for assistance.</li>
                        <li><strong>Damage/Defect:</strong> In case of damaged or defective furniture, we offer replacement or repair options at no additional charge.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "7. Payment & Billing",
            content: (
                <div>
                    <p>We offer various payment methods for your convenience, including credit/debit cards, bank transfers, and online wallets. Your rental payments are due monthly, and invoices will be sent to you via email.
                        <br />
                        If you have billing questions or need to update your payment information, please contact our billing department at billing@rmfurniturerental.in </p>
                </div>
            )
        },
        {
            title: "8. Terms & Conditions",
            content: (
                <p>
                    Please read our <Link to='/termscondition' className='text-blue-500 underline und'>Terms & Conditions</Link> for full details on rental agreements, policies, and our commitment to your satisfaction.
                </p>
            )
        },
        {
            title: "9. Additional Support",
            content: (
                <>
                    <p>If you need further assistance, feel free to reach out to us. We are here to ensure your rental experience is smooth and enjoyable! </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Help Centre:</strong> Detailed guides and troubleshooting</li>
                        <li><strong>Customer Feedback:</strong> We value your improvement suggestions</li>
                    </ul>
                </>
            )
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#ffd74d]">Help & Support - RM Furniture Rental</h1>

            <p className="text-gray-700 mb-8 text-lg text-center">
                Welcome to the Help & Support page of RM Furniture Rental! We're here to assist you with any questions or concerns you may have regarding our furniture rental services. Whether you're looking for more information about our products, need assistance with your order, or have a general inquiry, our team is here to help. Find all the details you need below:
            </p>

            {/* Sections */}
            {helpSections.map((section, index) => (
                <Section key={index} title={section.title} content={section.content} />
            ))}

            {/* Request a Call Back Form */}
            <Section title="4. Request a Call Back" content={
                <form onSubmit={submitInfo} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            name='name'
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            value={userInfo.name}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd74d]"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                        <input
                            type="number"
                            name='phone'
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            value={userInfo.phone}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd74d]"
                            placeholder="Enter your phone number"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Time for Call</label>
                        <input
                            type="text"
                            name='time'
                            onChange={(e) => setUserInfo({ ...userInfo, time: e.target.value })}
                            value={userInfo.time}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd74d]"
                            placeholder="Enter preferred time"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Message (Optional)</label>
                        <textarea
                            name='message'
                            onChange={(e) => setUserInfo({ ...userInfo, message: e.target.value })}
                            value={userInfo.message}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd74d]"
                            placeholder="Enter your message"
                            rows="4"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#ffd74d] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#ffc107] transition duration-300"
                    >
                        Submit Request
                    </button>
                </form>
            } />

            {/* Track My Order Section */}
            <Section title="6. Track My Order" content={
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Want to check the status of your order? Enter your order number below to track your delivery or pickup.
                    </p>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd74d]"
                        placeholder="Enter your order number"
                    />
                </div>
            } />
        </div>
    );
};

// Section Component
const Section = ({ title, content }) => {
    return (
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-[#2b6cb0]">{title.replace('Shape', '')}</h2>
            <div className="text-gray-700 space-y-4">{content}</div>
        </section>
    );
};


export default HelpSupport;