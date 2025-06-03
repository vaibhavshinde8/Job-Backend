import { Router } from "express";
import {Auth} from "../middelwares/auth.middelware.js";
import {book,getInterviwesByInterviwer,getInterviwesBystudent,addSlot} from '../controllers/interview.controllers.js'
const router=Router();
router.route('/book').post(Auth,book);
router.route('/add').post(Auth,addSlot)
router.route('/getInterviweStudent').get(Auth,getInterviwesBystudent);
router.route('/getInterviweInterviwer').get(Auth,getInterviwesByInterviwer)
export default router;