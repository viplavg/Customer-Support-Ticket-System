import mongoose, {Schema} from "mongoose";
import { TICKET_STATUS_VALUES, PRIORITIES, CATEGORIES } from "./ticket.constants.js";

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
        enum: Object.values(TICKET_STATUS_VALUES),
        default: TICKET_STATUS_VALUES.OPEN
    },
    priority: {
        type: String,
        enum: Object.values(PRIORITIES),
        default: PRIORITIES.MEDIUM,
    },
    category: {
        type: String,
        enum: Object.values(CATEGORIES),
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
    versionKey: false,
}
);

ticketSchema.index({
  createdBy: 1,
  isDeleted: 1,
  createdAt: -1,
});

ticketSchema.index({
  assignedTo: 1,
  isDeleted: 1,
  createdAt: -1,
});

ticketSchema.index({
  isDeleted: 1,
  status: 1,
  priority: 1,
  createdAt: -1,
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;