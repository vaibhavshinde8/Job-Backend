import Router from "express";
import {createProfile, updateProfile, uploadWorkProof,addProfilePic,getProfile } from "../controllers/interviwer.controllers.js";
import {Auth} from "../middelwares/auth.middelware.js";
import {upload} from "../middelwares/multer.middelware.js";
const router=Router();
router.post("/create-profile",Auth,createProfile);
router.put("/update-profile",Auth,updateProfile);
router.post("/upload-work-proof",Auth,uploadWorkProof);
router.post("/add-profile-pic",Auth,upload.fields([
      {
        name: 'profilePic',
        maxCount: 1
      }
    ]),addProfilePic);
router.get("/get-profile",Auth,getProfile);
export default router;