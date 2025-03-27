import mongoose from "mongoose";
import UserSchema from "./user.model";

export const User = mongoose.model("User", UserSchema);
