import mongoose, { Schema } from "mongoose";

const ticketMessageSchema = new Schema({
    ticket: {
        type: Schema.Types.ObjectId,
        ref: "Ticket",
        reuired: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
}, {timestamps: true, versionKey: false});

const TicketMessage = mongoose.model("TicketMessage", ticketMessageSchema);

export default TicketMessage;