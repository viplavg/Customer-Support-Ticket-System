import Counter from "./counter.model.js";
import Ticket from "./ticket.model.js";
import User from "../../modules/users/user.model.js";
import {ApiError} from "../../utils/ApiError.js";
import { ACCESS_DENIED } from "./ticket.constants.js";

export const getNextTicketNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { key: "ticket" },
    {
      $inc: { sequenceValue: 1 },
    },
    { new: true, upsert: true },
  );
  const formattedSequence = String(counter.sequenceValue).padStart(6, "0");
  return `TKT-${formattedSequence}`;
};

export const createTicket = async ({title, description, priority, category, createdBy}) => {
    const ticketNumber = await getNextTicketNumber();
    const ticket = await Ticket.create({
        ticketNumber,
        title,
        description,
        priority,
        category,
        createdBy
    });
    return ticket;
}

export const getTickets = async({userId, role}) => {
  let query = {};
  if(role === "CUSTOMER") {
    query.createdBy = userId;
  } else if(role === "AGENT") {
    query.assignedTo = userId;
  }
  const tickets = await Ticket.find(query);
  return tickets;
}

export const getTicketById = async ({ticketId, userId, role}) => {
    const ticket = await Ticket.findById(ticketId);

    if(!ticket) {
      throw new ApiError(404, "Ticket not found");
    }

    if(role === "ADMIN"){
      return ticket;
    }

    if(role === "CUSTOMER" && !ticket.createdBy.equals(userId)){
      throw new ApiError(403, ACCESS_DENIED);
    }

    if(role === "AGENT" && !ticket.assignedTo?.equals(userId)) {
      throw new ApiError(403, ACCESS_DENIED);
    }

    return ticket;
}

export const assignTicket = async({
  ticketId, agentId
}) => {
  const ticket = await Ticket.findById(ticketId);

  if(!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  const agent = await User.findById(agentId);

  if(!agent) {
    throw new ApiError(404, "Agent not found");
  }

  if(agent.role !== "AGENT") {
    throw new ApiError(400, "Selected user is not an agent");
  }

  ticket.assignedTo = agentId;
  await ticket.save();
  return ticket;

}