import Job from "../models/jobPost.model.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { ApiError } from "../util/ApiError.js";
import {JobApplication} from "../models/jobApplication.model.js";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import JobPost from "../models/jobPost.model.js";

async function createJobPost(req, res) {
    try {
       // console.log("Creating job post...");
        const companyId = req.user._id;
        const company = await Company.findOne({authId:companyId});
        console.log(company);
        if (!company) {
            return res.status(404).json(new ApiError(404, "Company not found"));
        }

        const job = req.body;
        const newJob = new Job(job);
        
        newJob.companyId = company._id;
        newJob.companyName = company.companyName;
        console.log(company.companyName);
        console.log(newJob);
        await newJob.save();

        return res.status(201).json(new ApiResponse(201, newJob, "Job post created successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function updatePost(req, res) {
    try {
        const authId = req.user._id;
        const jobId = req.params.jobId;
        const job = req.body;
        const company = await Company.findOne({authId});
        console.log(company);
        if (!company) {
            return res.status(404).json(new ApiError(404, "Company not found"));
        }
        const companyId = company._id;
        console.log(jobId);
        const updatedJob = await Job.findOneAndUpdate(
            { _id: jobId },
            { $set: job },
            { new: true, runValidators: true } // return updated doc & validate schema
          );
        if (!updatedJob) {
            return res.status(404).json(new ApiError(404, "Job not found"));
        }

        return res.status(200).json(new ApiResponse(200, updatedJob, "Job updated successfully"));
    } catch (error) {
        console.log(error);
        return res.status
        (500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function getAllJobPostings(req, res) {
    try {
        const authId = req.user._id;
      //  console.log(authId);
        const company = await Company.findOne({authId});
      console.log(company);
        if (!company) {
            return res.status(404).json(new ApiError(404, "Company not found"));
        }
      const  companyId = company._id;
      console.log(companyId);
        const jobs = await Job.find({ 
            companyId:companyId });
        console.log(jobs);
        if (!jobs || jobs.length === 0) {
            return res.status(404).json(new ApiError(404, "No job posts found"));
        }

        return res.status(200).json(new ApiResponse(200, jobs, "Job posts retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function applyForJob(req, res) {
    try {
        const jobId = req.params.id;
        const authId = req.user._id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json(new ApiError(404, "Job not found"));
        }
        const user = await User.findOne({authId});
        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }
        console.log(user);
        const userId=user._id;
        console.log(userId);
        const application = new JobApplication({ userId, jobId,companyId:job.companyId, status: "applied" });
        await application.save();
        console.log(application)
        return res.status(201).json(new ApiResponse(201, application, "Job application submitted successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function getAllJobPosts(req, res) {
    try {
        const jobs = await Job.find({ isActive: true });
        const Auth = req.user._id;

        if (!jobs || jobs.length === 0) {
            return res.status(404).json(new ApiError(404, "No job posts found"));
        }
        const user=await User.findOne({authId:Auth});
        const userId=user?._id;
        // Get all applications by the user
        const jobApplications = await JobApplication.find({ userId: userId });

        // Extract jobIds the user has applied to
        const appliedJobIds = jobApplications.map(app => app.jobId.toString());

        // Add `applied` flag and optionally company logo to each job
        const enrichedJobs = await Promise.all(jobs.map(async (job) => {
            const jobObj = job.toObject();
            jobObj.applied = appliedJobIds.includes(job._id.toString());

            // Fetch and add company logo (optional)
            const company = await Company.findById(job.companyId).select('logo');
            jobObj.companyLogo = company?.logo || null;

            return jobObj;
        }));

        return res.status(200).json(new ApiResponse(200, enrichedJobs, "Job posts retrieved successfully"));

    } catch (error) {
        console.error("Error in getAllJobPosts:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}


async function getAppliedJobs(req, res) {
    try {
        const authId = req.user._id;
        const user = await User.find({ authId });
        if (!user) {

            return res.status(404).json(new ApiError(404, "User not found"));
        }
        const userId = user._id;
        const jobApplications = await JobApplication.find({ userId });

        if (!jobApplications || jobApplications.length === 0) {
            return res.status(404).json(new ApiError(404, "No job applications found"));
        }

        const jobIds = jobApplications.map(app => app.jobId);
        const jobs = await Job.find({ _id: { $in: jobIds } });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json(new ApiError(404, "No job application found"));
        }

        return res.status(200).json(new ApiResponse(200, jobs, "Job applications retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function getJobById(req, res) {
    try {
        const jobId = req.params.id;
        const userId = req.user._id;
      //  console.log("applied"+userId)
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json(new ApiError(404, "Job not found"));
        }
        const user=await User.findOne({authId:userId})
        // Check if user has applied to this job
        const application = await JobApplication.findOne({ userId: user._id,jobId:jobId});

        const jobObj = job.toObject(); // Convert Mongoose document to plain object
        jobObj.applied = !!application; // true if found, false otherwise
        console.log(application)
        return res.status(200).json(new ApiResponse(200, jobObj, "Job retrieved successfully"));
    } catch (error) {
        console.error("Error in getJobById:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}
async function getJobByIdCompany(req, res) {
    try {
        const jobId = req.params.id;
        const userId = req.user._id;
      //  console.log("applied"+userId)
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json(new ApiError(404, "Job not found"));
        }
        
        return res.status(200).json(new ApiResponse(200, job, "Job retrieved successfully"));
    } catch (error) {
        console.error("Error in getJobById:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function updateJobStatus(req, res) {
    try {
       // const companyId = req.user._id;
        const jobId = req.params.jobId;
        const { status } = req.body;
        console.log(status)
        const job = await JobPost.findById(jobId);
        if (!job) {
            return res.status(404).json(new ApiError(404, "Job not found"));
        }

        job.isActive = status;
        await job.save();

        return res.status(200).json(new ApiResponse(200, job, "Job status updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function updateApplicationStatus(req, res) {
    try {
        const jobId = req.params.jobId;
        const { userId, status } = req.body;
        console.log(jobId)
        //console.log(userId)
        let application = await JobApplication.findOne({ jobId:jobId, userId:userId });
        console.log(application)
        if (!application) {
            return res.status(404).json(new ApiError(404, "Application not found"));
        }

        application.status = status;
        await application.save();

        return res.status(200).json(new ApiResponse(200, application, "Application status updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function getAplliedusers(req, res) {
    try {
        const jobId = req.params.id;
        console.log("Fetching applied users for job:", jobId);

        // Get applications with status "applied"
        const applications = await JobApplication.find({ jobId, status: "applied" });
        console.log(applications)
        if (!applications || applications.length === 0) {
            return res.status(404).json(new ApiError(404, "No applications found"));
        }

        // Extract userIds from applications
            const userIds = applications.map(app => app.userId);

        // Fetch users by those userIds
        const users = await User.find({ _id: { $in: userIds } });

        if (!users || users.length === 0) {
            return res.status(404).json(new ApiError(404, "No users found"));
        }
        console.log(users)
        return res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
    } catch (error) {
        console.error("Error in getAppliedUsers:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function getSelectedUsers(req, res) {
    try {
        const jobId = req.params.id;
        const applications = await JobApplication.find({ jobId, status: "shortlisted" });

        if (!applications || applications.length === 0) {
            return res.status(404).json(new ApiError(404, "No selected applications found"));
        }

        const userIds = applications.map(app => app.userId);
        const users = await User.find({ _id: { $in: userIds } });

        return res.status(200).json(new ApiResponse(200, users, "Selected users retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function getRejectedUsers(req, res) {
    try {
        const jobId = req.params.id;
        const applications = await JobApplication.find({ jobId, status: "rejected" });

        if (!applications || applications.length === 0) {
            return res.status(404).json(new ApiError(404, "No rejected applications found"));
        }

        const userIds = applications.map(app => app.userId);
        const users = await User.find({ _id: { $in: userIds } });

        return res.status(200).json(new ApiResponse(200, users, "Rejected users retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function getAppliedJobsByUser(req, res) {
    try {
        const authId = req.user._id;
        const user = await User.findOne({ authId });

        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        const userId = user._id;

        // Get all applications by this user
        const applications = await JobApplication.find({ userId });

        if (!applications || applications.length === 0) {
            return res.status(404).json(new ApiError(404, "No applications found"));
        }

        const jobIds = applications.map(app => app.jobId);
        const jobs = await Job.find({ _id: { $in: jobIds } });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json(new ApiError(404, "No jobs found"));
        }

        // Create a map of jobId to application status
        const statusMap = {};
        applications.forEach(app => {
            statusMap[app.jobId.toString()] = app.status;
        });

        // Add status to each job
        const jobsWithStatus = jobs.map(job => {
            const jobObj = job.toObject();
            jobObj.applicationStatus = statusMap[job._id.toString()] || 'unknown';
            return jobObj;
        });

        return res.status(200).json(new ApiResponse(200, jobsWithStatus, "Jobs retrieved successfully"));
    } catch (error) {
        console.error("Error in getAppliedJobsByUser:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

async function searchJobs(req, res) {
    try {
        let { jobTitle } = req.body;

        if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim() === "") {
            return res.status(400).json(new ApiError(400, "Job title is required"));
        }

        jobTitle = jobTitle.trim();

        // Create a flexible regex to match keywords anywhere in the title
        const regex = new RegExp(jobTitle.split(' ').join('.*'), 'i');
        // For example: "mern developer" becomes /mern.*developer/i
       
        const jobs = await JobPost.find({
            JobTitle: { $regex: regex }
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json(new ApiError(404, "No jobs found"));
        }

        return res.status(200).json(new ApiResponse(200, jobs, "Jobs retrieved successfully"));
    } catch (error) {
        console.error("Error in searchJobs:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}
async function getLatestJobs(req,res){
   try {
    //get top 8 jobs nad send
    const jobs = await JobPost.find().sort({ createdAt: -1 }).limit(8);
    return res.status(200).json(new ApiResponse(200, jobs, "Latest jobs retrieved successfully"));
   } catch (error) {
    console.error("Error in searchJobs:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
   }
}


export {
    searchJobs,
    createJobPost,
    updatePost,
    getAllJobPostings,
    applyForJob,
    getAllJobPosts,
    getAppliedJobs,
    getJobById,
    updateJobStatus,
    updateApplicationStatus,
    getAplliedusers,
    getSelectedUsers,
    getRejectedUsers,
    getAppliedJobsByUser,
    getJobByIdCompany,
    getLatestJobs
};
