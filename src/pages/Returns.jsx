import React from 'react';

const Returns = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Cancellation, Return & Replacement Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Replacement</h2>
        <p className="text-gray-700 mb-2">We are happy to offer a replacement if:</p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>You received a damaged or defective item.</li>
          <li>You received an incorrect item.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Exceptions / Non-returnable / Non-replaceable Products</h2>
        <p className="text-gray-700 mb-2">The following items are not eligible for return, refund, or replacement:</p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Products damaged or missing parts due to customer handling.</li>
          <li>Products received in good condition but are no longer wanted or are deemed unsatisfactory by the customer.</li>
          <li>Items that stopped working due to misuse or improper handling after delivery.</li>
          <li>Any product returned after 5 days of delivery.</li>
          <li>Products sent as replacements.</li>
          <li>Items marked "non-returnable" on the product page.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Invalid Reasons for Return, Replacement and Refunds</h2>
        <p className="text-gray-700">
          Renter changes their mind after the Order delivered.<br />
          Renter should be confident in the purchase decision before placing an order.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cancellation</h2>
        <p className="text-gray-700 mb-2">
          If you wish to cancel an order, please contact us immediately. Cancellations are only possible if requested before the order has shipped. Once shipped, we cannot cancel or refund the order. For any questions, contact us at <a href="mailto:Support@rmfurniturerental.in" className="text-blue-500 underline">Support@rmfurniturerental.in</a>
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Cancellation by Customer</h3>
        <h4 className="text-lg font-semibold mb-2">Before the Delivery</h4>
        <p className="text-gray-700 mb-2">
          In case the customer wants to cancel the order before delivery, a request has to be made at least a day before the scheduled delivery by email on <a href="mailto:support@rmfurniturerental.in" className="text-blue-500 underline">support@rmfurniturerental.in</a>
        </p>
        <h4 className="text-lg font-semibold mb-2">During the Tenure (Hire Period)</h4>
        <p className="text-gray-700 mb-2">
          The Customer can terminate their order during the Tenure (hire period) with written notice of 15 days to the Company duly sent on email at <a href="mailto:support@rmfurniturerental.in" className="text-blue-500 underline">support@rmfurniturerental.in</a>. If the customer terminates this Agreement before the agreed Tenure, the early closure charge is calculated based on your selected tenure and the category of products.
        </p>
        <p className="text-gray-700">
          If a 15-day notice is not given, RM Rental will deduct a pro-rata hire fee for the period in which notice was given, and customers will also be liable to pay Return Transportation charges calculated as per items, distance from the nearby store, or weight of items. The remaining amount will be refunded.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
        <h3 className="text-xl font-semibold mb-2">1. How and till when can I modify my order?</h3>
        <p className="text-gray-700 mb-2">
          You can modify your order items up to one day before the scheduled delivery date by reaching us on the customer helpline, website/app chat, or email. Please note, the date and time of delivery are subject to change due to modification of your order. On changing your order, rent and deposit will be automatically adjusted as per current rates at the time of placing your order. After successful confirmation, your monthly rental amount will be calculated based on the newly chosen items in your order.
          <br />
          As a customer and party to the rental contract, your products cannot be shifted from the address mentioned in the delivery address to any other location without notifying RM Furniture rental. In case of a change of address and assistance with relocation, please contact us two weeks prior to the relocation or raise a relocation request via the customer dashboard & Chat for further assistance.
        </p>
        {/* Continue with the rest of the FAQs similarly */}
        <h3 className="text-xl font-semibold mb-2">2. How can I cancel my existing order ?</h3>
        <p className="text-gray-700 mb-2">You can cancel an order up until one day before the agreed date of delivery without any extra cost. Once delivered, an existing order cannot be cancelled.</p>

        <h3 className="text-xl font-semibold mb-2">3. Can I return a few or all items of the order if I’m not happy with the products at the time of delivery ?</h3>
        <p className="text-gray-700 mb-2">Yes. While all our products pass a series of stringent quality checks, if you're not happy with the product's condition due to a defect or non-functionality, you may return the same at the time of delivery. If notified at, some exceptions can be considered in a valid case or circumstance. Please note, a return option will not be available at once our team exits your premises after successful confirmation of your order delivery. We also advise checking the product's specified dimensions before placing the order, as item rejection will not be considered eligible for return.</p>
        <h3 className="text-xl font-semibold mb-2">4. Can I close my rental subscription prior to the committed tenure (hire period) ?</h3>
        <p className="text-gray-700 mb-2">Yes, you can. In case of early termination of your order, you can request for closure for one or all your items by informing us 15 days before the selected preferred date. Early closure charge will be applicable since the products will be returned before the end of your chosen tenure (hire period). To raise a closure request,
          <ul className="list-disc pl-6 text-gray-700">
            <li>Log in to your Rm rental account.</li>
            <li>Click on 'New Request' and choose 'Close Subscription.'</li>
            <li>Select the products you want to return.</li>
            <li>Choose a return date as per your convenience.</li>
          </ul>
          To avoid early closure charges, you can also consider the following options.
          <ul className="list-disc pl-6 text-gray-700">
            <li>In case you're looking to close your subscription due to relocation, you can check our list of operational cities and continue your current subscription from the new city.</li>
            <li>You can also transfer your subscription to someone else, and the early closure charges will no longer be applicable.</li>
          </ul>
        </p>
        <h3 className="text-xl font-semibold mb-2">5. What are the early closure charges ?</h3>
        <p className="text-gray-700 mb-2">Since the products will be returned before the end of your chosen tenure (hire period), the early closure charge is calculated based on your selected tenure and based on the category of products.<br />
          An Early Closure Charge is payable in case you decide to return the products before your current tenure is up. The charge payable is a multiple of your Monthly Rent, which is decided by the current tenure of your contract.<br />
          Please check your customer dashboard or your contract for the exact amount payable at any time.</p>
      </section>
    </div>
  );
};

export default Returns;