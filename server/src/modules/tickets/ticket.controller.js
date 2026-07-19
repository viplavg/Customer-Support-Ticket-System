import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createTicket as createTicketService } from "./ticket.service.js";
import { getTickets as getTicketsService } from "./ticket.service.js";
import { getTicketById as getTicketByIdService } from "./ticket.service.js";
import { assignTicket as assignTicketService } from "./ticket.service.js";
import { updateTicketStatus as updateTicketStatusService } from "./ticket.service.js";


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
    const tickets = await getTicketsService({userId, role});
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
    const {agentId} = req.body;

    const ticket = await assignTicketService({ticketId, agentId});

    return res.status(200).json(
        new ApiResponse(ticket, "Ticket assigned successfully")
    );
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
    const { id: ticketId } = req.params;
    const {status} = req.body;

    const ticket = await updateTicketStatusService({ticketId, status});

    return res.status(200).json(
        new ApiResponse(ticket, "Ticket status updated successfully")
    );
});