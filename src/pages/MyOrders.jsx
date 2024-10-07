import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaShoppingBag, FaIdCard } from "react-icons/fa";
import storageService from "../service/storage.service";
import userService from "../service/user.service"; // Import userService for orders

const MyOrders = () => {
  const [activeLink, setActiveLink] = useState("");
  const user = storageService.get("user");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ClickHandler = (link) => {
    setActiveLink(link);
  };

  const fetchOrders = async () => {
    try {
      const { data } = await userService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Set active link to "My Orders" when component mounts
  useEffect(() => {
    fetchOrders();
    setActiveLink("My Orders"); // Set active link as "My Orders"
  }, []);

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
              { icon: <FaShoppingBag />, name: "My Orders", url: "/myorders" },
              { icon: <FaIdCard />, name: "KYC", url: "/kyc" },
              //   { icon: <FaAddressBook />, name: "Address", url: "/address" },
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
      <div className="flex justify-between sm:w-full md:w-[76%] p-8 bg-white shadow-md shadow-[#dadada] rounded-lg">
        {loading ? (
          <p>Loading Orders...</p>
        ) : (
          <div className="flex flex-col items-start w-full">
            <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
            {orders.length > 0 ? (
              <div className="order-list w-full">
                <div className="overflow-x-auto">
                  {orders.map((order) => (
                    <table key={order?._id} className="table-auto w-full mb-4">
                      <thead>
                        <tr>
                          <th className="w-1/5 px-3">Order ID</th>{" "}
                          {/* Added px-2 */}
                          <th className="w-1/5 px-3">Order Date</th>{" "}
                          {/* Added px-2 */}
                          <th className="w-1/5 px-3">Order Amount</th>{" "}
                          {/* Added px-2 */}
                          <th className="w-1/5 px-3">Status</th>{" "}
                          {/* Added px-2 */}
                          <th className="w-1/5 px-3">Action</th>{" "}
                          {/* Added px-2 */}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="whitespace-nowrap px-3">
                            {order._id}
                          </td>{" "}
                          {/* Added px-2 */}
                          <td className="whitespace-nowrap px-3">
                            {new Date(order.createdAt).toDateString()}
                          </td>{" "}
                          {/* Added px-2 */}
                          <td className="whitespace-nowrap px-3">
                            Rs.{order.totalPrice}
                          </td>{" "}
                          {/* Added px-2 */}
                          <td className="whitespace-nowrap px-3">
                            {order.status}
                          </td>{" "}
                          {/* Added px-2 */}
                          <td>
                            <button
                              onClick={() => {
                                navigate("/orderconfirm", {
                                  state: { orderId: order._id },
                                });
                              }}
                              className="btn btn-primary"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ))}
                </div>
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
