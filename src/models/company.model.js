import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
    authId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'auth', required: true

    },
    companyName: { type: String, required: true, unique: true },
    locations: [{ type: String }],// // Branches of the company
    email: { type: String, required: true }, // General company email
    contactNumber: { type: String }, // General company phone
    hrName: { type: String },         // HR contact person
    hrEmail: { type: String },        // HR email
    hrPhone: { type: String },        // HR phone number
    description: { type: String },
    tech: [{ type: String }],         // Tech stack
    members: { type: Number },        // Total employees
    websiteLink: { type: String },
    establishment: { type: Number },  // Year of establishment
    logo: { type: String },           // URL or path to the logo
},{ timestamps: true });

const Company = mongoose.model("Company", companySchema);
export default Company;