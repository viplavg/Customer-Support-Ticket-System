import Counter from "./counter.model.js";
import Ticket from "./ticket.model.js";
import User from "../../modules/users/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ERROR_MESSAGES, USER_ROLES, TICKET_HISTORY_ACTIONS, TICKET_STATUS_VALUES } from "./ticket.constants.js";
import { createTicketHistory } from "./ticketHistory.service.js";
import { validateTicketAccess } from "./ticketAccess.helper.js";

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

export const createTicket = async ({
  title,
  description,
  priority,
  category,
  createdBy,
}) => {
  const ticketNumber = await getNextTicketNumber();
  const ticket = await Ticket.create({
    ticketNumber,
    title,
    description,
    priority,
    category,
    createdBy,
  });
  await createTicketHistory({
    ticket: ticket._id,
    performedBy: createdBy,
    action: TICKET_HISTORY_ACTIONS.TICKET_CREATED,
    fromValue: null,
    toValue: null,
    metadata: {
      ticketNumber: ticket.ticketNumber,
    },
  });
  return ticket;
};

export const getTickets = async ({
  userId,
  role,
  page,
  limit,
  sortBy,
  order,
  status,
  priority,
  category,
  search,
}) => {
  let query = {
    isDeleted: false,
  };
  const skip = (page - 1) * limit;
  if (role === USER_ROLES.CUSTOMER) {
    query.createdBy = userId;
  } else if (role === USER_ROLES.AGENT) {
    query.assignedTo = userId;
  }
  if (status) {
    query.status = status;
  }
  if (priority) {
    query.priority = priority;
  }
  if (category) {
    query.category = category;
  }
  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        ticketNumber: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  console.log(query);

  const totalRecords = await Ticket.countDocuments(query);
  const totalPages = Math.ceil(totalRecords / limit);
  const sortOrder = order === "desc" ? -1 : 1;
  const tickets = await Ticket.find(query)
    .sort({
      [sortBy]: sortOrder,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    tickets,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
    },
  };
};

export const getTicketById = async ({ ticketId, userId, role }) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    isDeleted: false,
  });

  if (!ticket) {
    throw new ApiError(404, ERROR_MESSAGES.TICKET_NOT_FOUND);
  }

  if (role === USER_ROLES.ADMIN) {
    return ticket;
  }

  if (role === USER_ROLES.CUSTOMER && !ticket.createdBy.equals(userId)) {
    throw new ApiError(403, ERROR_MESSAGES.ACCESS_DENIED);
  }

  if (role === USER_ROLES.AGENT && !ticket.assignedTo?.equals(userId)) {
    throw new ApiError(403, ERROR_MESSAGES.ACCESS_DENIED);
  }

  return ticket;
};

export const assignTicket = async ({ ticketId, agentId, assignedBy }) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    isDeleted: false,
  });

  if (!ticket) {
    throw new ApiError(404, ERROR_MESSAGES.TICKET_NOT_FOUND);
  }

  const agent = await User.findById(agentId);

  if (!agent) {
    throw new ApiError(404, "Agent not found");
  }

  if (agent.role !== USER_ROLES.AGENT) {
    throw new ApiError(400, "Selected user is not an agent");
  }

  if (ticket.assignedTo?.equals(agentId)) {
    throw new ApiError(400, "Ticket is already assigned to this agent");
  }

  const previousAgent = ticket.assignedTo;
  ticket.assignedTo = agentId;
  await ticket.save();

  await createTicketHistory({
    ticket: ticket._id,
    performedBy: assignedBy,
    action: TICKET_HISTORY_ACTIONS.TICKET_ASSIGNED,
    fromValue: previousAgent ? previousAgent.toString() : null,
    toValue: agentId.toString(),
    metadata: {
      assignedAgentName: agent.name,
    },
  });

  return ticket;
};

export const updateTicketStatus = async ({ ticketId, status, updatedBy }) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    isDeleted: false,
  });
  if (!ticket) {
    throw new ApiError(404, ERROR_MESSAGES.TICKET_NOT_FOUND);
  }

  if (ticket.status === status) {
    throw new ApiError(400, "Ticket is already in the requested status");
  }

  const previousStatus = ticket.status;
  ticket.status = status;
  await ticket.save();

  await createTicketHistory({
    ticket: ticket._id,
    performedBy: updatedBy,
    action: TICKET_HISTORY_ACTIONS.STATUS_CHANGED,
    fromValue: previousStatus,
    toValue: status,
  });

  return ticket;
};

export const deleteTicket = async ({ ticketId, userId, role }) => {
  const ticket = await Ticket.findOne({ _id: ticketId, isDeleted: false });

  if (!ticket) {
    throw new ApiError(404, ERROR_MESSAGES.TICKET_NOT_FOUND);
  }

  validateTicketAccess({ ticket, userId, role });

  ticket.isDeleted = true;
  await ticket.save();

  return ticket;
};

export const reopenTicket = async ({ ticketId, userId, role }) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    isDeleted: false,
  });

  if (!ticket) {
    throw new ApiError(404, ERROR_MESSAGES.TICKET_NOT_FOUND);
  }

  validateTicketAccess({ ticket, userId, role });

  if (ticket.status !== TICKET_STATUS_VALUES.RESOLVED && ticket.status !== TICKET_STATUS_VALUES.CLOSED) {
    throw new ApiError(400, "Only resolved or closed tickets can be reopened");
  }

  const previousStatus = ticket.status;
  ticket.status = TICKET_STATUS_VALUES.OPEN;
  await ticket.save();

  await createTicketHistory({
    ticket: ticket._id,
    performedBy: userId,
    action: TICKET_HISTORY_ACTIONS.STATUS_CHANGED,
    fromValue: previousStatus,
    toValue: ticket.status,
  });

  return ticket;
};

export const closeTicket = async ({ ticketId, userId, role }) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    isDeleted: false,
  });

  if (!ticket) {
    throw new ApiError(404, ERROR_MESSAGES.TICKET_NOT_FOUND);
  }

  validateTicketAccess({ ticket, userId, role });

  if (ticket.status !== TICKET_STATUS_VALUES.RESOLVED) {
    throw new ApiError(400, "Only resolved tickets can be closed");
  }
  const previousStatus = ticket.status;
  ticket.status = TICKET_STATUS_VALUES.CLOSED;
  await ticket.save();

  await createTicketHistory({
    ticket: ticket._id,
    performedBy: userId,
    action: TICKET_HISTORY_ACTIONS.STATUS_CHANGED,
    fromValue: previousStatus,
    toValue: ticket.status,
  });
  return ticket;
};
