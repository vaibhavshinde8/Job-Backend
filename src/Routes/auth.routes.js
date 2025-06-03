import {Router} from "express";
import {Register,Login,resetPassword,googleLogin,googleRegister,isRegisterd,logout} from "../controllers/auth.controllers.js";
import {Auth} from "../middelwares/auth.middelware.js"

const router=Router();
router.route('/register').post(Register);
router.route('/google-register').post(googleRegister);
router.route('/google-login').post(googleLogin);
router.route('/login').post(Login);
router.route('/resetpassword').post(resetPassword);
router.route('/isRegisterd').post(isRegisterd);
router.route('/logout').get(Auth,logout)
export default router