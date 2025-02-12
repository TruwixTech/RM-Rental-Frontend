import React, { useState } from 'react';
import { AXIOS_INSTANCE } from '../service';

const FranchiseForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        gender: '',
        contactNumber: '',
        email: '',
        residentialAddress: '',
        preferredCommunication: '',
        businessName: '',
        businessType: '',
        businessAddress: '',
        experience: '',
        currentBusinessNature: '',
        investmentCapital: '',
        sourceOfFunds: '',
        annualRevenue: '',
        netWorth: '',
        preferredLocation: '',
        locationSuitability: '',
        motivation: '',
        longTermGoals: '',
        priorBankruptcies: '',
        bankruptcyDetails: '',
        specificGeographicArea: '',
        identifiedSite: '',
        siteDetails: '',
        ownedOrRentedSpace: '',
        spaceSize: '',
        commitment: '',
        industryExperience: '',
        experienceDetails: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AXIOS_INSTANCE.post('/franchise-form', formData)
            alert("Form submitted successfully!");
            setFormData({
                fullName: '',
                dob: '',
                gender: '',
                contactNumber: '',
                email: '',
                residentialAddress: '',
                preferredCommunication: '',
                businessName: '',
                businessType: '',
                businessAddress: '',
                experience: '',
                currentBusinessNature: '',
                investmentCapital: '',
                sourceOfFunds: '',
                annualRevenue: '',
                netWorth: '',
                priorBankruptcies: '',
                bankruptcyDetails: '',
                preferredLocation: '',
                specificGeographicArea: '',
                identifiedSite: '',
                siteDetails: '',
                ownedOrRentedSpace: '',
                spaceSize: '',
                locationSuitability: '',
                commitment: '',
                motivation: '',
                longTermGoals: '',
                industryExperience: '',
                experienceDetails: '',
            })
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">RM Furniture Rental Franchise Application Form</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <h2 className="col-span-2 text-xl font-semibold">1. Personal Information</h2>
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="input-field border-2 rounded-md px-3 py-2" />
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="input-field border-2 rounded-md px-3 py-2" />
                <select name="gender" value={formData.gender} onChange={handleChange} required className="input-field border-2 rounded-md px-3 py-2">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required className="input-field border-2 rounded-md px-3 py-2" />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="input-field border-2 rounded-md px-3 py-2" />
                <input type="text" name="residentialAddress" placeholder="Residential Address" value={formData.residentialAddress} onChange={handleChange} required className="input-field col-span-2 border-2 rounded-md px-3 py-2" />
                <select name="preferredCommunication" value={formData.preferredCommunication} onChange={handleChange} required className="input-field border-2 rounded-md px-3 py-2">
                    <option value="">Preferred Communication Mode</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                </select>

                {/* Business Information */}
                <h2 className="col-span-2 text-xl font-semibold">2. Business Information</h2>
                <input type="text" name="businessName" placeholder="Business Name/Job Details" value={formData.businessName} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2" />
                <input type="text" name="businessType" placeholder="Business Type/Designation" value={formData.businessType} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2" />
                <input type="text" name="businessAddress" placeholder="Business Address" value={formData.businessAddress} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2" />
                <input type="text" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2" />
                <textarea name="currentBusinessNature" placeholder="Nature of Current Business" value={formData.currentBusinessNature} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2 h-40 resize-none"></textarea>

                {/* Financial Information */}
                <h2 className="col-span-2 text-xl font-semibold">3. Financial Information</h2>
                <input type="text" name="investmentCapital" placeholder="Available Investment Capital" value={formData.investmentCapital} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2" />
                <input type="text" name="sourceOfFunds" placeholder="Source of Funds" value={formData.sourceOfFunds} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2" />
                <input type="text" name="annualRevenue" placeholder="Annual Revenue/Salary" value={formData.annualRevenue} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2" />
                <input type="text" name="netWorth" placeholder="Net Worth Estimate" value={formData.netWorth} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2" />

                {/* Location Details */}
                <h2 className="col-span-2 text-xl font-semibold">4. Location Details</h2>
                <input type="text" name="preferredLocation" placeholder="Preferred Location" value={formData.preferredLocation} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2" />
                <textarea name="locationSuitability" placeholder="Why this location?" value={formData.locationSuitability} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2 h-40 resize-none"></textarea>

                {/* Franchisee Commitment */}
                <h2 className="col-span-2 text-xl font-semibold">5. Franchisee Commitment</h2>
                <textarea name="motivation" placeholder="Motivation for Franchise" value={formData.motivation} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2 h-40 resize-none"></textarea>
                <textarea name="longTermGoals" placeholder="Long-Term Business Goals" value={formData.longTermGoals} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2 h-40 resize-none"></textarea>

                {/* Additional Information */}
                <h2 className="col-span-2 text-xl font-semibold">6. Additional Information</h2>
                <select name="priorBankruptcies" value={formData.priorBankruptcies} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2">
                    <option value="">Prior Bankruptcies?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <textarea name="bankruptcyDetails" placeholder="If yes, provide details" value={formData.bankruptcyDetails} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2 h-40 resize-none"></textarea>
                <input type="text" name="specificGeographicArea" placeholder="Specific Geographic Area" value={formData.specificGeographicArea} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2" />
                <input type="text" name="identifiedSite" placeholder="Identified Site" value={formData.identifiedSite} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2" />
                <textarea name="siteDetails" placeholder="Site Details" value={formData.siteDetails} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2 h-40 resize-none"></textarea>
                <select name="ownedOrRentedSpace" value={formData.ownedOrRentedSpace} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2">
                    <option value="">Owned or Rented Space?</option>
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented</option>
                </select>
                <input type="text" name="spaceSize" placeholder="Space Size (sq ft)" value={formData.spaceSize} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2" />
                <textarea name="commitment" placeholder="Commitment to Franchise" value={formData.commitment} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2 h-40 resize-none"></textarea>
                <select name="industryExperience" value={formData.industryExperience} onChange={handleChange} className="input-field border-2 rounded-md px-3 py-2">
                    <option value="">Industry Experience?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <textarea name="experienceDetails" placeholder="If yes, provide details" value={formData.experienceDetails} onChange={handleChange} className="input-field col-span-2 border-2 rounded-md px-3 py-2 h-40 resize-none"></textarea>

                <button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded-lg w-full col-span-2">Submit Application</button>
            </form>
        </div>
    );
};

