import { ApiResponse } from "../util/ApiResponse.js";
import { ApiError } from "../util/ApiError.js";
import {uploadOnCloudinary} from "../util/Cloudnary.js"
import Company from "../models/company.model.js";
import  {auth as Auth}  from "../models/auth.model.js";
async function isUserExist(req,res){
    try{
        const authId=req.user._id;
        //check if user exists
        const auth=await Auth.findById(authId).select("-password -refreshToken");
        console.log(auth);
        if(!auth){
            return res.status(404).json(new ApiError(404, "User not found."));
        }
        //check if company exists
        const company=await Company.findOne({authId:authId});
        console.log(company);
        if(!company){
            return res.status(404).json(new ApiError(404, "Company not found."));
        }
        return res.status(200).json(new ApiResponse(200,"User and company exist", {company:company}));
    }
    catch(error){
        console.log(error);
        return res.status(500).json(new ApiError("Internal Server Error", error.message));
    }
}
async function createCompanyDetails(req,res){
    try {
      let  authId=req.user._id;
      console.log("authId",authId);
        //check if company already exists
        const auth=await Auth.findById(authId).select("-password -refreshToken");
        console.log(auth);
        const email=auth.email;
        const companyExist=await Company.findOne({where:{authId:authId}});

        if(companyExist){
            return res.status(400).json(new ApiError(400, "Company already exists."));
        }
        const{ companyName,contactNumber}=req.body;
        if(!companyName  || !contactNumber){
            return res.status(400).json(new ApiError("Bad Request", "Please fill all the required fields."));
        }
        const details=req.body;
        details.email=email;
        //create company object
        const company = new Company({
           ...details,
            authId:authId
        })
        //save company to database
        const savedCompany=await company.save();
        return res.status(200).json(new ApiResponse("Company created successfully", savedCompany));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError("Internal Server Error", error.message));
    }
}
async function hrDetail(req,res){
    try {
        const authId=req.user._id;
        const {hrName,hrEmail,hrPhone}=req.body;
        if(!hrName || !hrEmail || !hrPhone){
            return res.status(400).json(new ApiError("Bad Request", "Please fill all the required fields."));
        }
        //update hr details
        const updatedCompany=await Company.findOneAndUpdate({authId:authId},{$set:{hrName:hrName,hrEmail:hrEmail,hrPhone:hrPhone}},{new:true});
        return res.status(200).json(new ApiResponse("HR details updated successfully", updatedCompany));
    } catch (error) {
        return res.status(500).json(new ApiError("Internal Server Error", error.message));
    }
}
async function addLogo(req,res){
    try{
        const authId=req.user._id;
        console.log(req.files)
        const logo=req.files?.logo[0].path;
       // console.log(logo)
        if(!logo){
            return res.status(400).json(new ApiError("Bad Request", "Please upload a logo."));
        }
        //upload logo to cloudinary
        const result=await uploadOnCloudinary(logo);
        //update logo in database
        const updatedCompany=await Company.findOneAndUpdate({authId:authId},{$set:{logo:result.secure_url}},{new:true});
        return res.status(200).json(new ApiResponse("Logo uploaded successfully", updatedCompany));
    }catch(error){
        console.log(error);
        return res.status(500).json(new ApiError("Internal Server Error", error.message));
    }
}
async function updateCompanyDeatils(req, res) {
    try {
      const authId = req.user._id;
      const details = req.body;
        console.log("details",details);
        console.log("authId",authId);
      const updatedCompany = await Company.findOneAndUpdate(
        { authId: authId },
        { $set: { ...details } },
        { new: true, runValidators: true }
      );
  
      console.log(updatedCompany);
  
      if (!updatedCompany) {
        return res.status(404).json(new ApiError(404, "Company not found."));
      }
  
      return res
        .status(200)
        .json(new ApiResponse("Company details updated successfully", updatedCompany));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Internal Server Error", error.message));
    }
  }
  
export {createCompanyDetails,hrDetail,addLogo,updateCompanyDeatils,isUserExist};