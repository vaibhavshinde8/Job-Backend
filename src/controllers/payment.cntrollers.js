import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import { auth as Auth } from "../models/auth.model.js";
console.log(process.env.RAZAR_KEY_ID, process.env.RAZAR_KEY_SECRET)
const razorpay = new Razorpay({
  key_id: process.env.ROZAR_API_KEY,
  key_secret: process.env.ROZAR_API_SECRET,
});

const createOrder = async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(new ApiResponse(true, order, "Order created successfully"));
  } catch (err) {
    res.status(500).json(new ApiError("Failed to create order", err));
  }
}
const verify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,amount } = req.body;
    const AuthId = req.user._id;
    console.log("Auth" + AuthId)
    if (!AuthId) {
      return res.status(401).json(new ApiError("Unauthorized access"));
    }
    const auth = await Auth.findById(AuthId);
    if (!auth) {
      return res.status(404).json(new ApiError("User not found"));
    }
    if (!razorpay_order_id || !razorpay_payment_id ||!amount || !razorpay_signature) {
      return res.status(400).json(new ApiError("Missing required parameters"));
    }
    const email = auth.email;
    const hmac = crypto.createHmac("sha256", process.env.ROZAR_API_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");
    console.log(razorpay_signature)
    console.log(generated_signature)
    const isAuthentic = generated_signature === razorpay_signature;

    const payment = new Payment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: isAuthentic ? "success" : "failed",
      amount: amount*100, // you can pass this in body or query
      email, // you can pass these from frontend

    });

    await payment.save();

    if (isAuthentic) {
      res.status(200).json(new ApiResponse(true, payment, "Payment verified and saved successfully"));
    } else {
      res.status(400).json(new ApiError("Payment verification failed", null, "Payment verification failed"));
    }
  } catch (error) {
    res.status(500).json(new ApiError("Failed to verify payment", error));

  }
}
const paymentFailed = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const payment = new Payment({
      orderId,
      status: "failed",
      reason,
      createdAt: new Date(),
    });

    await payment.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save payment" });

  }
}
  const getPaymentHistory=async (req, res) => {
    try {
        const authId=req.user._id;
        const auth=await Auth.findById(authId);
        if(!auth){
            return res.status(404).json(new ApiError("User not found"));
        }
        const email=auth.email;
        const payments = await Payment.find({ email }).sort({ createdAt: -1 });
        res.status(200).json(new ApiResponse(true, payments, "Payment history fetched successfully"));
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to save payment" });
    }
  }
export { createOrder, verify, paymentFailed,getPaymentHistory };