import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AXIOS_INSTANCE } from "../service";
import OrderReject from "./OrderReject";

// const backend = "https://truwix-rm-rental-backend-dev.vercel.app"
const backend = "http://localhost:4000"

const OrderConfirm = () => {
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [successStatus, setSuccessStatus] = useState(false);
  const { transactionId } = useParams(); // Extract the id from the query params

  const fetchPaymentStatus = async () => {
    try {
      if (transactionId) {
        // Fetch the payment status from the backend
        const transactionresponse = await AXIOS_INSTANCE.get(`${backend}/api/order/status`, {
          params: { id: transactionId },
        });
        if (transactionresponse.data.success) {
          setSuccessStatus(true)
          setOrderData(transactionresponse.data.data);
        }else{
          setSuccessStatus(false)
        }
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, []);



  return (
    <div className="order-confirm w-full flex">
      {
        successStatus
        ? <div className="order-confirm-left flex flex-col items-center gap-12 py-20  w-full px-8 h-full bg-[#31c07e]">
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
                {new Date(orderData?.expectedDelivery).toLocaleDateString()}
              </span>
            </p>
            <Link className="text-[royalblue] underline">Track Your Order</Link>
          </div>
        </div>
      </div>
        : <OrderReject />
      }
    </div>
  );
};

export default OrderConfirm;
