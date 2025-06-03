import { auth } from "../models/auth.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import jwt from "jsonwebtoken";
async function Auth(req,res,next){
    try {
        const refreshToken = req.cookies?.refreshToken;
        const accessToken = req.cookies?.accessToken;
        console.log("ABhi")

          
        if(accessToken) {
            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            console.log(user);
            if (!user) return res.status(401).json(new ApiError(401, "Unauthorized"));
            req.user = user;
            return next();
        }
        if (refreshToken) {
            console.log(refreshToken)
            const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log(token);
            if (token) {
                const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const existedUser = await auth.findById(user._id).select("-password -refreshToken");
                if (!existedUser) return res.status(404).json(new ApiError(404, "Unauthorized"));
                const newAccessToken = existedUser.generateAccessToken();
                return res.cookie("accessToken", newAccessToken, { httpOnly: true })
                    .status(204).json(new ApiResponse({ status: 204, message: "Access token generated successfully" }))
            }
            else return res.status(404).json(new ApiError(404, "Unauthorized"));

        }
        return res.status(404).json(new ApiError(404, "Unauthorized"));
    } catch (error) {
        console.log("error in auth middleware",error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));

    }}

export { Auth};
