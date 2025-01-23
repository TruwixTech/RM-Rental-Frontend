import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">When and where do you usually deliver?</h2>
        <p className="text-gray-700">
          We work all days of the week and offer delivery, installation, and pick-up services. If you lack lift access or permission at your premises, additional labor charges apply for carrying products via stairs. We currently operate in Delhi, Noida, Gurgaon, Faridabad, and Ghaziabad. Please note that AC installation incurs additional charges, which will be communicated before order placement.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Do you help with relocation?</h2>
        <p className="text-gray-700">
          We offer free relocation within the city for rented items only after a 12-month tenure with no complications caused by you. If you relocate to another city with our presence, you can rent similar products there. The relocation service is available only once during a minimum 12-month contract. We strongly advise against relocating products yourself. Any damages incurred during self-relocation will be borne by the customer.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">What if I am not at home at the time of delivery?</h2>
        <p className="text-gray-700">
          In case of unavailability, please inform us about who will receive the products. We require an acknowledgment email from you with the nominee's government ID proof to ensure your order is in safe hands.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">What if my building does not have a lift?</h2>
        <p className="text-gray-700">
          Extra labor charges apply for carrying products via stairs if you lack lift access or permission. The amount depends on the order size and floor level.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">What if my society does not allow vehicles inside?</h2>
        <p className="text-gray-700">
          Please ensure the delivery vehicle can enter your premises. Parking delivery vehicles on the road is often restricted. Additionally, ensure you have completed necessary documents and payments with your landlord. We've encountered situations where customers lacked permission to move into their new homes.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Who deals with labour (hamaali) union and transport union issues?</h2>
        <p className="text-gray-700">
          RM Furniture Rental deals with transport unions at loading and unloading areas. However, if labor union issues arise at your location, and they prevent us from unloading at your place, you'll need to handle the situation. In worst-case scenarios, we will take the items back without delivery, incurring the logistics cost. The chances of labor union issues are very low.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Is shipping free?</h2>
        <p className="text-gray-700">
          Yes, we offer free shipping across India for select products. Certain items may have shipping charges. For Fast Delivery (Prime Delivery Only) orders, shipping costs are based on product type and weight.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">When will I receive my order?</h2>
        <p className="text-gray-700">
          Orders are shipped directly from our warehouses across India. We aim for swift delivery. Expect an estimated 3-8 business days for your order to arrive with free delivery. Fast Shipping (Prime Delivery) takes 24 to 48 hours and depends on the Customer Verification process. Please note that these are estimates and can vary based on demand.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Can I track my order?</h2>
        <p className="text-gray-700">
          Yes, you will receive a tracking number (AWB) within 1-2 days after placing your order. You can track your order on our Tracking Page using this AWB number. If you encounter any tracking issues, please contact us at: <a href="mailto:support@rmfurniturerental.in" className="text-blue-500 underline">support@rmfurniturerental.in</a>
        </p>
      </section>
    </div>
  );
};

export default ShippingPolicy;