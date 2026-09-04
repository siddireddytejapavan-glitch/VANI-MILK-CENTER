export interface OrderItemFormat {
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderWhatsAppDetails {
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItemFormat[];
  totalAmount: number;
  notes?: string | null;
  orderId?: string;
}

export function cleanWhatsAppNumber(num: string): string {
  // Strip all non-numeric characters
  const digits = num.replace(/\D/g, '');
  // If user enters 10 digits e.g. 9876543210 in India, prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderWhatsAppMessage(details: OrderWhatsAppDetails): string {
  let msg = `*New Dairy Product Order*\n`;
  if (details.orderId) {
    msg += `Order Ref: #${details.orderId.slice(-6).toUpperCase()}\n`;
  }
  msg += `*Customer Name:* ${details.customerName}\n`;
  msg += `*Mobile:* ${details.customerPhone}\n`;
  msg += `*Address:* ${details.address}\n\n`;

  msg += `*Products:*\n`;
  details.items.forEach((item, index) => {
    msg += `${index + 1}. *${item.productName}*\n`;
    msg += `   Pack Size: ${item.packSize}\n`;
    msg += `   Quantity: ${item.quantity}\n`;
    msg += `   Price: ${formatCurrencyINR(item.unitPrice)}\n`;
    msg += `   Total: ${formatCurrencyINR(item.totalPrice)}\n\n`;
  });

  msg += `*Order Total:* ${formatCurrencyINR(details.totalAmount)}\n`;

  if (details.notes && details.notes.trim()) {
    msg += `\n*Special Instructions:*\n${details.notes.trim()}\n`;
  }

  msg += `\nThank you for choosing our fresh dairy shop!`;
  return msg;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  messageText: string
): string {
  const cleanNumber = cleanWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function generateEnquiryWhatsAppLink(phoneNumber: string): string {
  const cleanNumber = cleanWhatsAppNumber(phoneNumber);
  const message = 'Hello, I would like to enquire about your dairy products.';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
