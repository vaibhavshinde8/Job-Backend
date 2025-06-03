import { Router } from "express";
import { getData,setData,getMarks,getTopRankedStudents,addInterviewRecording,getAllInterviewRecordings } from "../controllers/evaluation.controllers.js";
import { Auth } from "../middelwares/auth.middelware.js";
import { upload } from "../middelwares/multer.middelware.js";

const router=new Router()
router.route('/getData/:skill').get(getData);
router.route('/setData/:skill').post(setData)
router.route('/getMarks').get(Auth,getMarks)
router.route('/getTopRankedStudents').post(Auth,getTopRankedStudents)
router.post(
    '/uploadVideo',
    upload.fields([
      {
        name: 'video',
        maxCount: 1
      }
    ]),
    addInterviewRecording
  );
router.get('/getAllInterviewRecordings',getAllInterviewRecordings)
export default router;