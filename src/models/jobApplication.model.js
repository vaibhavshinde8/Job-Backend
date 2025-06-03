import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'cser', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobPost', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'company', required: true },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected','selected'],
    required: true,
    default: 'applied'
  },
  appliedAt: { type: Date, default: Date.now }
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export{ JobApplication};