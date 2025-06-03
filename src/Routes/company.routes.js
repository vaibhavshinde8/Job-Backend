import {Router} from "express";
import {createCompanyDetails,hrDetail,addLogo,updateCompanyDeatils,isUserExist} from "../controllers/company.controllers.js";
import {Auth} from "../middelwares/auth.middelware.js";
import {upload} from "../middelwares/multer.middelware.js";
const router=Router();
router.route('/create').post(Auth,createCompanyDetails);
router.route('/hr').post(Auth,hrDetail);
router.route('/logo').post(
    Auth,
    upload.fields([
      {
        name: 'logo',
        maxCount: 1
      }
    ]),
    addLogo
  );
  
router.route('/update').put(Auth,updateCompanyDeatils);
router.route('/exist').get(Auth,isUserExist);
export default router;