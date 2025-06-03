import {Router} from "express";
import {createUser,updateUser,educationalDetails,otherDetails,addProfilePic,addResume,isUserExist} from "../controllers/user.controllers.js";
import {Auth} from "../middelwares/auth.middelware.js";
import {upload} from "../middelwares/multer.middelware.js";
const router=Router();
router.route('/isUserExist').get(Auth,isUserExist);
router.route('/create').post(Auth,createUser);
router.route('/update').put(Auth,updateUser);
router.route('/educationalDetails').put(Auth,educationalDetails);
router.route('/otherDetails').put(Auth,otherDetails);
router.route('/profilePic').post(
    Auth,
    upload.fields([
      {
        name: 'profilePic',
        maxCount: 1
      }
    ]),
    addProfilePic
  );
  router.route('/resume').post(
    Auth,
    upload.fields([
        {
            name: 'resume',
            maxCount: 1
        }
        ]), 
    addResume
  );    
  export default router;