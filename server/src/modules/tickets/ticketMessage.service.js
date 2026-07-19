import Ticket from "./ticket.model.js";
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
