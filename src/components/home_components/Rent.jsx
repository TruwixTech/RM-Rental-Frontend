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
      title: "Product Durability",
      description: "Our product durability is unmatched.",
      icon: <RiSofaLine />
    },
    {
      title: "Quality Insurance",
      description: "Our insurance policies offer comprehensive coverage for your peace of mind.",
      icon: <CiSquareMinus />
    },
    {
      title: "Extended Warranty",
      description: "Our warranty covers all products for a period of one year from the date of purchase.",
      icon: <CiCalendar />
    },
    {
      title: "Consultant Design",
      description: "RM Furnitures Consultants are available 24/7 to assist you.",
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