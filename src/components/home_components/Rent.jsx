import React from 'react';
import '../../assets/csss/Rent.css';
import { RiSofaLine } from "react-icons/ri";
import { CiSquareMinus } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { AiFillCustomerService } from "react-icons/ai";
import { MdOutlineArrowRightAlt } from "react-icons/md";

const Rent = () => {
  const features = [
    {
      title: "Flexibility",
      description: "Renting gives users the option to enjoy furniture and appliances without long-term commitments, ideal for students, expatriates, or those with temporary living arrangements.",
      icon: <RiSofaLine />
    },
    {
      title: "Convenience",
      description: "Renting provides an affordable solution to access premium furniture and appliances without the need for large upfront purchases, making it budget-friendly.",
      icon: <CiSquareMinus />
    },
    {
      title: "Eco-Friendly & Sustainable",
      description: "Rental services promote sustainability by refurbishing furniture and appliances, reducing waste through reuse in a circular economy, helping the environment over time.",
      icon: <CiCalendar />
    },
    {
      title: "Variety & Customization",
      description: "Renting offers a diverse selection of products to suit different tastes and preferences, from modern to classic styles, with options for high-end and basic items.",
      icon: <AiFillCustomerService />
    },
  ];
  

  return (
    <div className=''>
      <div className='rent-title'>
        <h1>Rent From RM Furniture</h1>
      </div>
      <div className="features-container">
        {features.map((feature, index) => (
          <div className="feature-box" key={index}>
            <div className="icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <MdOutlineArrowRightAlt className="arrow-icon" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rent;