import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                { headers: { token } }
            );
            console.log('API Response:', response.data);
            setData(response.data.data || []); // Fallback to an empty array if undefined
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {data.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    data.map((order, index) => (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="Parcel" />
                            <p>
                                {order.items &&
                                    order.items.map((item, index) => {
                                        if (index === order.items.length - 1) {
                                            return item.name + ' x ' + item.quantity;
                                        } else {
                                            return item.name + ' x ' + item.quantity + ', ';
                                        }
                                    })}
                            </p>
                            <p>${order.amount || 0}.00</p>
                            <p>Items: {order.items ? order.items.length : 0}</p>
                            <p>
                                <span>&#x25cf;</span> <b>{order.status || 'Unknown Status'}</b>
                            </p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
