import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createTicket as createTicketService } from "./ticket.service.js";


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