import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { USER_ROLES } from "../tickets/ticket.constants.js";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CUSTOMER,
  },
},{timestamps: true, versionKey: false});

userSchema.pre("save", async function() {
    try {
        if(!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        throw error;
    }
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function() {
    return jwt.sign(
        {
            id: this._id,
            role: this.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,

        }
    );
}

const User = mongoose.model("User", userSchema);

export default User;
