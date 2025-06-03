import mongoose from 'mongoose';
const PaymentSchema =  new mongoose.Schema({
    orderId: String,
    paymentId: String,
    signature: String,
    status: String,
    amount: Number,
    email: String,
    name: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;