'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import ProductSelect from '../components/ProductSelect';
import { Product, OrderItem, Order } from '../lib/types';

export default function Home() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleAddProduct = (product: Product, quantity: number) => {
    setOrderItems([...orderItems, { product, quantity }]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus('submitting');

    const order: Order = {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items: orderItems,
    };

    // ...existing code...
try {
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  const data = await response.json();

  if (response.ok) {
    setOrderStatus('success');
    setStatusMessage(data.message);
    setOrderItems([]);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerAddress('');
  } else {
    setOrderStatus('error');
    setStatusMessage(data.message);
  }
} catch (error) {
  console.error(error);
  setOrderStatus('error');
  setStatusMessage('An error occurred while processing your order.');
}
// ...existing code...
  };

  return (
    <main className="container">
      {/* <h1>JR Medicare Order Form</h1> */}
      <div className="flex items-center  mb-4 LogoTitle">
      <Image 
  src="/logo.jpg" 
  alt="JR Medicare Logo" 
  width={60} 
  height={60} 
  className="!rounded-full border border-gray-300 shadow-md logo-img"
/>
  <h1 className="text-2xl font-bold">JR Medicare Order Form</h1>
</div>

      <form onSubmit={handleSubmitOrder} className="form-group">
        <div>
          <label htmlFor="customerName">Customer Name:</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="customerEmail">Customer Email:</label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="customerPhone">Customer Phone:</label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="customerAddress">Customer Address:</label>
          <input
            id="customerAddress"
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            required
          />
        </div>
        <div className="instructions">
          <h3 className="font-bold mb-2">Instructions:</h3>
          <ul className="list-disc list-inside">
            <li>Fill in all required customer information.</li>
            <li>Add products to your order using the dropdown and quantity field.</li>
            <li>Review your order summary before submitting.</li>
            <li>Click "Place Order" to submit your order and wait for confirmation message.</li>
            <li>You will receive a confirmation email once your order is processed.</li>
          </ul>
        </div>
        <div className="AddProducts-section">
          <h2>Add Products</h2>
          <ProductSelect onSelect={handleAddProduct} />
        </div>
        <div className="OrderSummary-section">
          <h2>Order Summary</h2>
          {orderItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2 individual-product">
              <span>{item.product.name} x {item.quantity}</span>
              <button onClick={() => handleRemoveItem(index)} className="text-red-500">Remove</button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={orderItems.length === 0 || orderStatus === 'submitting'}
        >
          {orderStatus === 'submitting' ? 'Submitting...' : 'Place Order'}
        </button>
      </form>
      {orderStatus === 'success' && (
        <div className="success-message">
        <p className="font-bold mb-2">Order Submitted Successfully</p>
        <p>Thank you for your order. What happens next:</p>
        <ol className="list-decimal list-inside mt-2">
          <li>You will receive a confirmation email shortly.</li>
          <li>Our team will process your order within the next 24 hours.</li>
          <li>You will receive another email with invoice and payment information.</li>
          <li>If you have any questions or need further assistance, please do not hesitate to contact us</li>
        </ol>
        <p>Best regards,<br />JR Medicare Team</p>
      </div>
      )}
      {orderStatus === 'error' && (
        <div className="error-message">
          {statusMessage}
        </div>
      )}
    </main>
  );
}







