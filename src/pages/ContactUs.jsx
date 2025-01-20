import { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { MdLocationOn } from 'react-icons/md';
import { IoMdMail } from 'react-icons/io';
import { FaWebAwesome } from 'react-icons/fa6';
import { FaPhone } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const ContactUS = () => {
  const form = useRef();
  const [buttonText, setButtonText] = useState("SEND");

  const sendEmail = (e) => {
    e.preventDefault();
    setButtonText("Sending...");

    emailjs.sendForm('service_4ef1465', 'template_66816f6', form.current, 'kjKv0FoUnqquZpgTb')
      .then((result) => {
          console.log(result.text);
          toast.success("Message Sent Successfully!");
          setButtonText("SEND");
          form.current.reset();
      }, (error) => {
          console.log(error.text);
          toast.error("Something Went Wrong!");
          setButtonText("SEND");
      });
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-cover bg-center md:mt-6">
        
        {/* Mobile Contact Info Section */}
        <div className="bg-[#fec500] w-[90%] mt-20 rounded-xl flex md:hidden shadow-2xl text-white flex-col gap-4 justify-center px-8 h-[250px] relative z-20">
          <div className="text-2xl font-semibold">Contact Us</div>
          <p className="flex items-center text-sm">
            <span className="mr-2"><MdLocationOn size={16} /></span>Shop no. B-3, Bankey Bihari Sharnam, <br/> Rajnagar Extension, Ghaziabad
          </p>
          <p className="flex items-center text-sm">
            <span className="mr-2"><IoMdMail size={16} /></span> saviralfoods@gmail.com
          </p>
          <p className="flex items-center text-sm">
            <span className="mr-2"><FaWebAwesome size={16} /></span> SaviralFoods.in
          </p>
          <p className="flex items-center text-sm">
            <span className="mr-2"><FaPhone size={16} /></span> +91 {" "} 9971403821, +91 {" "} 9319545022
          </p>
        </div>
        
        {/* Desktop Contact Info Section */}
        <div className="bg-white w-[95%] md:w-[60%] flex flex-col md:flex-row items-center relative min-h-[500px] md:min-h-[600px] -top-1" style={{ boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.2)' }}>
          
          {/* Left Section with Contact Details */}
          <div className="bg-[#fec500] hidden md:flex shadow-2xl text-white flex-col gap-8 justify-center px-8 h-[500px] absolute left-[-120px]">
            <h2 className="text-3xl font-semibold my-4">Contact Us</h2>
            <p className="flex items-center">
              <span className="mr-2"><MdLocationOn size={20} /></span>Old barat Ghar, Makanpur, Nyay Khand <br/> 2, Indirapuram, Ghaziabad, Uttar<br/> Pradesh 201014
            </p>
            <p className="flex items-center">
              <span className="mr-2"><IoMdMail size={20} /></span> rmfurniture2020@gmail.com
            </p>
            <p className="flex items-center">
              <span className="mr-2"><FaWebAwesome size={20} /></span> rmfurniturerental.in
            </p>
            <p className="flex items-center">
              <span className="mr-2"><FaPhone size={20} /></span>+91 {" "} 9306839435, +91 {" "} 9416965679
            </p>
          </div>

          {/* Empty space for layout */}
          <div className='w-1/3 hidden md:block'></div>

          {/* Right Section with Form */}
          <div className='w-[90%] md:w-2/3'>
            <div className="bg-white md:pr-10">
              <div className="text-2xl md:text-3xl text-center md:text-start font-bold text-gray-800 my-2 md:my-6">Get in Touch</div>
              <p className="text-[#fec500] text-center md:text-start text-base md:text-xl mb-4">Feel free to drop us a line below!</p>
              <form ref={form} onSubmit={sendEmail} className="space-y-4">
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#fec500]"
                  required
                />
                <input
                  type="email"
                  name="user_email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#fec500]"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#fec500] h-32"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="px-4 py-3 bg-[#fec500] text-white rounded-full hover:bg-[#d3af2b] transition duration-300 shadow-lg w-full"
                >
                  {buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUS;