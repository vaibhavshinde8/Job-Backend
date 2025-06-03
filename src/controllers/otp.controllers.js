import { ApiResponse } from "../util/ApiResponse.js";
import { ApiError } from "../util/ApiError.js";
import { Otp} from '../models/otp.model.js';
import Email from "../util/Email.js";
async function sendOtp(req,res){
    try{
        //console.log(req.body);
        let email=req.body.email;

    //  console.log(email);
        let Createdotp=Math.floor(100000 + Math.random() * 900000);
        Email(email,"OTP for account verification",`Your OTP is ${Createdotp}`);
        const otpCreated= await Otp.create({email,otp:Createdotp});
        console.log(otpCreated);
        if(!otpCreated) return res.status(400).json(new ApiError(108,"try again"));
        return res.status(200).json(new ApiResponse(200,"OTP sent successfully"));
    }
    catch(error){
        console.log(error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}
async function verifyOtp(req,res){
    try{
        let {email,otp}=req.body;
        const existedOtp=await Otp.findOne({email});
        if(!existedOtp) return res.status(400).json(new ApiError(109,"OTP not found"));
        if(existedOtp.otp!==otp) return res.status(400).json(new ApiError(110,"OTP not matched"));
        return res.status(200).json(new ApiResponse(200,"OTP verified successfully"));
    }
    catch(error){
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}
export {sendOtp,verifyOtp};