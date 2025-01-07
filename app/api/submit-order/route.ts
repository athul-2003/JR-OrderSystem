import { NextResponse } from 'next/server';
import { Order } from '@/lib/types';
import { sendEmail } from '@/lib/emailService';

function generateCustomerEmail(order: Order): string {
  const itemsDetails = order.items.map(item => `
    - ${item.product.name} (Quantity: ${item.quantity})
  `).join('\n');

  return `
    Dear ${order.customerName},

    Thank you for your order with JR Medicare! Below are the details of your order:

    Order Details:
    - Email: ${order.customerEmail}
    - Phone: ${order.customerPhone}
    - Address: ${order.customerAddress}

    Items Ordered:
    ${itemsDetails}

    Our sales team will contact you shortly to confirm the order and provide payment details.

    Best regards,
    JR Medicare
  `;
}

function generateCompanyEmail(order: Order): string {
  const itemsDetails = order.items.map(item => `
    - ${item.product.name} (Quantity: ${item.quantity})
  `).join('\n');

  return `
    New Order Received

    Customer Details:
    - Name: ${order.customerName}
    - Email: ${order.customerEmail}
    - Phone: ${order.customerPhone}
    - Address: ${order.customerAddress}

    Items Ordered:
    ${itemsDetails}

    Please process the order as soon as possible.
  `;
}

export async function POST(request: Request) {
  const order: Order = await request.json();
  const customerEmailContent = generateCustomerEmail(order);
  const companyEmailContent = generateCompanyEmail(order);

  // Send email to customer
  await sendEmail(order.customerEmail, 'Your Order Confirmation - JR Medicare', customerEmailContent);

  // Send email to company
  const companyEmail = 'hathulkrishnanvastgcsj@gmail.com'; // Replace with the company's email address
  await sendEmail(companyEmail, 'New Order Received - JR Medicare', companyEmailContent);

  return NextResponse.json({ message: 'Order submitted successfully' });
}