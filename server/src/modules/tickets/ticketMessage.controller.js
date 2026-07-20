import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { addTicketMessage as addTicketMessageService } from "./ticketMessage.service.js";
import { getTicketMessages as getTicketMessagesService } from "./ticketMessage.service.js";


export const addTicketMessage = asyncHandler(async (req , res) => {
    const {id: ticketId} = req.params;
    const {id: senderId, role} = req.user;
    const {message} = req.body;

    const ticketMessage = await addTicketMessageService({
        ticketId, senderId, role, message
    });

    return res.status(201).json(
        new ApiResponse(ticketMessage, "Message sent")
    );

});

export const getTicketMessages = asyncHandler(async (req, res) => {
    const { id: ticketId } = req.params;
    const { id: userId } = req.user;
    const { role } = req.user;

    const ticketMessages = await getTicketMessagesService({
        ticketId, userId, role
    });

    return res.status(201).json(
        new ApiResponse(ticketMessages, "Ticket Messages fetched successfully")
    );
})