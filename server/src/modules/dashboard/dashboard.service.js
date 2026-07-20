import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import Ticket from "../tickets/ticket.model.js";

export const getDashboard = async ({ userId, role }) => {
  switch (role) {
    case "CUSTOMER":
      return await getCustomerDashboard({ userId });

    case "AGENT":
      return await getAgentDashboard({ userId });

    case "ADMIN":
      return await getAdminDashboard();

    default:
      throw new ApiError(403, "Unauthorized role");
  }
};

const getCustomerDashboard = async ({ userId }) => {
  const dashboard = await Ticket.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalTickets: {
          $sum: 1,
        },
        openTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0],
          },
        },
        inProgressTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "IN_PROGRESS"] }, 1, 0],
          },
        },
        waitingForCustomerTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "WAITING_FOR_CUSTOMER"] }, 1, 0],
          },
        },
        resolvedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0],
          },
        },
        closedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "CLOSED"] }, 1, 0],
          },
        },
      },
    },
    {
        $project: {
            _id: 0,
            totalTickets: 1,
            openTickets: 1,
            inProgressTickets: 1,
            waitingForCustomerTickets: 1,
            resolvedTickets: 1,
            closedTickets: 1
        }
    }
  ]);

  return (
    dashboard[0] || {
      totalTickets: 0,
      openTickets: 0,
      inProgressTickets: 0,
      waitingForCustomerTickets: 0,
      resolvedTickets: 0,
      closedTickets: 0,
    }
  );
};

const getAgentDashboard = async ({ userId }) => {
    const dashboard = await Ticket.aggregate([
    {
      $match: {
        assignedTo: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalTickets: {
          $sum: 1,
        },
        openTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0],
          },
        },
        inProgressTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "IN_PROGRESS"] }, 1, 0],
          },
        },
        waitingForCustomerTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "WAITING_FOR_CUSTOMER"] }, 1, 0],
          },
        },
        resolvedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0],
          },
        },
        closedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "CLOSED"] }, 1, 0],
          },
        },
      },
    },
    {
        $project: {
            _id: 0,
            totalTickets: 1,
            openTickets: 1,
            inProgressTickets: 1,
            waitingForCustomerTickets: 1,
            resolvedTickets: 1,
            closedTickets: 1
        }
    }
  ]);

  return (
    dashboard[0] || {
      totalTickets: 0,
      openTickets: 0,
      inProgressTickets: 0,
      waitingForCustomerTickets: 0,
      resolvedTickets: 0,
      closedTickets: 0,
    }
  );
};

const getAdminDashboard = async () => {
  const dashboard = await Ticket.aggregate([
    {
      $group: {
        _id: null,
        totalTickets: { $sum: 1 },

        openTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0],
          },
        },

        inProgressTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "IN_PROGRESS"] }, 1, 0],
          },
        },

        waitingForCustomerTickets: {
          $sum: {
            $cond: [
              { $eq: ["$status", "WAITING_FOR_CUSTOMER"] },
              1,
              0,
            ],
          },
        },

        resolvedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0],
          },
        },

        closedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", "CLOSED"] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalTickets: 1,
        openTickets: 1,
        inProgressTickets: 1,
        waitingForCustomerTickets: 1,
        resolvedTickets: 1,
        closedTickets: 1,
      },
    },
  ]);

  return (
    dashboard[0] || {
      totalTickets: 0,
      openTickets: 0,
      inProgressTickets: 0,
      waitingForCustomerTickets: 0,
      resolvedTickets: 0,
      closedTickets: 0,
    }
  );
};