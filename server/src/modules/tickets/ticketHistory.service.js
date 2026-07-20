import Ticket from "./ticket.model.js";
import { validateTicketAccess } from "./ticketAccess.helper.js";
import TicketHistory from "./ticketHistory.model.js";

export const createTicketHistory = async ({
    ticket, performedBy, action, fromValue = null, toValue = null, metadata = {}
}) => {
    const history = await TicketHistory.create({
        ticket, performedBy, action, fromValue, toValue, metadata
    });
    return history;

}

export const getTicketHistory = async ({ ticketId, userId, role }) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  validateTicketAccess({ticket, userId, role});

  const history = await TicketHistory.find({ ticket: ticketId })
    .populate("performedBy", "name email role")
    .sort({ createdAt: 1 }).lean();

  return history;
};