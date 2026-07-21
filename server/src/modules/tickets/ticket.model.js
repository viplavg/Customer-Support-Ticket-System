import mongoose, {Schema} from "mongoose";

const ticketSchema = new Schema({
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 150,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 3000,
    },
    status: {
        type: String,
        enum: [
            "OPEN",
            "IN_PROGRESS",
            "WAITING_FOR_CUSTOMER",
            "RESOLVED",
            "CLOSED",
        ],
        default: "OPEN"
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
        default: "MEDIUM",
    },
    category: {
        type: String,
        enum: [
            "TECHNICAL",
            "ACCOUNT",
            "BILLING",
            "FEATURE_REQUEST",
            "GENERAL"
        ],
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true,
}
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;