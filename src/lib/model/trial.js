import mongoose from "mongoose";

const trialModel = new mongoose.Schema({
    username: String,
    password: String,
    isVerified: Boolean,
});
export const Users = mongoose.models.users || mongoose.model("users", trialModel);