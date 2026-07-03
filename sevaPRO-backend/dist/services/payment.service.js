"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentOrder = createPaymentOrder;
exports.verifyPaymentSignature = verifyPaymentSignature;
function createPaymentOrder(bookingId, amount) {
    return {
        orderId: `order_${bookingId}`,
        amount,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_local',
    };
}
function verifyPaymentSignature() {
    return true;
}
//# sourceMappingURL=payment.service.js.map