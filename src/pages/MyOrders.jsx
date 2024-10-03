import React, { useEffect, useState } from "react";
import userService from "../service/user.service";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const getMyOrders = async () => {
    try {
      const { data } = await userService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);
  return (
    <div>
      <h1>My Orders</h1>
      <div className="order-list">
        {orders.map((order) => (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Order Amount</th>
                <th>Status</th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toDateString()}</td>
                <td>Rs.{order.totalPrice}</td>
                <td>{order.status}</td>
                <td>
                  <button
                    onClick={() => {
                      navigate("/orderconfirm", {
                        state: { orderId: order._id },
                      });
                    }}
                    className="btn btn-primary"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}
