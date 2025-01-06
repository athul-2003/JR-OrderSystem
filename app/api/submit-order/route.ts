import { NextResponse } from 'next/server';
import { Order } from '@/lib/types';
import { sendEmail } from '@/lib/emailService';

function generateCustomerEmail(order: Order): { html: string; text: string } {
  const itemsDetailsHTML = order.items
    .map(
      (item) =>
        `<li>${item.product.name} (Quantity: ${item.quantity})</li>`
    )
    .join('');

  const itemsDetailsText = order.items
    .map(
      (item) => `- ${item.product.name} (Quantity: ${item.quantity})`
    )
    .join('\n');

  const html = `
    <p>Dear ${order.customerName},</p>
    <p>Thank you for your order with <strong>JR Medicare</strong>! Below are the details of your order:</p>
    <h3>Order Details:</h3>
    <ul>
      <li><strong>Email:</strong> ${order.customerEmail}</li>
      <li><strong>Phone:</strong> ${order.customerPhone}</li>
      <li><strong>Address:</strong> ${order.customerAddress}</li>
    </ul>
    <h3>Items Ordered:</h3>
    <ul>${itemsDetailsHTML}</ul>
    <p>We appreciate your business and look forward to serving you again soon!</p>
    <p>Best regards,<br>JR Medicare Team</p>
    <p><em>Note: An invoice will be sent to your email with payment information shortly.</em></p>
  `;

  const text = `
    Dear ${order.customerName},

    Thank you for your order with JR Medicare! Below are the details of your order:

    Order Details:
    - Email: ${order.customerEmail}
    - Phone: ${order.customerPhone}
    - Address: ${order.customerAddress}

    Items Ordered:
    ${itemsDetailsText}

    We appreciate your business and look forward to serving you again soon!

    Best regards,
    JR Medicare Team

    Note: An invoice will be sent to your email with payment information shortly.
  `;

  return { html, text };
}

function generateCompanyEmail(order: Order): { html: string; text: string } {
  const itemsDetailsHTML = order.items
    .map(
      (item) =>
        `<li>${item.product.name} (Quantity: ${item.quantity})</li>`
    )
    .join('');

  const itemsDetailsText = order.items
    .map(
      (item) => `- ${item.product.name} (Quantity: ${item.quantity})`
    )
    .join('\n');

  const html = `
    <p><strong>New Order Received</strong></p>
    <h3>Customer Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${order.customerName}</li>
      <li><strong>Email:</strong> ${order.customerEmail}</li>
      <li><strong>Phone:</strong> ${order.customerPhone}</li>
      <li><strong>Address:</strong> ${order.customerAddress}</li>
    </ul>
    <h3>Items Ordered:</h3>
    <ul>${itemsDetailsHTML}</ul>
    <p>Please process the order as soon as possible.</p>
  `;

  const text = `
    New Order Received

    Customer Details:
    - Name: ${order.customerName}
    - Email: ${order.customerEmail}
    - Phone: ${order.customerPhone}
    - Address: ${order.customerAddress}

    Items Ordered:
    ${itemsDetailsText}

    Please process the order as soon as possible.
  `;

  return { html, text };
}

export async function POST(request: Request) {
  const order: Order = await request.json();
  const customerEmailContent = generateCustomerEmail(order);
  const companyEmailContent = generateCompanyEmail(order);

  // Send email to customer
  await sendEmail(
    order.customerEmail,
    'Your Order Confirmation - JR Medicare',
    customerEmailContent.text
  );

  // Send email to company
  const companyEmail = 'hathulkrishnanvastgcsj@gmail.com'; // Replace with the company's email address
  await sendEmail(
    companyEmail,
    'New Order Received - JR Medicare',
    companyEmailContent.text
  );

  return NextResponse.json({ message: 'Order submitted successfully' });
}
