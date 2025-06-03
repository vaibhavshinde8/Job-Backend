import {Auth} from "../middelwares/auth.middelware.js";
import {upload} from "../middelwares/multer.middelware.js";
import {Router} from "express";
import {createJobPost, updatePost,getAllJobPostings,applyForJob,getAllJobPosts,getAppliedJobs,getJobById,updateJobStatus,
    updateApplicationStatus,
    getAplliedusers,
    getSelectedUsers,
    searchJobs,
    getRejectedUsers,
    getAppliedJobsByUser,getJobByIdCompany,getLatestJobs} from "../controllers/job.controllers.js";
const router=Router();
router.route('/create').post(Auth,createJobPost);
router.route('/update/:jobId').put(Auth,updatePost);
router.route('/getAll').get(Auth,getAllJobPostings);
router.route('/apply/:id').post(Auth,applyForJob);
router.route('/getAllPost').get(Auth,getAllJobPosts);
router.route('/getAppliedJobs').get(Auth,getAppliedJobs);
router.route('/getJobById/:id').get(Auth,getJobById);
router.route('/updateJobStatus/:jobId').put(Auth,updateJobStatus);
router.route('/updateApplicationStatus/:jobId').put(Auth,updateApplicationStatus);
router.route('/getAppliedJobsByUser').get(Auth,getAppliedJobsByUser);
router.route('/getAplliedusers/:id').get(Auth,getAplliedusers);
router.route('/getSelectedUsers/:id').get(Auth,getSelectedUsers);
router.route('/getRejectedUsers/:id').get(Auth,getRejectedUsers);
router.route('/search').post(Auth,searchJobs);
router.route('/getJobByIdCompany/:id').get(Auth,getJobByIdCompany);
router.route('/getLatestJobs').get(getLatestJobs);
export default router;