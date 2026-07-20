import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getTicketHistory as getTicketHistoryService } from "./ticketHistory.service.js";


export const getTicketHistory = asyncHandler(async (req, res) => {
    const { id: ticketId } = req.params;
    const { id: userId, role } = req.user;
    const ticketHistory = await getTicketHistoryService({
        ticketId, userId, role
    });

    return res.status(200).json(
        new ApiResponse(ticketHistory, "Ticket History fetched successfully")
    );
})