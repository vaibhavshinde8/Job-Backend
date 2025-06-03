import Router from "express";
import { createOrder,verify,paymentFailed,getPaymentHistory} from "../controllers/payment.cntrollers.js";
import { Auth } from "../middelwares/auth.middelware.js";
const router=Router()
router.route('/create-order').post(Auth,createOrder)
router.route('/verify').post(Auth,verify)
router.route('/payment-failed').post(Auth,paymentFailed)
router.route('/get-payment-history').get(Auth,getPaymentHistory)
export default router;