function FranchiseCostInvestment(params) {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-yellow-500">Investment , operational cost and revenue and Profits details of RM rental Frenchisee</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Introduction</h2>
                <p className="text-gray-700">
                    The RM Furniture and Appliances Rental Franchise operates within the broader rental industry but focuses specifically on renting out furniture, home appliances, and similar household products to individuals or businesses. This model is appealing to people who need short-term access to high-quality furniture and appliances without the commitment of ownership. It also caters to people undergoing temporary life transitions (e.g., relocations, home renovations) or businesses in need of furnishings for offices, events, or temporary spaces.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">1.  Investment Costs for RM Furniture and Appliances Rental Franchise </h2>
                <ul className="list-disc pl-6 text-gray-700">
                    <li><strong>Initial Franchise Fee:</strong> The initial franchise fee is the one-time cost that allows the franchisee to use the brand, marketing materials, and business systems. The cost will vary depending on the brand's reputation, its market reach, and the size of the territory being offered. </li>
                    <li><strong>Typical Range:</strong> 2,00,000 – 5,00,000 Rs</li>
                    <li>This fee grants you the right to use the brand's name, receive initial training, and access proprietary systems. </li>
                    <li><strong>Initial Setup Costs:</strong> The setup costs include everything needed to establish your rental business from the ground up. These costs will vary depending on the size of the operation and location but generally include:</li>
                    <li><strong>Rental Space:</strong> One of the biggest initial expenses is renting or leasing a location. You may need a retail space to display the furniture and appliances, store inventory, and manage customer interactions. </li>
                    <li><strong>Typical Range:</strong> 20,000 – 1,00,000 Rs. Monthly, depending on location and size of the space. </li>
                    <li><strong>Inventory (Furniture & Appliances):</strong> One of the most significant upfront costs is purchasing the inventory of furniture and appliances for rental. The types of products will vary, but they typically include sofas, beds, refrigerators, washing machines, microwaves, and other household items. </li>
                    <li><strong>Typical Range:</strong> 5,00,000 – 2,00,000,0 Rs., depending on the scale of the franchise and the types of items you are renting. These products can be expensive but provide substantial revenue potential.</li>
                    <li><strong>Renovation and Branding:</strong> For a physical retail space, costs will include renovation to fit the franchise’s brand, signage, and decor.</li>
                    <li><strong>Typical Range:</strong> 50,000 - 130,000 Rs.</li>
                    <li><strong>Technology/Software:</strong> Rental franchises often require specialized software for inventory management, bookings, and customer relationship management (CRM). This software can help streamline operations, track stock levels, process payments, and manage reservations.</li>
                    <li><strong>Typical Range:</strong> 5,000 - 15,000 Rs.</li>
                    <li><strong>Marketing and Advertising:</strong> nitial marketing efforts to promote the rental franchise are critical. This includes online advertising, local promotions, events, and digital marketing.</li>
                    <li><strong>Typical Range:</strong> 10,000 - 50,000 Rs. for the first few months of marketing campaigns.</li>
                    <li><strong>Ongoing Operational Costs:</strong> Once the franchise is up and running, you'll face ongoing operational costs, such as:</li>
                    <li><strong>Royalty Fees:</strong> Most rental franchises charge a royalty fee, which is typically 10% to 15% of monthly revenue. This fee helps fund the franchisor’s support systems, marketing efforts, and operational costs.</li>
                    <li><strong>Marketing Fees:</strong> There may be an additional contribution to the franchise's national or regional marketing fund, usually around 1% - 3% of revenue. </li>
                    <li><strong>Inventory Maintenance & Replacement:</strong> Furniture and appliances require regular maintenance and occasional replacement due to wear and tear. </li>
                    <li><strong>Employee Salaries:</strong> Salaries for staff working in operations, customer service, logistics, and maintenance.</li>
                    <li><strong>Utilities and Insurance:</strong> Costs for running the physical space, including utilities, property insurance, and business insurance.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">2. Profit Potential of RM Furniture and Appliances Rental Franchise </h2>
                <p className="text-gray-700">
                    The profit potential of an RM furniture and appliances rental franchise depends on the volume of rentals, the pricing strategy, and the location. Some factors that affect profitability include:
                </p>
                <h1 className='font-semibold my-2 text-xl'>Revenue Streams:</h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li><strong>Furniture and Appliance Rentals: </strong> The primary source of revenue comes from renting out furniture and appliances. Rentals can be charged on  monthly subscription basis, depending on the customer’s needs. For example: </li>
                    <li><strong>Furniture:</strong> A sofa or bed could be rented for 500 – 2000 Rs. per month. </li>
                    <li><strong>Appliances:</strong> A washing machine or refrigerator might go for 300 – 1000 Rs. per month. </li>
                    <li>High-demand items like refrigerators, washing machines, beds and larger furniture pieces can generate steady rental income. </li>
                    <li><strong>Delivery and Pickup Fees:</strong> For large items, delivery and pickup services can be offered for an additional fee, ranging from 250 to 1500 or Its may be Free of cost depending on the distance. </li>
                    <li><strong>Late Fees::</strong>  If customers return items late, they may incur extra charges. These fees can contribute to additional revenue. </li>
                    <li><strong>Damage Fees::</strong> In the case of damaged items, franchisees can charge fees to cover repairs or replacement costs. This is especially important for expensive items like refrigerators, sofas, or high-end appliances.</li>
                </ul>
                <h1 className='font-semibold my-2 text-xl'>Profit Margins:</h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li><strong>Rental Profit Margins:</strong> Rental businesses generally enjoy relatively high-profit margins compared to retail businesses. In the rental industry, margins can range from 30% to 50%, depending on the type of products and the location. </li>
                    <li><strong>Utilization Rate:</strong> The more efficiently you can rent out your inventory, the higher the profitability. The utilization rate of furniture and appliances will vary. For example: </li>
                    <li>If you rent out 100 sofas at an average of 1000 Rs. per month, you would generate 10,0000 Rs. in monthly rental income from sofas alone, assuming full occupancy. </li>
                    <li>The higher the demand and the more items you rent out, the more revenue you generate. </li>
                </ul>
                <h1 className='font-semibold my-2 text-xl'>Break-even Point:</h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>A furniture and appliances rental franchise typically takes 1.5 to 2 years to break even, depending on: </li>
                    <li><strong>Location: </strong> The profitability can be significantly impacted by your location. Urban areas with transient populations or businesses might see quicker returns, while rural areas may take longer. </li>
                    <li><strong>Inventory Turnover:</strong> How often your furniture and appliances are rented out.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">3. Expectations from the Franchisee of RM Furniture and Appliances Rental Franchise</h2>
                <p className='my-2'>When you become a franchisee, you’ll be expected to uphold the franchisor's standards while managing daily operations. Here are the key expectations: </p>
                <h1 className='font-semibold my-2 text-xl'>Operational Standards:</h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li><strong>Inventory Management: </strong> Franchisees must keep inventory organized and well-maintained. This includes regular cleaning, repairs, and timely replacements of old or damaged items. </li>
                    <li><strong>Customer Service:</strong> Customer service is paramount. Franchisees must ensure that customers are satisfied with their rentals, provide delivery and pickup services on time, and resolve any issues with rented items. </li>
                    <li><strong>Maintenance & Cleaning: </strong> Appliances and furniture must be cleaned and repaired between rentals to ensure they are in top condition. Franchisees are expected to maintain high standards in ensuring the quality and longevity of their products. </li>
                </ul>
                <h1 className='font-semibold my-2 text-xl'>Adherence to Brand Guidelines: </h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Franchisees are expected to adhere to the brand’s established processes, including operational procedures, pricing strategies, and marketing guidelines. This ensures consistency across all locations and reinforces brand integrity. </li>
                    <li><strong>Marketing & Local Promotion:</strong> Franchisees are often required to engage in local marketing efforts, such as offering discounts or promoting rental services at local events. National or regional marketing campaigns are typically led by the franchisor, but franchisees must contribute their share. </li>
                </ul>
                <h1 className='font-semibold my-2 text-xl'>Training & Development: </h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Franchisees are expected to attend an initial training program provided by the franchisor, which covers inventory management, customer service practices, financial reporting, and marketing strategies. </li>
                    <li>Franchisees must train their staff to ensure they understand how to manage inventory, handle customer inquiries, and provide excellent service. </li>
                </ul>
                <h1 className='font-semibold my-2 text-xl'>Financial Reporting: </h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Regular financial reporting is required to maintain transparency and help the franchisor offer ongoing support. Franchisees must submit profit and loss statements, tax documents, and royalty payments on time. </li>
                </ul>
                <h1 className='font-semibold my-2 text-xl'>Compliance with Local Laws: </h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Franchisees must comply with all local laws and regulations, including health and safety codes, zoning laws (for physical locations), consumer protection laws, and any other relevant rules in the rental industry. </li>
                </ul>
                <h1 className='font-semibold my-2 text-xl'>Customer Relations:</h1>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Franchisees should maintain good relations with customers by handling complaints, requests for repairs, and returns promptly and efficiently. </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Conclusion</h2>
                <p className="text-gray-700">
                    The RM Furniture and Appliances Rental Franchise offers a promising business model with good profit potential if operated efficiently. The initial investment can be significant, especially when considering inventory, rental space, and operational setup costs, but the potential for recurring revenue through rentals, delivery, and late/damage fees makes it a lucrative opportunity.
                </p>
                <p className="text-gray-700">
                    Success will depend on the location, inventory management, marketing efforts, and customer service. Franchisees are expected to follow the franchisor's standards while engaging actively in local marketing and maintaining the quality of their rented products. With effective management, a well-executed business plan, and solid customer service, this type of franchise has a promising long-term profit potential.
                </p>
                <p className="text-gray-700">
                    Let me know if you need more details or if you're interested in a specific brand within the furniture and appliance rental industry!
                </p>
                <p className="text-gray-700">
                    USD annually, depending on location and size of the space.
                </p>
            </section>
        </div>
    )
}

