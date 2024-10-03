import { useState } from "react";
import { Link } from "react-router-dom";
// import { SiWindows } from "react-icons/si";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { IoMail } from "react-icons/io5";
import { FaAddressBook, FaLocationDot } from "react-icons/fa6";
// import { FaHistory } from "react-icons/fa";
import { FaShoppingBag, FaIdCard } from "react-icons/fa";

import storageService from "../service/storage.service";
const UserDashboard = () => {
  const [activeLink, setActiveLink] = useState("");
  const user = storageService.get("user");
  const ClickHandler = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="user-profile w-full flex justify-between p-8 bg-[#f1f1f1]">
      <div className="user-profile-left flex flex-col py-8 px-10 w-[20%] shadow-md shadow-[#dadada] bg-white rounded-lg">
        <div className="w-full">
          <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>
          <p className="text-xs overflow-hidden">{user?.createdAt}</p>
        </div>
        <div className="w-full flex flex-col justify-between">
          <h1 className="my-8 font-medium text-gray-400">Menu</h1>
          <div className="flex flex-col gap-4 links w-full">
            {[
              // { icon: <SiWindows />, name: "Wishlist", url: "/wishlist" },
              { icon: <FaShoppingBag />, name: "My Orders", url: "/myorders" },
              {
                icon: <FaIdCard />,
                name: "KYC",
                url: "/kyc",
              },
              {
                icon: <FaAddressBook />,
                name: "Address",
                url: "/address",
              },
              // {
              //   icon: <FaHistory />,
              //   name: "Order History",
              //   url: "/myorders",
              // },
              {
                icon: <RiMoneyRupeeCircleFill />,
                name: "Payment",
                url: "/payment",
              },
              { icon: <IoSettings />, name: "Setting", url: "/setting" },
            ].map((item, index) => (
              <Link
                to={item.url}
                key={index}
                onClick={() => ClickHandler(item.name)}
                className={`${
                  activeLink === item.name
                    ? "text-black font-semibold"
                    : "text-[grey]"
                } flex items-center gap-3 text-xl`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="user-profile-right flex justify-between w-[76%]">
        <div className="user-profile-right-left flex flex-col gap-8 w-[35%] rounded-lg">
          <div className="w-full shadow-md shadow-[#dadada] bg-white rounded-lg p-3 px-4">
            <div className="w-full flex flex-col gap-3 items-center">
              <div className="w-20 h-20 rounded-full bg-black"></div>
              <div>
                <h1 className="text-xl font-semibold">{user?.name}</h1>
                <p className="text-sm text-center">{user?.email}</p>
              </div>
            </div>
            <div className="w-full mt-4">
              <Link className="w-full flex items-center gap-3 py-1">
                <IoMail className="text-xl" /> {user?.email}
              </Link>
              <Link className="w-full flex items-center gap-3 py-1 my-1">
                <IoCall className="text-xl" />
                {user?.mobileNumber}
              </Link>
              <Link className="w-full flex items-center gap-3 py-1">
                <FaLocationDot className="text-xl" />
                {user?.address[0]?.addressLineOne}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
