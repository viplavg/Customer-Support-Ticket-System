import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ALLOWED_TICKET_SORT_FIELDS, ALLOWED_TICKET_SORT_ORDER } from "./ticket.constants.js";
import { createTicket as createTicketService } from "./ticket.service.js";
import { getTickets as getTicketsService } from "./ticket.service.js";
import { getTicketById as getTicketByIdService } from "./ticket.service.js";
import { assignTicket as assignTicketService } from "./ticket.service.js";
import { updateTicketStatus as updateTicketStatusService } from "./ticket.service.js";
import { deleteTicket as deleteTicketService } from "./ticket.service.js";
import { reopenTicket as reopenTicketService } from "./ticket.service.js";

export const createTicket = asyncHandler(async (req, res) => {
    const {title, description, priority, category} = req.body;
    const createdBy = req.user.id;
    const ticket = await createTicketService({
        title, description, priority, category, createdBy
    });
    return res.status(201).json(
        new ApiResponse(ticket, "Ticket created successfully")
    )
});

export const getTickets = asyncHandler(async (req, res) => {
    const { id: userId, role } = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if(page < 1 || limit < 1 || limit > 50) {
        throw new ApiError(400, "Invalid pagination parameters");
    }

    const sortBy = req.query.sortBy || "createdAt";

    if(!ALLOWED_TICKET_SORT_FIELDS.includes(sortBy)) {
        throw new ApiError(400, "Invalid sortBy parameter");
    }

    const order = (req.query.order || "desc".toLowerCase());

    if(!ALLOWED_TICKET_SORT_ORDER.includes(order)){
        throw new ApiError(400, "Order must be either 'asc' or 'desc'");
    }

    const { status, priority, category } = req.query;
    const search = req.query.search || "";
    const tickets = await getTicketsService({
        userId, role, page, limit, sortBy, order, status, priority, category, search
    });
    return res.status(200).json(
        new ApiResponse(tickets, "Tickets fetched successfully")
    )
});

export const getTicketById = asyncHandler(async (req, res) => {
    const {id: ticketId} = req.params;
    const {id: userId, role} = req.user;

    const ticket = await getTicketByIdService({
        ticketId, userId, role 
    });

    return res.status(200).json(
        new ApiResponse(ticket, "Ticket fetched successfully")
    )
});

export const assignTicket = asyncHandler(async (req, res) => {
    const {id: ticketId} = req.params;
    const {id: assignedBy} = req.user;
    const {agentId} = req.body;

    const ticket = await assignTicketService({ticketId, agentId, assignedBy});

    return res.status(200).json(
        new ApiResponse(ticket, "Ticket assigned successfully")
    );
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
    const { id: ticketId } = req.params;
    const { id: updatedBy } = req.user;
    const {status} = req.body;

    const ticket = await updateTicketStatusService({ticketId, status, updatedBy});

    return res.status(200).json(
        new ApiResponse(ticket, "Ticket status updated successfully")
    );
});

export const deleteTicket = asyncHandler(async (req, res) => {
    const { id: ticketId } = req.params;
    const { id: userId, role } = req.user;
    const deletedTicket = await deleteTicketService({
        ticketId, userId, role
    });
    return res.status(200).json(
        new ApiResponse(deletedTicket, "Ticket deleted successfully")
    );
});

export const reopenTicket = asyncHandler(async (req, res) => {
    const {id: ticketId} = req.params;
    const {id: userId, role} = req.user;

    const reopenedTicket = await reopenTicketService({
        ticketId, userId, role
    });

    return res.status(200).json(
        new ApiResponse(reopenedTicket, "Ticket reopened successfully")
    )
});