const Franchise = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#ffd74d]">RM Furniture Rental Franchisee Process</h1>

            {/* Sections */}
            {franchiseSections.map((section, index) => (
                <Section key={index} title={section.title} content={section.content} />
            ))}
            <FranchiseCostInvestment />
            <FranchiseForm />
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

// Franchise Sections Data
const franchiseSections = [
    {
        title: "1. Introduction to RM Furniture Rental Franchise",
        content: (
            <p>
                RM Furniture Rental is a business that allows customers to rent furniture for short or long-term use, providing an affordable and flexible solution to furnishing homes and offices. Offering a franchise opportunity allows entrepreneurs to tap into the booming rental market while benefiting from an established brand and operational support.
            </p>
        ),
    },
    {
        title: "2. How to Give Franchisee: The Process",
        content: (
            <div className="space-y-4">
                <p>The process of becoming an RM Furniture Rental franchisee typically involves the following steps:</p>
                <ul className="list-decimal pl-6 space-y-2">
                    <li><strong>Initial Inquiry:</strong> Interested individuals or businesses can express their interest by filling out an inquiry form or contacting the company directly.</li>
                    <li><strong>Franchise Application:</strong> Once the inquiry is received, RM Furniture Rental will provide an application form to gather basic details, including financial stability, business experience, and potential location.</li>
                    <li><strong>Franchise Discussion:</strong> A meeting or call is scheduled with the company’s franchise team. This meeting covers detailed information about the franchise, such as investment costs, profit potential, and expectations from the franchisee. </li>
                    <li><strong>Review Franchise Agreement:</strong> After a thorough discussion, the potential franchisee receives a Franchise Agreement. This agreement includes all terms and conditions, financial obligations, rights, and responsibilities of both parties. </li>
                    <li><strong>Final Approval:</strong> The company will assist with store location setup, furnishing, and stocking furniture. The franchisee and their staff will undergo comprehensive training on business operations, customer service, inventory management, and marketing strategies. </li>
                    <li><strong>Franchise Setup and Training:</strong> The company assists with store setup, furnishing, and provides comprehensive training.</li>
                    <li><strong>Launch:</strong> Once everything is set up, the franchisee will be ready to officially launch their RM Furniture Rental outlet. </li>
                </ul>
            </div>
        ),
    },
    {
        title: "3. Costing of the Franchise",
        content: (
            <div className="space-y-4">
                <p>The cost of becoming an RM Furniture Rental franchisee varies based on location, store size, and other factors. The costs typically include:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Franchise Fee:</strong> Initial fee for using the brand and operating under its system.</li>
                    <li><strong>Setup Costs:</strong> This includes the cost of securing a retail location, furnishing the store, stocking inventory, branding, and other infrastructure costs.</li>
                    <li><strong>Royalty Fee:</strong> A percentage of monthly sales paid to RM Furniture Rental, which typically ranges from 5-10% (depending on the agreement).</li>
                    <li><strong>Advertising Fee:</strong> Franchisees may also be required to contribute to national or regional advertising efforts. </li>
                </ul>
                <p><strong>Total Investment:</strong> The total cost for opening an RM Furniture Rental franchise is typically in the range of ₹15 Lakhs to ₹40 Lakhs (INR), depending on the store size, location, and other specifics.</p>
            </div>
        ),
    },
    {
        title: "4. Benefits Provided to Franchisee by RM Furniture Rental",
        content: (
            <div className="space-y-4">
                <p>RM Furniture Rental offers several benefits to its franchisees, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Brand Recognition:</strong> Leverage the established reputation of RM Furniture Rental to attract customers without starting from scratch.</li>
                    <li><strong>Comprehensive Training:</strong> Receive in-depth training in business operations, sales techniques, customer service, inventory management, and marketing.</li>
                    <li><strong>Operational Support:</strong> Ongoing support from the RM Furniture Rental team for daily operations, troubleshooting, marketing, and customer engagement. </li>
                    <li><strong>Marketing Assistance:</strong> Franchisees benefit from national and regional marketing campaigns, as well as digital advertising strategies. </li>
                    <li><strong>Supply Chain and Inventory Management:</strong> RM Furniture Rental ensures that franchisees have access to high-quality furniture at competitive prices, and helps in maintaining a streamlined inventory system. </li>
                    <li><strong>Exclusive Territory:</strong> In most cases, franchisees are granted exclusive rights to a specific geographical area, reducing competition from other RM Furniture Rental franchises.</li>
                    <li><strong>Ongoing Business Assistance:</strong> The company provides continuous support in terms of business development, updates on industry trends, and growth strategies. </li>
                </ul>
            </div>
        ),
    },
    {
        title: "5. Services Provided to Customers",
        content: (
            <div className="space-y-4">
                <p>RM Furniture Rental offers the following services to customers:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Furniture Rental:</strong> RM Furniture Rental offers a variety of high-quality, stylish furniture for homes, offices, and other spaces on a rental basis. Customers can choose from different types of furniture such as sofas, beds, chairs, desks, and dining tables. </li>
                    <li><strong>Flexible Rental Plans:</strong> Customers can choose flexible rental plans based on the duration they need the furniture for, whether short-term (monthly) or long-term (annual or multi-year).</li>
                    <li><strong>Delivery and Setup:</strong> The company provides delivery and setup services to ensure that customers receive their rented furniture at the desired location and in perfect condition.</li>
                    <li><strong>Maintenance and Replacement:</strong> RM Furniture Rental provides regular maintenance services to ensure the furniture stays in top condition throughout the rental period. In case of any issues, damaged furniture is replaced at no extra cost to the customer.</li>
                    <li><strong>Customer Support:</strong> 24/7 customer support is available to address any queries, issues, or requests that the customers may have during their rental period.</li>
                </ul>
            </div>
        ),
    },
    {
        title: "6. The Complete Process for Customers Renting Furniture",
        content: (
            <div className="space-y-4">
                <p>The process for customers renting furniture includes:</p>
                <ul className="list-decimal pl-6 space-y-2">
                    <li><strong>Browse Furniture Catalogue:</strong> Customers can browse the online catalogue or visit the store to explore available furniture options. </li>
                    <li><strong>Select Furniture and Rental Plan:</strong> Customers select the furniture they need and choose a rental plan (short-term or long-term) based on their requirements.</li>
                    <li><strong>Order and Pay:</strong> The customer places an order through the website or at the store and completes the payment, which could be a one-time deposit or a monthly instalment, depending on the rental terms.</li>
                    <li><strong>Delivery and Setup:</strong> Once the order is confirmed, RM Furniture Rental arranges for the furniture delivery and installation at the customer’s location. </li>
                    <li><strong>Enjoy the Furniture:</strong> The customer enjoys the furniture for the agreed rental duration.</li>
                    <li><strong>Maintenance Services:</strong> During the rental period, customers can avail of free maintenance and repairs, if needed, to ensure their furniture stays in top condition.</li>
                    <li><strong>End of Rental Period:</strong> At the end of the rental period, customers have the option to renew the rental, return the furniture, or purchase the furniture if they wish to keep it.</li>
                    <li><strong>Return and Pickup:</strong> If the customer decides to return the furniture, RM Furniture Rental will arrange for its pickup and check the condition of the furniture. </li>
                </ul>
            </div>
        ),
    },
    {
        title: "Conclusion",
        content: (
            <p>
                RM Furniture Rental’s franchisee program offers a fantastic opportunity for entrepreneurs to tap into a growing market with low-risk investment and robust support. Franchisees benefit from a comprehensive support system, a trusted brand name, and a proven business model. Customers, in turn, enjoy the convenience and flexibility of renting stylish furniture with excellent customer service and support.
            </p>
        ),
    },
];

export default Franchise;