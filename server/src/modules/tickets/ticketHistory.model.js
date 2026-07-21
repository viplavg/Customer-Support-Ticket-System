import mongoose from "mongoose";
import { TICKET_HISTORY_ACTIONS } from "./ticket.constants.js";

const ticketHistorySchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: Object.values(TICKET_HISTORY_ACTIONS),
      required: true,
    },

    fromValue: {
      type: String,
      default: null,
    },

    toValue: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ticketHistorySchema.index({ticket: 1, createdAt: -1});

const TicketHistory = mongoose.model("TicketHistory", ticketHistorySchema);

export default TicketHistory;