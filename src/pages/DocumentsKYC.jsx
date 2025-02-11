import React from 'react';

const DocumentsKYC = () => {
  return (
    <div className="lg:px-80 md:px-20 px-6">
      {/* Page Title */}
      <div className="flex text-[#fec500] md:text-3xl 2xl:text-4xl pt-4 justify-center text-2xl font-bold items-center">
        Documents Required for KYC
      </div>

      {/* Section: Working Professionals */}
      <div className="pt-6 text-xl font-bold text-gray-700">Working Professional</div>
      <div className="text-md text-gray-900 px-2 pt-2">
        <p className="font-semibold">Mandatory Documents:</p>
        <ul className="list-disc px-6 py-2">
          <li>Pan Card</li>
          <li>Selfie</li>
          <li>Company Name and Official Email ID</li>
          <li>Aadhar Card</li>
          <li>Rent Agreement / Electricity Bill / Phone Bill / Water Bill / Society Maintenance Bill</li>
        </ul>
        <p className="text-sm text-gray-600 pt-2">
          <strong>Note:</strong> While we appreciate you sharing your documents, RM Rental reserves the right to confirm or decline the order on a case-by-case basis.
        </p>
      </div>

      {/* Section: Self Employed */}
      <div className="pt-6 text-xl font-bold text-gray-700">Self Employed</div>
      <div className="text-md text-gray-900 px-2 pt-2">
        <p className="font-semibold">Mandatory Documents:</p>
        <ul className="list-disc px-6 py-2">
          <li>Pan Card</li>
          <li>Selfie</li>
          <li>GST Number</li>
          <li>Aadhar Card</li>
          <li>Rent Agreement / Electricity Bill / Phone Bill / Water Bill / Society Maintenance Bill</li>
        </ul>
        <p className="text-sm text-gray-600 pt-2">
          <strong>Note:</strong> While we appreciate you sharing your documents, RM Rental reserves the right to confirm or decline the order on a case-by-case basis.
        </p>
      </div>

      {/* Section: Freelance */}
      <div className="pt-6 text-xl font-bold text-gray-700">Freelance</div>
      <div className="text-md text-gray-900 px-2 pt-2">
        <p className="font-semibold">Mandatory Documents:</p>
        <ul className="list-disc px-6 py-2">
          <li>Pan Card</li>
          <li>Bank Statement</li>
          <li>Selfie Aadhar Card</li>
          <li>Rent Agreement / Electricity Bill / Phone Bill / Water Bill / Society Maintenance Bill</li>
        </ul>
        <p className="text-sm text-gray-600 pt-2">
          <strong>Note:</strong> While we appreciate you sharing your documents, RM Furniture Rental reserves the right to confirm or decline the order on a case-by-case basis.
        </p>
      </div>

      {/* Section: Students */}
      <div className="pt-6 text-xl font-bold text-gray-700">Students</div>
      <div className="text-md text-gray-900 px-2 pt-2">
        <p className="font-semibold">Mandatory Documents:</p>
        <ul className="list-disc px-6 py-2">
          <li>Govt ID Card / Aadhar Card / Driving License / Voter Card</li>
          <li>Profile Pic</li>
          <li>Bank Statement</li>
          <li>College Name</li>
        </ul>
        <p className="font-semibold pt-2">Additional Documents (Might be required in some cases):</p>
        <ul className="list-disc px-6 py-2">
          <li>Parents' Bank Statement</li>
          <li>Parents' Govt ID</li>
          <li>6 Months Bank Statement might be required in some cases</li>
        </ul>
        <p className="text-sm text-gray-600 pt-2">
          <strong>Note:</strong> While we appreciate you sharing your documents, RM Furniture Rental reserves the right to confirm or decline the order on a case-by-case basis.
        </p>
      </div>

      {/* Final Note */}
      <div className="pt-6 text-md text-gray-900 px-2 mb-10">
        <p className="text-lg text-gray-600">
          <strong>Note:</strong> While we appreciate you sharing your documents, RM Rental reserves the right to confirm or decline the order on a case-by-case basis.
          <strong>We do not deliver to PG, Hostel, and Hotel addresses.</strong>
        </p>
      </div>
    </div>
  );
};

export default DocumentsKYC;
