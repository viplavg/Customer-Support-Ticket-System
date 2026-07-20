import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getDashboard as getDashboardService } from "./dashboard.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
    const { id: userId, role } = req.user;

    const dashboard = await getDashboardService({userId, role});

    return res.status(200).json(
        new ApiResponse(dashboard, "Dashboard fetched successfully")
    )
});

