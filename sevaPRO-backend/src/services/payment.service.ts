export function createPaymentOrder(bookingId: string, amount: number) {
  return {
    orderId: `order_${bookingId}`,
    amount,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_local',
  };
}

export function verifyPaymentSignature() {
  return true;
}
