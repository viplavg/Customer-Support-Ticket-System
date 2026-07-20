import { ApiError } from "../../utils/ApiError.js";
import Ticket from "./ticket.model.js";
import { validateTicketAccess } from "./ticketAccess.helper.js";
import TicketMessage from "./ticketMessage.model.js";

export const addTicketMessage = async ({
  ticketId,
  senderId,
  role,
  message,
}) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  if (role === "CUSTOMER" && !ticket.createdBy.equals(senderId)) {
    throw new ApiError(403, "You are not authorized to message on this ticket");
  }

  if (role === "AGENT" && !ticket.assignedTo?.equals(senderId)) {
    throw new ApiError(403, "You are not authorized to message on this ticket");
  }

  const ticketMessage = await TicketMessage.create({
    ticket: ticketId,
    sender: senderId,
    message,
  });

  return ticketMessage;
};

export const getTicketMessages = async ({ ticketId, userId, role }) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  validateTicketAccess({ticket, userId, role});

  const messages = await TicketMessage.find({ ticket: ticketId })
    .populate("sender", "name email role")
    .sort({ createdAt: 1 });

  return messages;
};
