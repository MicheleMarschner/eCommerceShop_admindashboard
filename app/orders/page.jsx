"use client";

import React, {useEffect, useState} from 'react'

import Layout from '../components/Layout'
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders')
      .then(res => {
        setOrders(res.data)
      });
  }, [])

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipients</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map(order => (
            <tr key={order._id}>
              <td>{(new Date(order.createdAt)).toLocaleString()}</td>
              <td className={order.paid ? 'bg-green-400' : 'bg-red-400'}>
                {order.paid ? 'YES' : 'NO'}
              </td>
              <td>
                {order.name} {order._id} <br />
                {order.city} {order.postalCode}
                {order.country} <br />
                {order.streetAddress}
              </td>
              <td>
                {order.line_items.map(l => (
                  <>
                    {l.price_data?.product_data.name} x 
                    {l.quantity} <br />
                  </>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

export default Orders
