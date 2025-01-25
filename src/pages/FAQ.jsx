import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of furniture does RM Furniture Rental Company offer?",
      answer: "RM Furniture Rental Company offers a wide selection of furniture pieces for various purposes, including sofas, chairs, tables, beds, desks, and other essential furniture items for residential, commercial, and event rentals."
    },
    {
      question: "How does the rental process work?",
      answer: "The rental process at RM Furniture Rental Company is simple and straightforward. Customers can browse our inventory either online or at our physical location, select the items they need, and submit a rental request. Once the request is approved and payment is processed, we arrange for delivery and setup at the designated location. At the end of the rental period, customers can schedule pickup or return the items to our location."
    },
    {
      question: "What are the rental durations available?",
      answer: "We offer flexible rental durations to accommodate the needs of our customers. Rental periods can range from a few days to several months, depending on the customer's requirements and the nature of the rental agreement."
    },
    {
      question: "Can I customize my rental order?",
      answer: "Yes, we understand that every customer has unique preferences and requirements. While we offer pre-designed furniture sets, customers can also customize their rental orders by selecting specific items, colors, and styles from our inventory."
    },
    {
      question: "Do you offer delivery and setup services?",
      answer: "Yes, we provide delivery, setup, and pickup services for all rental orders. Our team of professionals will ensure that the furniture is delivered and set up according to the customer's specifications and timeline."
    },
    {
      question: "What are your rental rates?",
      answer: "Our rental rates vary depending on the type of furniture, duration of the rental, and any additional services requested (such as delivery and setup). We strive to offer competitive pricing and flexible packages to meet the diverse needs and budgets of our customers."
    },
    {
      question: "Do you offer rental packages for events?",
      answer: "Yes, we offer special rental packages for events such as weddings, parties, corporate functions, and trade shows. These packages typically include a curated selection of furniture items tailored to the specific requirements of the event."
    },
    {
      question: "How do I contact RM Furniture Rental Company for inquiries or bookings?",
      answer: "Customers can contact us via phone, email, or through our website to inquire about our services, check availability, or make rental bookings. Our friendly and knowledgeable staff are always available to assist with any questions or concerns."
    },
  ];

  return (
    <section className="py-8 sm:py-16 lg:py-10">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-3xl text-[#ffd74d]">
            FAQs About RM Furniture Rental
          </h2>
        </div>
        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="transition-all duration-200 bg-white border rounded-xl"
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                onClick={() => toggleAnswer(index)}
              >
                <span className="flex text-lg font-semibold text-black">
                  {item.question}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-base mt-9">
          Still have questions?{" "}
          <Link to="/contactus" className="cursor-pointer font-medium text-tertiary transition-all duration-200 hover:text-tertiary focus:text-tertiary hover-underline">
            Contact our support
          </Link>
        </p>
      </div>
    </section>
  );
};

export default FAQ;
