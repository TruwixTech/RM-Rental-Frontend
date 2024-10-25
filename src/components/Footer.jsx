// Footer.jsx
import "../assets/csss/Footer.css";
import logo1 from "../assets/img/logo1.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleOpenPdf1 = () => {
    // Replace the URL below with the path to your PDF file
    window.open("/src/components/home_components/terms.pdf", "_blank");
  };
  return (
    <div>
      <footer className="w-full flex flex-col">
        <div className="w-full flex flex-col items-center md:mt-20 md:items-start md:gap-20 md:flex-row md:justify-between md:px-20 mt-10">
          <div className="w-[90%] md:w-[30%] flex flex-col items-center ">
            <img src={logo1} alt="Logo" className="footer-logo" />

            <p className="mt-4 md:mt-8 text-gray-500 text-center md:text-start">
              RM Rental offers stylish, affordable furniture for rent with
              flexible plans. Upgrade your space hassle-free with our seamless
              delivery and setup services.
            </p>
          </div>
          <div className="w-full md:w-[70%] flex flex-col gap-6 mt-10 md:mt-0 items-center md:items-start md:flex-row text-center md:justify-around ">
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start ">
              <div className="text-black font-bold">SHOPPING SERVICES</div>
              <Link className="text-gray-500 my-1 text-decoration-none md:items-start">
                Catalog
              </Link>
              <Link className="text-gray-500 my-1 text-decoration-none md:items-start">
                Schedule Consultation
              </Link>
              <Link className="text-gray-500 my-1 text-decoration-none">
                Stores
              </Link>
              {/* <Link className="text-gray-500 my-1 text-decoration-none">
                Trade program
              </Link> */}
            </div>
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start ">
              <div className="text-black font-bold">ABOUT</div>
              <Link
                className="text-gray-500 my-1 text-decoration-none"
                href
                to={"/aboutus"}
              >
                About Us
              </Link>
              <Link
                to={"https://g.page/r/Cc3q4p7qCMi3EAI/review"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 my-1 text-decoration-none"
              >
                Reviews
              </Link>
              <Link className="text-gray-500 my-1 text-decoration-none">
                Financing
              </Link>
              <Link to="/contactus" className="text-gray-500 my-1 text-decoration-none">
                Contact Us
              </Link>
              <Link className="text-gray-500 my-1 text-decoration-none">
                Our Blog
              </Link>
            </div>
            {/* <div className="footer-section">
              <h4>RESOURCES</h4>
              <Link className="footer-link text-decoration-none">
                Look Up Order Status
              </Link>
              <Link className="footer-link text-decoration-none">
                Assembly Instructions
              </Link>
              <Link className="footer-link text-decoration-none">Returns</Link>
              <Link className="footer-link text-decoration-none">
                Shipping & Delivery
              </Link>
              <Link className="footer-link text-decoration-none">FAQ</Link>
              <Link className="footer-link text-decoration-none">
                Refer a Friend
              </Link>
            </div> */}
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start ">
              <div className="text-black font-bold">CONTACT</div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-gray-500 my-1">
                  Email: rmfurniture2020@gmail.com
                </span>
                <span className="text-gray-500 my-1">
                  Customer care contact : 9306839435
                </span>
                <span className="text-gray-500 my-1">
                  Complaint number : 9416965679
                </span>
                <span className="text-gray-500 my-1">Open-Hours:</span>
                <span className="text-gray-500 my-1">
                  All Days — 10am to 7pm
                </span>
                {/* <span className="text-gray-500 my-1">Saturday to Sunday — 10am to 2pm</span> */}
                <span className="text-gray-500 my-1 md:text-start">
                  Old barat Ghar, Makanpur, Nyay Khand 2, Indirapuram,
                  Ghaziabad, Uttar Pradesh 201014
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row mx-4 text-center md:text-start md:mx-20 justify-between items-center py-6 border-t-2 border-gray-400 mt-10">
          <p className="text-sm md:text-base ">
            ©2024 RM Rental , made with 💖 by Campaigning Source, all rights
            reserved
          </p>
          <p className="mt-2 md:mt-0" onClick={handleOpenPdf1}>
            <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
