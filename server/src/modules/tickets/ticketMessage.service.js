import { ApiError } from "../../utils/ApiError.js";
import { ERROR_MESSAGES, USER_ROLES } from "./ticket.constants.js";
import Ticket from "./ticket.model.js";
import { validateTicketAccess } from "./ticketAccess.helper.js";
import TicketMessage from "./ticketMessage.model.js";

export const addTicketMessage = async ({
  ticketId,
  senderId,
  role,
  message,
}) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    isDeleted: false,
  });

  if (!ticket) {
    throw new ApiError(404, ERROR_MESSAGES.TICKET_NOT_FOUND);
  }

  if (role === USER_ROLES.CUSTOMER && !ticket.createdBy.equals(senderId)) {
    throw new ApiError(403, "You are not authorized to message on this ticket");
  }

  if (role === USER_ROLES.AGENT && !ticket.assignedTo?.equals(senderId)) {
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
  const ticket = await Ticket.findOne({
    _id: ticketId,
    isDeleted: false
  });

  if (!ticket) {
    throw new ApiError(404, ERROR_MESSAGES.TICKET_NOT_FOUND);
  }

  validateTicketAccess({ticket, userId, role});

  const messages = await TicketMessage.find({ ticket: ticketId })
    .populate("sender", "name email role")
    .sort({ createdAt: 1 }).lean();

  return messages;
};
