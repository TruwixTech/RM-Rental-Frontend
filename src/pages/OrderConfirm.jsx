import  { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AXIOS_INSTANCE } from "../service";

const OrderConfirm = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId);
  const [orderData, setOrderData] = useState(location.state?.orderData);
  const getOrderData = async () => {
    try {
      const { data } = await AXIOS_INSTANCE.get(`/orders/${orderId}`);
      setOrderData(data?.data);
    } catch (error) {
      
    }
  };
  useEffect(() => {
    if (orderId) {
      getOrderData();
    }
  }, [orderId]);


 
  return (
    <div className="order-confirm w-full flex">
      <div className="order-confirm-left flex flex-col items-center gap-12 py-20  w-full px-8 h-full bg-[#31c07e]">
        <IoIosCheckmarkCircle className="success-icon text-[10vw] text-white" />
        <div className="order-confirm-left-top text-center text-white">
          <p className="text-lg">THANK YOU</p>
          <h1 className="text-3xl font-bold my-2">YOUR ORDER IS CONFIRMED</h1>
          <p className="">
            You need to Complete your KYC then only your order will be dispatched for delivery within 24 hours.
          </p>
        </div>
        <div className="order-confirm-left-btm flex flex-col gap-8  w-full bg-white p-8 rounded-lg">
          <p className="text-[grey] text-center">
            Order {orderData?._id} was placed on{" "}
            <span className="text-black font-medium">
              {new Date(orderData?.createdAt).toLocaleDateString()}
            </span>{" "}
            and is currently in progress
          </p>
          <div className="order-status w-full flex items-center justify-between ">
            <div className="flex flex-col items-center justify-center gap-2">
              <IoIosCheckmarkCircle className="order-status-icon text-5xl text-[#31c07e]" />
              <h1 className="text-md text-center font-semibold">
                ORDER <br /> CONFIRMED
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <IoIosCheckmarkCircle className="order-status-icon text-5xl text-[#dadada]" />
              <h1 className="text-md text-center font-semibold">
                KYC <br /> VERIFIED
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <IoIosCheckmarkCircle className="order-status-icon text-5xl text-[#dadada]" />
              <h1 className="text-md text-center font-semibold">
                ORDER <br /> SHIPPED
              </h1>
            </div>
            {/* <div className="flex flex-col items-center justify-center gap-2">
              <IoIosCheckmarkCircle className="order-status-icon text-5xl text-[#dadada]" />
              <h1 className="text-md text-center font-semibold">
                <br /> DELIVERED
              </h1>
            </div> */}
            <div className="flex flex-col items-center justify-center gap-2">
              <IoIosCheckmarkCircle className="order-status-icon text-5xl text-[#dadada]" />
              <h1 className="text-md text-center font-semibold">
                PRODUCT <br /> DELIVERED
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[grey]">
              Expected Delivery Date:{" "}
              <span className="text-black font-medium">
                {new Date(orderData?.expectedDeliveryDate).toLocaleDateString()}
              </span>
            </p>
            <Link className="text-[royalblue] underline">Track Your Order</Link>
          </div>
        </div>
      </div>
      {/* <div className="order-confirm-right flex flex-col gap-1 w-[30%]">
        <div className="invoice w-full flex items-center justify-between p-3">
          <div>
            <p className="text-sm">ORDER DETAIL</p>
            <h1 className="text-xl font-semibold">{orderData?._id}</h1>
          </div>
          <div>
            <p className="font-medium text-sm">Pay with RazorPay</p>
            <Link className="flex items-center text-xs gap-2 p-2 bg-[white] border-[1px] border-black font-medium">
              <FaDownload /> Download Invoice
            </Link>
          </div>
        </div>
        <div className="w-full flex items-center justify-between p-3 bg-white">
          <div className="flex items-center gap-2">
            <FaTruck className="text-xl" />
            <h1 className="font-medium text-lg">DELIVERY ADDRESS</h1>
          </div>
          <Link className="text-[royalblue] underline text-sm">
            Change Details
          </Link>
        </div>
        <div className="w-full flex items-center justify-between p-3 bg-white">
          <p className="text-sm w-[70%] font-medium">
            {orderData?.shippingAddress?.addressLineOne +
              "," +
              orderData?.shippingAddress?.addressLineTwo +
              "," +
              orderData?.address?.pincode}
          </p>
        </div>
        <div className="w-full flex items-center justify-between p-3 bg-white">
          <div className="flex items-center gap-2">
            <FaAddressBook className="text-xl" />
            <h1 className="font-medium text-lg">BILLING ADDRESS</h1>
          </div>
        </div>
        <div className="w-full flex items-center justify-between p-3 bg-white">
          <p className="text-sm w-[70%] font-medium">
            {orderData?.shippingAddress?.addressLineOne +
              "," +
              orderData?.shippingAddress?.addressLineTwo +
              "," +
              orderData?.address?.pincode}
          </p>
        </div>
        <div className="w-full flex items-center justify-between p-3 bg-white">
          <div className="flex items-center gap-2">
            <MdContacts className="text-xl" />
            <h1 className="font-medium text-lg">CONTACT DETAILS</h1>
          </div>
        </div>
        <div className="w-full p-3 bg-white">
          <p className="text-sm w-[70%] font-medium">{orderData?.user.name}</p>
          <p className="text-sm w-[70%] font-medium">{orderData?.user.email}</p>
          <p className="text-sm w-[70%] font-medium">{orderData?.user.phone}</p>
        </div>
        <div className="p-3">
          <Link className="flex items-center p-2 px-3 rounded-md justify-between font-medium bg-white ">
            ORDER SUMMARY(3)
            <MdArrowForwardIos />
          </Link>
          <div className=" p-2 px-3 mt-2 justify-between font-medium">
            <p className="w-full flex items-center justify-between text-sm mb-1">
              Sub Total{" "}
              <span>
                ₹
                {orderData?.products?.reduce(
                  (acc, curr) => acc + curr?.product?.price * curr.quantity,
                  0
                )}
              </span>
            </p>
            <p className="w-full flex items-center justify-between text-sm">
              Delivery <span>₹{
           parseFloat( orderData?.shippingCost).toFixed(2)
              }</span>
            </p>
          </div>
          <h1 className="w-full p-2 px-3 flex items-center justify-between text-lg font-medium mt-3">
            Total <span>₹{
            parseFloat( orderData?.totalPrice).toFixed(2)
            }</span>
          </h1>
        </div>
      </div> */}
    </div>
  );
};

export default OrderConfirm;
