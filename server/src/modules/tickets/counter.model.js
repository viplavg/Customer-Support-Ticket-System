import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    sequenceValue: {
        type: Number,
        default: 0,
    },
},
{timestamps: true, versionKey: false}
);

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;