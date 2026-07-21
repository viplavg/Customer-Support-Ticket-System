import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import Ticket from "../tickets/ticket.model.js";
import { USER_ROLES, TICKET_STATUS_VALUES } from "../tickets/ticket.constants.js";

export const getDashboard = async ({ userId, role }) => {
  switch (role) {
    case USER_ROLES.CUSTOMER:
      return await getCustomerDashboard({ userId });

    case USER_ROLES.AGENT:
      return await getAgentDashboard({ userId });

    case USER_ROLES.ADMIN:
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
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.OPEN] }, 1, 0],
          },
        },
        inProgressTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.IN_PROGRESS] }, 1, 0],
          },
        },
        waitingForCustomerTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.WAITING_FOR_CUSTOMER] }, 1, 0],
          },
        },
        resolvedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.RESOLVED] }, 1, 0],
          },
        },
        closedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.CLOSED] }, 1, 0],
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
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.OPEN] }, 1, 0],
          },
        },
        inProgressTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.IN_PROGRESS] }, 1, 0],
          },
        },
        waitingForCustomerTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.WAITING_FOR_CUSTOMER] }, 1, 0],
          },
        },
        resolvedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.RESOLVED] }, 1, 0],
          },
        },
        closedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.CLOSED] }, 1, 0],
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
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.OPEN] }, 1, 0],
          },
        },

        inProgressTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.IN_PROGRESS] }, 1, 0],
          },
        },

        waitingForCustomerTickets: {
          $sum: {
            $cond: [
              { $eq: ["$status", TICKET_STATUS_VALUES.WAITING_FOR_CUSTOMER] },
              1,
              0,
            ],
          },
        },

        resolvedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.RESOLVED] }, 1, 0],
          },
        },

        closedTickets: {
          $sum: {
            $cond: [{ $eq: ["$status", TICKET_STATUS_VALUES.CLOSED] }, 1, 0],
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